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

      const updatedChallenge = await prisma.challenge.update({
        where: { id: input.challengeId },
        data: {
          winnerId: input.winnerId,
          status: CHALLENGE_STATUS.COMPLETED,
        },
        include: {
          challenger: true,
          challenged: true,
        },
      });


      const winner =
        input.winnerId === challenge.challengerId
          ? challenge.challenger
          : challenge.challenged;
      const loser =
        input.winnerId === challenge.challengerId
          ? challenge.challenged
          : challenge.challenger;



      return updatedChallenge;
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
