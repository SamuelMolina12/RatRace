import { ResolveChallengeUseCase } from "../../../application/use-cases/admin/ResolveChallengeUseCase";
import { prisma } from "../../../infrastructure/database/prisma/prisma.client";
import { CHALLENGE_STATUS } from "../../../shared/constants/challenge.constants";
import { AppError } from "../../../shared/errors/AppError";

jest.mock("../../../infrastructure/database/prisma/prisma.client", () => ({
  prisma: {
    $transaction: jest.fn(),
    challenge: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe("ResolveChallengeUseCase", () => {
  let resolveChallengeUseCase: ResolveChallengeUseCase;

  beforeEach(() => {
    resolveChallengeUseCase = new ResolveChallengeUseCase();

    jest.clearAllMocks();
  });

  describe("execute", () => {
    test("should resolve challenge successfully with a winner", async () => {
      (prisma.challenge.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        challengerId: "10",
        challengedId: "20",
        status: CHALLENGE_STATUS.COMPLETED,
        challenger: {
          id: "10",
          username: "Samuel",
        },
        challenged: {
          id: "20",
          username: "Carlos",
        },
      });

      (prisma.$transaction as jest.Mock).mockImplementation(
        async (callback: any) => {
          const tx = {
            user: {
              findUnique: jest
                .fn()
                .mockResolvedValueOnce({
                  id: "10",
                  rank: "A",
                  consecutiveWins: 2,
                })
                .mockResolvedValueOnce({
                  id: "20",
                  rank: "A",
                  consecutiveWins: 1,
                }),
              update: jest.fn(),
            },
            challenge: {
              update: jest.fn().mockResolvedValue({
                id: "1",
                winnerId: "10",
                status: CHALLENGE_STATUS.COMPLETED,
              }),
            },
          };

          return callback(tx);
        },
      );

      const result = await resolveChallengeUseCase.execute({
        challengeId: "1",
        action: "set_winner",
        winnerId: "10",
      });

      expect((result as any).challenge).toEqual({
        id: "1",
        winnerId: "10",
        status: CHALLENGE_STATUS.COMPLETED,
      });

      expect(prisma.$transaction).toHaveBeenCalled();
    });

    test("should resolve disputed challenge successfully with a winner", async () => {
      (prisma.challenge.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        challengerId: "10",
        challengedId: "20",
        status: CHALLENGE_STATUS.DISPUTED,
        challenger: {
          id: "10",
          username: "Samuel",
        },
        challenged: {
          id: "20",
          username: "Carlos",
        },
      });

      (prisma.$transaction as jest.Mock).mockImplementation(
        async (callback: any) => {
          const tx = {
            user: {
              findUnique: jest
                .fn()
                .mockResolvedValueOnce({
                  id: "10",
                  rank: "A",
                  consecutiveWins: 2,
                })
                .mockResolvedValueOnce({
                  id: "20",
                  rank: "A",
                  consecutiveWins: 1,
                }),
              update: jest.fn(),
            },
            challenge: {
              update: jest.fn().mockResolvedValue({
                id: "1",
                winnerId: "10",
                status: CHALLENGE_STATUS.COMPLETED,
              }),
            },
          };

          return callback(tx);
        },
      );

      const result = await resolveChallengeUseCase.execute({
        challengeId: "1",
        action: "set_winner",
        winnerId: "10",
      });

      expect((result as any).challenge).toEqual({
        id: "1",
        winnerId: "10",
        status: CHALLENGE_STATUS.COMPLETED,
      });
    });

    test("should cancel challenge successfully", async () => {
      (prisma.challenge.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
      });

      (prisma.challenge.update as jest.Mock).mockResolvedValue({
        id: "1",
        status: CHALLENGE_STATUS.CANCELLED,
      });

      const result = await resolveChallengeUseCase.execute({
        challengeId: "1",
        action: "cancel",
      });

      expect(result).toEqual({
        id: "1",
        status: CHALLENGE_STATUS.CANCELLED,
      });

      expect(prisma.challenge.update).toHaveBeenCalledWith({
        where: {
          id: "1",
        },
        data: {
          status: CHALLENGE_STATUS.CANCELLED,
        },
      });
    });

    test("should annul challenge successfully", async () => {
      (prisma.challenge.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
      });

      (prisma.challenge.update as jest.Mock).mockResolvedValue({
        id: "1",
        winnerId: null,
        status: CHALLENGE_STATUS.CANCELLED,
      });

      const result = await resolveChallengeUseCase.execute({
        challengeId: "1",
        action: "annul",
      });

      expect(result).toEqual({
        id: "1",
        winnerId: null,
        status: CHALLENGE_STATUS.CANCELLED,
      });

      expect(prisma.challenge.update).toHaveBeenCalledWith({
        where: {
          id: "1",
        },
        data: {
          winnerId: null,
          status: CHALLENGE_STATUS.CANCELLED,
        },
      });
    });

    test("should throw error if challenge does not exist", async () => {
      (prisma.challenge.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        resolveChallengeUseCase.execute({
          challengeId: "1",
          action: "cancel",
        }),
      ).rejects.toThrow(new AppError("Reto no encontrado", 404));
    });

    test("should throw error if winnerId is missing", async () => {
      (prisma.challenge.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        challengerId: "10",
        challengedId: "20",
        status: CHALLENGE_STATUS.COMPLETED,
      });

      await expect(
        resolveChallengeUseCase.execute({
          challengeId: "1",
          action: "set_winner",
        }),
      ).rejects.toThrow(new AppError("Debes especificar un winnerId", 400));
    });

    test("should throw error if winner is invalid", async () => {
      (prisma.challenge.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        challengerId: "10",
        challengedId: "20",
        status: CHALLENGE_STATUS.COMPLETED,
      });

      await expect(
        resolveChallengeUseCase.execute({
          challengeId: "1",
          action: "set_winner",
          winnerId: "99",
        }),
      ).rejects.toThrow(
        new AppError("El ganador debe ser uno de los pilotos del reto", 400),
      );
    });

    test("should throw error if challenge is not completed or disputed", async () => {
      (prisma.challenge.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        challengerId: "10",
        challengedId: "20",
        status: CHALLENGE_STATUS.PENDING,
      });

      await expect(
        resolveChallengeUseCase.execute({
          challengeId: "1",
          action: "set_winner",
          winnerId: "10",
        }),
      ).rejects.toThrow(
        new AppError(
          "Solo se pueden resolver retos completados o en disputa",
          400,
        ),
      );
    });

    test("should throw error if action is invalid", async () => {
      (prisma.challenge.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
      });

      await expect(
        resolveChallengeUseCase.execute({
          challengeId: "1",
          action: "invalid" as any,
        }),
      ).rejects.toThrow(new AppError("Acción no válida", 400));
    });
  });
});
