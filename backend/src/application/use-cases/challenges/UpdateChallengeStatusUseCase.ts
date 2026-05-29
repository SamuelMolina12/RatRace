import { prisma } from "../../../infrastructure/database/prisma/prisma.client";
import { CHALLENGE_STATUS } from "../../../shared/constants/challenge.constants";
import { AppError } from "../../../shared/errors/AppError";
import { RankingService } from "../../services/RankingService";

export class UpdateChallengeStatusUseCase {
    async accept(challengeId: string, userId: string) {
        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId },
        });

        if (!challenge) {
            throw new AppError("Reto no encontrado", 404);
        }

        if (challenge.challengedId !== userId) {
            throw new AppError("Solo el piloto retado puede aceptar este reto", 403);
        }

        if (challenge.status !== CHALLENGE_STATUS.PENDING) {
            throw new AppError("Solo se pueden aceptar retos pendientes", 400);
        }

        return prisma.challenge.update({
            where: { id: challengeId },
            data: {
                status: CHALLENGE_STATUS.ACCEPTED,
            },
        });
    }

    async reject(challengeId: string, userId: string) {
        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId },
        });

        if (!challenge) {
            throw new AppError("Reto no encontrado", 404);
        }

        if (challenge.challengedId !== userId) {
            throw new AppError("Solo el piloto retado puede rechazar este reto", 403);
        }

        if (challenge.status !== CHALLENGE_STATUS.PENDING) {
            throw new AppError("Solo se pueden rechazar retos pendientes", 400);
        }

        return prisma.challenge.update({
            where: { id: challengeId },
            data: {
                status: CHALLENGE_STATUS.REJECTED,
            },
        });
    }

    async cancel(challengeId: string, userId: string) {
        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId },
        });

        if (!challenge) {
            throw new AppError("Reto no encontrado", 404);
        }

        if (challenge.challengerId !== userId) {
            throw new AppError("Solo el piloto retador puede cancelar este reto", 403);
        }

        if (challenge.status !== CHALLENGE_STATUS.PENDING) {
            throw new AppError("Solo se pueden cancelar retos pendientes", 400);
        }

        return prisma.challenge.update({
            where: { id: challengeId },
            data: {
                status: CHALLENGE_STATUS.CANCELLED,
            },
        });
    }

    async start(challengeId: string, userId: string) {
        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId },
        });

        if (!challenge) {
            throw new AppError("Reto no encontrado", 404);
        }

        if (challenge.challengerId !== userId && challenge.challengedId !== userId) {
            throw new AppError("No tienes acceso a este reto", 403);
        }

        if (challenge.status !== CHALLENGE_STATUS.ACCEPTED) {
            throw new AppError("Solo se pueden iniciar retos aceptados", 400);
        }

        return prisma.challenge.update({
            where: { id: challengeId },
            data: {
                status: CHALLENGE_STATUS.IN_PROGRESS,
            },
        });
    }

    async complete(challengeId: string, userId: string, winnerId: string) {
        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId },
        });

        if (!challenge) {
            throw new AppError("Reto no encontrado", 404);
        }

        if (challenge.challengerId !== userId && challenge.challengedId !== userId) {
            throw new AppError("No tienes acceso a este reto", 403);
        }

        if (challenge.status !== CHALLENGE_STATUS.IN_PROGRESS) {
            throw new AppError("Solo se pueden completar retos en curso", 400);
        }

        if (
            winnerId !== challenge.challengerId &&
            winnerId !== challenge.challengedId
        ) {
            throw new AppError("El ganador debe ser uno de los pilotos del reto", 400);
        }

        const isChallenger = userId === challenge.challengerId;
        const newChallengerClaim = isChallenger ? winnerId : challenge.challengerClaim;
        const newChallengedClaim = !isChallenger ? winnerId : challenge.challengedClaim;

        if (newChallengerClaim && newChallengedClaim) {
            if (newChallengerClaim === newChallengedClaim) {
                // Hay acuerdo
                const finalWinnerId = newChallengerClaim;
                const loserId =
                    finalWinnerId === challenge.challengerId
                        ? challenge.challengedId
                        : challenge.challengerId;

                return prisma.$transaction(async (tx) => {
                    const winner = await tx.user.findUnique({
                        where: { id: finalWinnerId },
                    });

                    const loser = await tx.user.findUnique({
                        where: { id: loserId },
                    });

                    if (!winner || !loser) {
                        throw new AppError("No se encontraron los pilotos del reto", 404);
                    }

                    const newWinnerConsecutiveWins = winner.consecutiveWins + 1;

                    const winnerRanksUp = RankingService.shouldRankUp(
                        winner.rank,
                        newWinnerConsecutiveWins
                    );

                    const newWinnerRank = winnerRanksUp
                        ? RankingService.getNextRank(winner.rank)
                        : winner.rank;

                    const finalWinnerConsecutiveWins = winnerRanksUp
                        ? 0
                        : newWinnerConsecutiveWins;

                    const newLoserConsecutiveWins =
                        RankingService.calculateLoserConsecutiveWins(loser.consecutiveWins);

                    const completedChallenge = await tx.challenge.update({
                        where: { id: challengeId },
                        data: {
                            status: CHALLENGE_STATUS.COMPLETED,
                            winnerId: finalWinnerId,
                            challengerClaim: newChallengerClaim,
                            challengedClaim: newChallengedClaim,
                        },
                    });

                    await tx.user.update({
                        where: { id: finalWinnerId },
                        data: {
                            wins: { increment: 1 },
                            consecutiveWins: finalWinnerConsecutiveWins,
                            rank: newWinnerRank,
                        },
                    });

                    await tx.user.update({
                        where: { id: loserId },
                        data: {
                            losses: { increment: 1 },
                            consecutiveWins: newLoserConsecutiveWins,
                        },
                    });

                    return {
                        challenge: completedChallenge,
                        ranking: {
                            winner: {
                                id: finalWinnerId,
                                previousRank: winner.rank,
                                currentRank: newWinnerRank,
                                rankedUp: winnerRanksUp,
                                consecutiveWins: finalWinnerConsecutiveWins,
                            },
                            loser: {
                                id: loserId,
                                rank: loser.rank,
                                consecutiveWins: newLoserConsecutiveWins,
                            },
                        },
                    };
                });
            } else {
                // No hay acuerdo: Disputa
                const disputedChallenge = await prisma.challenge.update({
                    where: { id: challengeId },
                    data: {
                        status: CHALLENGE_STATUS.DISPUTED,
                        challengerClaim: newChallengerClaim,
                        challengedClaim: newChallengedClaim,
                    },
                });

                return {
                    challenge: disputedChallenge,
                    disputed: true,
                };
            }
        } else {
            // Solo uno ha reclamado
            const updatedChallenge = await prisma.challenge.update({
                where: { id: challengeId },
                data: {
                    challengerClaim: newChallengerClaim,
                    challengedClaim: newChallengedClaim,
                },
            });

            return {
                challenge: updatedChallenge,
                waitingForOther: true,
            };
        }
    }
}