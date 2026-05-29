import { CreateChallengeUseCase } from "../../../application/use-cases/challenges/CreateChallengeUseCase";
import { prisma } from "../../../infrastructure/database/prisma/prisma.client";
import { CHALLENGE_STATUS, RACE_TYPES } from "../../../shared/constants/challenge.constants";
import { AppError } from "../../../shared/errors/AppError";

jest.mock("../../../infrastructure/database/prisma/prisma.client", () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
        },
        vehicle: {
            findFirst: jest.fn(),
        },
        challenge: {
            findFirst: jest.fn(),
            create: jest.fn(),
        },
    },
}));

describe("CreateChallengeUseCase", () => {

    let createChallengeUseCase: CreateChallengeUseCase;

    beforeEach(() => {

        createChallengeUseCase = new CreateChallengeUseCase();

        jest.clearAllMocks();

    });

    describe("execute", () => {

        test("should create challenge successfully", async () => {

            (prisma.user.findUnique as jest.Mock)
                .mockResolvedValueOnce({
                    id: "1",
                    rank: "A",
                })
                .mockResolvedValueOnce({
                    id: "2",
                    rank: "A",
                });

            (prisma.vehicle.findFirst as jest.Mock)
                .mockResolvedValueOnce({
                    id: "vehicle-1",
                    vehicleType: "SPORT",
                })
                .mockResolvedValueOnce({
                    id: "vehicle-2",
                    vehicleType: "SPORT",
                });

            (prisma.challenge.findFirst as jest.Mock)
                .mockResolvedValue(null);

            (prisma.challenge.create as jest.Mock)
                .mockResolvedValue({
                    id: "challenge-1",
                    status: CHALLENGE_STATUS.PENDING,
                });

            const result = await createChallengeUseCase.execute(
                "1",
                {
                    challengedId: "2",
                    raceType: RACE_TYPES.QUARTER_MILE,
                    agreedLocation: "Medellín",
                    agreedDate: "2025-06-01",
                    notes: "Reto amistoso",
                }
            );

            expect(result).toEqual({
                id: "challenge-1",
                status: CHALLENGE_STATUS.PENDING,
            });

            expect(prisma.challenge.create)
                .toHaveBeenCalledWith({
                    data: {
                        challengerId: "1",
                        challengedId: "2",
                        raceType: RACE_TYPES.QUARTER_MILE,
                        challengerVehicleId: "vehicle-1",
                        challengedVehicleId: "vehicle-2",
                        status: CHALLENGE_STATUS.PENDING,
                        agreedLocation: "Medellín",
                        agreedDate: new Date("2025-06-01"),
                        notes: "Reto amistoso",
                    },
                });

        });

        test("should throw error if challengedId is missing", async () => {

            await expect(
                createChallengeUseCase.execute(
                    "1",
                    {
                        challengedId: "",
                        raceType: RACE_TYPES.QUARTER_MILE,
                    } as any
                )
            ).rejects.toThrow(
                new AppError(
                    "El piloto retado es obligatorio",
                    400
                )
            );

        });

        test("should throw error if challenger challenges himself", async () => {

            await expect(
                createChallengeUseCase.execute(
                    "1",
                    {
                        challengedId: "1",
                        raceType: RACE_TYPES.QUARTER_MILE,
                    }
                )
            ).rejects.toThrow(
                new AppError(
                    "No puedes retarte a ti mismo",
                    400
                )
            );

        });

        test("should throw error if race type is invalid", async () => {

            await expect(
                createChallengeUseCase.execute(
                    "1",
                    {
                        challengedId: "2",
                        raceType: "INVALID_TYPE" as any,
                    }
                )
            ).rejects.toThrow(
                new AppError(
                    "Tipo de carrera no válido",
                    400
                )
            );

        });

        test("should throw error if challenger does not exist", async () => {

            (prisma.user.findUnique as jest.Mock)
                .mockResolvedValue(null);

            await expect(
                createChallengeUseCase.execute(
                    "1",
                    {
                        challengedId: "2",
                        raceType: RACE_TYPES.QUARTER_MILE,
                    }
                )
            ).rejects.toThrow(
                new AppError(
                    "Piloto retador no encontrado",
                    404
                )
            );

        });

        test("should throw error if challenged does not exist", async () => {

            (prisma.user.findUnique as jest.Mock)
                .mockResolvedValueOnce({
                    id: "1",
                    rank: "A",
                })
                .mockResolvedValueOnce(null);

            await expect(
                createChallengeUseCase.execute(
                    "1",
                    {
                        challengedId: "2",
                        raceType: RACE_TYPES.QUARTER_MILE,
                    }
                )
            ).rejects.toThrow(
                new AppError(
                    "Piloto retado no encontrado",
                    404
                )
            );

        });

        test("should throw error if users have different ranks", async () => {

            (prisma.user.findUnique as jest.Mock)
                .mockResolvedValueOnce({
                    id: "1",
                    rank: "A",
                })
                .mockResolvedValueOnce({
                    id: "2",
                    rank: "B",
                });

            await expect(
                createChallengeUseCase.execute(
                    "1",
                    {
                        challengedId: "2",
                        raceType: RACE_TYPES.QUARTER_MILE,
                    }
                )
            ).rejects.toThrow(
                new AppError(
                    "Solo puedes retar pilotos del mismo rango",
                    400
                )
            );

        });

        test("should throw error if challenger has no active vehicle", async () => {

            (prisma.user.findUnique as jest.Mock)
                .mockResolvedValueOnce({
                    id: "1",
                    rank: "A",
                })
                .mockResolvedValueOnce({
                    id: "2",
                    rank: "A",
                });

            (prisma.vehicle.findFirst as jest.Mock)
                .mockResolvedValueOnce(null);

            await expect(
                createChallengeUseCase.execute(
                    "1",
                    {
                        challengedId: "2",
                        raceType: RACE_TYPES.QUARTER_MILE,
                    }
                )
            ).rejects.toThrow(
                new AppError(
                    "Debes tener un vehículo activo para retar",
                    400
                )
            );

        });

        test("should throw error if there is already an active challenge", async () => {

            (prisma.user.findUnique as jest.Mock)
                .mockResolvedValueOnce({
                    id: "1",
                    rank: "A",
                })
                .mockResolvedValueOnce({
                    id: "2",
                    rank: "A",
                });

            (prisma.vehicle.findFirst as jest.Mock)
                .mockResolvedValueOnce({
                    id: "vehicle-1",
                    vehicleType: "SPORT",
                })
                .mockResolvedValueOnce({
                    id: "vehicle-2",
                    vehicleType: "SPORT",
                });

            (prisma.challenge.findFirst as jest.Mock)
                .mockResolvedValue({
                    id: "challenge-existing",
                });

            await expect(
                createChallengeUseCase.execute(
                    "1",
                    {
                        challengedId: "2",
                        raceType: RACE_TYPES.QUARTER_MILE,
                    }
                )
            ).rejects.toThrow(
                new AppError(
                    "Ya existe un reto activo con este piloto",
                    400
                )
            );

        });

    });

});
