import { prisma } from "../../../infrastructure/database/prisma/prisma.client";
import { CHALLENGE_STATUS } from "../../../shared/constants/challenge.constants";
import { AppError } from "../../../shared/errors/AppError";
import { RankingService } from "../../services/RankingService";

interface ResolveChallengeInput {
  challengeId: string;
  action: "set_winner" | "cancel" | "annul";
  winnerId?: string;
}

export class ResolveChallengeUseCase {
  async execute(input: ResolveChallengeInput) {
    const challenge = await prisma.challenge.findUnique({
      where: { id: input.challengeId },
      include: {
        challenger: true,
        challenged: true,
      },
    });

    if (!challenge) {
      throw new AppError("Reto no encontrado", 404);
    }

    if (input.action === "set_winner") {
      if (!input.winnerId) {
        throw new AppError("Debes especificar un winnerId", 400);
      }

      const isValidWinner =
        input.winnerId === challenge.challengerId ||
        input.winnerId === challenge.challengedId;

      if (!isValidWinner) {
        throw new AppError(
          "El ganador debe ser uno de los pilotos del reto",
          400,
        );
      }

      if (challenge.status !== CHALLENGE_STATUS.COMPLETED) {
        throw new AppError("Solo se pueden resolver retos completados", 400);
      }

      return prisma.$transaction(async (tx) => {
        const newWinnerId = input.winnerId!;

        if (challenge.winnerId === newWinnerId) {
          return challenge;
        }

        const newLoserId =
          newWinnerId === challenge.challengerId
            ? challenge.challengedId
            : challenge.challengerId;


        if (challenge.winnerId) {
          const prevWinnerId = challenge.winnerId;
          const prevLoserId =
            prevWinnerId === challenge.challengerId
              ? challenge.challengedId
              : challenge.challengerId;

          const prevWinner = await tx.user.findUnique({
            where: { id: prevWinnerId },
          });
          const prevLoser = await tx.user.findUnique({
            where: { id: prevLoserId },
          });

          if (!prevWinner || !prevLoser) {
            throw new AppError("No se encontraron los pilotos del reto", 404);
          }

          await tx.user.update({
            where: { id: prevWinnerId },
            data: {
              wins: { decrement: 1 },
              consecutiveWins: Math.max(prevWinner.consecutiveWins - 1, 0),
            },
          });

          await tx.user.update({
            where: { id: prevLoserId },
            data: {
              losses: { decrement: 1 },
              consecutiveWins: prevLoser.consecutiveWins + 1,
            },
          });
        }

        const winner = await tx.user.findUnique({ where: { id: newWinnerId } });
        const loser = await tx.user.findUnique({ where: { id: newLoserId } });

        if (!winner || !loser) {
          throw new AppError("No se encontraron los pilotos del reto", 404);
        }

        const newWinnerConsecutiveWins = winner.consecutiveWins + 1;

        const winnerRanksUp = RankingService.shouldRankUp(
          winner.rank,
          newWinnerConsecutiveWins,
        );

        const newWinnerRank = winnerRanksUp
          ? RankingService.getNextRank(winner.rank)
          : winner.rank;

        const finalWinnerConsecutiveWins = winnerRanksUp
          ? 0
          : newWinnerConsecutiveWins;

        const newLoserConsecutiveWins =
          RankingService.calculateLoserConsecutiveWins(loser.consecutiveWins);

        const updatedChallenge = await tx.challenge.update({
          where: { id: input.challengeId },
          data: {
            winnerId: newWinnerId,
            status: CHALLENGE_STATUS.COMPLETED,
          },
          include: { challenger: true, challenged: true },
        });

        await tx.user.update({
          where: { id: newWinnerId },
          data: {
            wins: { increment: 1 },
            consecutiveWins: finalWinnerConsecutiveWins,
            rank: newWinnerRank,
          },
        });

        await tx.user.update({
          where: { id: newLoserId },
          data: {
            losses: { increment: 1 },
            consecutiveWins: newLoserConsecutiveWins,
          },
        });

        return {
          challenge: updatedChallenge,
          ranking: {
            winner: {
              id: newWinnerId,
              previousRank: winner.rank,
              currentRank: newWinnerRank,
              rankedUp: winnerRanksUp,
              consecutiveWins: finalWinnerConsecutiveWins,
            },
            loser: {
              id: newLoserId,
              rank: loser.rank,
              consecutiveWins: newLoserConsecutiveWins,
            },
          },
        };
      });
    }

    if (input.action === "cancel") {
      const updatedChallenge = await prisma.challenge.update({
        where: { id: input.challengeId },
        data: {
          status: CHALLENGE_STATUS.CANCELLED,
        },
      });

      return updatedChallenge;
    }

    if (input.action === "annul") {
      const updatedChallenge = await prisma.challenge.update({
        where: { id: input.challengeId },
        data: {
          winnerId: null,
          status: CHALLENGE_STATUS.CANCELLED,
        },
      });

      return updatedChallenge;
    }

    throw new AppError("Acción no válida", 400);
  }
}
