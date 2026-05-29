import { UpdateChallengeStatusUseCase } from "../../../application/use-cases/challenges/UpdateChallengeStatusUseCase";
import { prisma } from "../../../infrastructure/database/prisma/prisma.client";
import { CHALLENGE_STATUS } from "../../../shared/constants/challenge.constants";
import { AppError } from "../../../shared/errors/AppError";
import { RankingService } from "../../../application/services/RankingService";

jest.mock("../../../infrastructure/database/prisma/prisma.client", () => ({
    prisma: {
        challenge: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        $transaction: jest.fn(),
    },
}));

jest.mock("../../../application/services/RankingService", () => ({
    RankingService: {
        shouldRankUp: jest.fn(),
        getNextRank: jest.fn(),
        calculateLoserConsecutiveWins: jest.fn(),
    },
}));

describe("UpdateChallengeStatusUseCase", () => {

    let updateChallengeStatusUseCase: UpdateChallengeStatusUseCase;

    beforeEach(() => {

        updateChallengeStatusUseCase = new UpdateChallengeStatusUseCase();

        jest.clearAllMocks();

    });

    describe("accept", () => {

        test("should accept challenge successfully", async () => {

            (prisma.challenge.findUnique as jest.Mock)
                .mockResolvedValue({
                    id: "challenge-1",
                    challengedId: "2",
                    status: CHALLENGE_STATUS.PENDING,
                });

            (prisma.challenge.update as jest.Mock)
                .mockResolvedValue({
                    id: "challenge-1",
                    status: CHALLENGE_STATUS.ACCEPTED,
                });

            const result = await updateChallengeStatusUseCase.accept(
                "challenge-1",
                "2"
            );

            expect(result).toEqual({
                id: "challenge-1",
                status: CHALLENGE_STATUS.ACCEPTED,
            });

        });

        test("should throw error if challenge does not exist", async () => {

            (prisma.challenge.findUnique as jest.Mock)
                .mockResolvedValue(null);

            await expect(
                updateChallengeStatusUseCase.accept(
                    "challenge-1",
                    "2"
                )
            ).rejects.toThrow(
                new AppError("Reto no encontrado", 404)
            );

        });

        test("should throw error if user is not challenged pilot", async () => {

            (prisma.challenge.findUnique as jest.Mock)
                .mockResolvedValue({
                    challengedId: "10",
                    status: CHALLENGE_STATUS.PENDING,
                });

            await expect(
                updateChallengeStatusUseCase.accept(
                    "challenge-1",
                    "2"
                )
            ).rejects.toThrow(
                new AppError(
                    "Solo el piloto retado puede aceptar este reto",
                    403
                )
            );

        });

    });

    describe("reject", () => {

        test("should reject challenge successfully", async () => {

            (prisma.challenge.findUnique as jest.Mock)
                .mockResolvedValue({
                    id: "challenge-1",
                    challengedId: "2",
                    status: CHALLENGE_STATUS.PENDING,
                });

            (prisma.challenge.update as jest.Mock)
                .mockResolvedValue({
                    id: "challenge-1",
                    status: CHALLENGE_STATUS.REJECTED,
                });

            const result = await updateChallengeStatusUseCase.reject(
                "challenge-1",
                "2"
            );

            expect(result).toEqual({
                id: "challenge-1",
                status: CHALLENGE_STATUS.REJECTED,
            });

        });

    });

    describe("cancel", () => {

        test("should cancel challenge successfully", async () => {

            (prisma.challenge.findUnique as jest.Mock)
                .mockResolvedValue({
                    id: "challenge-1",
                    challengerId: "1",
                    status: CHALLENGE_STATUS.PENDING,
                });

            (prisma.challenge.update as jest.Mock)
                .mockResolvedValue({
                    id: "challenge-1",
                    status: CHALLENGE_STATUS.CANCELLED,
                });

            const result = await updateChallengeStatusUseCase.cancel(
                "challenge-1",
                "1"
            );

            expect(result).toEqual({
                id: "challenge-1",
                status: CHALLENGE_STATUS.CANCELLED,
            });

        });

    });

    describe("start", () => {

        test("should start challenge successfully", async () => {

            (prisma.challenge.findUnique as jest.Mock)
                .mockResolvedValue({
                    id: "challenge-1",
                    challengerId: "1",
                    challengedId: "2",
                    status: CHALLENGE_STATUS.ACCEPTED,
                });

            (prisma.challenge.update as jest.Mock)
                .mockResolvedValue({
                    id: "challenge-1",
                    status: CHALLENGE_STATUS.IN_PROGRESS,
                });

            const result = await updateChallengeStatusUseCase.start(
                "challenge-1",
                "1"
            );

            expect(result).toEqual({
                id: "challenge-1",
                status: CHALLENGE_STATUS.IN_PROGRESS,
            });

        });

    });

    describe("complete", () => {

        test("should complete challenge successfully", async () => {

            (prisma.challenge.findUnique as jest.Mock)
                .mockResolvedValue({
                    id: "challenge-1",
                    challengerId: "1",
                    challengedId: "2",
                    status: CHALLENGE_STATUS.IN_PROGRESS,
                });

            (RankingService.shouldRankUp as jest.Mock)
                .mockReturnValue(false);

            (RankingService.calculateLoserConsecutiveWins as jest.Mock)
                .mockReturnValue(0);

            (prisma.$transaction as jest.Mock)
                .mockImplementation(async (callback) => {

                    const tx = {
                        user: {
                            findUnique: jest
                                .fn()
                                .mockResolvedValueOnce({
                                    id: "1",
                                    rank: "A",
                                    consecutiveWins: 2,
                                })
                                .mockResolvedValueOnce({
                                    id: "2",
                                    rank: "A",
                                    consecutiveWins: 1,
                                }),

                            update: jest.fn(),
                        },

                        challenge: {
                            update: jest.fn()
                                .mockResolvedValue({
                                    id: "challenge-1",
                                    status: CHALLENGE_STATUS.COMPLETED,
                                    winnerId: "1",
                                }),
                        },
                    };

                    return callback(tx);

                });

            const result = await updateChallengeStatusUseCase.complete(
                "challenge-1",
                "1",
                "1"
            );

            expect(result).toEqual({
                challenge: {
                    id: "challenge-1",
                    status: CHALLENGE_STATUS.COMPLETED,
                    winnerId: "1",
                },
                ranking: {
                    winner: {
                        id: "1",
                        previousRank: "A",
                        currentRank: "A",
                        rankedUp: false,
                        consecutiveWins: 3,
                    },
                    loser: {
                        id: "2",
                        rank: "A",
                        consecutiveWins: 0,
                    },
                },
            });

        });

        test("should throw error if winner is invalid", async () => {

            (prisma.challenge.findUnique as jest.Mock)
                .mockResolvedValue({
                    challengerId: "1",
                    challengedId: "2",
                    status: CHALLENGE_STATUS.IN_PROGRESS,
                });

            await expect(
                updateChallengeStatusUseCase.complete(
                    "challenge-1",
                    "1",
                    "99"
                )
            ).rejects.toThrow(
                new AppError(
                    "El ganador debe ser uno de los pilotos del reto",
                    400
                )
            );

        });

    });

});