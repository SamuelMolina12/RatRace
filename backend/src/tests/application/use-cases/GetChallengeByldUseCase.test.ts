import { GetChallengeByIdUseCase } from "../../../application/use-cases/challenges/GetChallengeByIdUseCase";
import { prisma } from "../../../infrastructure/database/prisma/prisma.client";
import { AppError } from "../../../shared/errors/AppError";
import { ChallengeMapper } from "../../../application/mappers/ChallengeMapper";

jest.mock("../../../infrastructure/database/prisma/prisma.client", () => ({
    prisma: {
        challenge: {
            findUnique: jest.fn(),
        },
        vehicle: {
            findMany: jest.fn(),
        },
    },
}));

jest.mock("../../../application/mappers/ChallengeMapper", () => ({
    ChallengeMapper: {
        toResponse: jest.fn(),
    },
}));

describe("GetChallengeByIdUseCase", () => {

    let getChallengeByIdUseCase: GetChallengeByIdUseCase;

    beforeEach(() => {

        getChallengeByIdUseCase = new GetChallengeByIdUseCase();

        jest.clearAllMocks();

    });

    describe("execute", () => {

        test("should return challenge successfully", async () => {

            (prisma.challenge.findUnique as jest.Mock)
                .mockResolvedValue({
                    id: "challenge-1",
                    challengerId: "1",
                    challengedId: "2",
                    challengerVehicleId: "vehicle-1",
                    challengedVehicleId: "vehicle-2",
                    challenger: {
                        id: "1",
                        username: "Samuel",
                    },
                    challenged: {
                        id: "2",
                        username: "Carlos",
                    },
                });

            (prisma.vehicle.findMany as jest.Mock)
                .mockResolvedValue([
                    {
                        id: "vehicle-1",
                        vehicleType: "SPORT",
                    },
                    {
                        id: "vehicle-2",
                        vehicleType: "SPORT",
                    },
                ]);

            (ChallengeMapper.toResponse as jest.Mock)
                .mockReturnValue({
                    id: "challenge-1",
                    status: "PENDING",
                });

            const result = await getChallengeByIdUseCase.execute(
                "challenge-1",
                "1"
            );

            expect(result).toEqual({
                id: "challenge-1",
                status: "PENDING",
            });

            expect(prisma.challenge.findUnique)
                .toHaveBeenCalledWith({
                    where: {
                        id: "challenge-1",
                    },
                    include: {
                        challenger: true,
                        challenged: true,
                    },
                });

            expect(prisma.vehicle.findMany)
                .toHaveBeenCalledWith({
                    where: {
                        id: {
                            in: [
                                "vehicle-1",
                                "vehicle-2",
                            ],
                        },
                    },
                });

            expect(ChallengeMapper.toResponse)
                .toHaveBeenCalled();

        });

        test("should throw error if challenge does not exist", async () => {

            (prisma.challenge.findUnique as jest.Mock)
                .mockResolvedValue(null);

            await expect(
                getChallengeByIdUseCase.execute(
                    "challenge-1",
                    "1"
                )
            ).rejects.toThrow(
                new AppError(
                    "Reto no encontrado",
                    404
                )
            );

        });

        test("should throw error if user has no access to challenge", async () => {

            (prisma.challenge.findUnique as jest.Mock)
                .mockResolvedValue({
                    id: "challenge-1",
                    challengerId: "10",
                    challengedId: "20",
                });

            await expect(
                getChallengeByIdUseCase.execute(
                    "challenge-1",
                    "1"
                )
            ).rejects.toThrow(
                new AppError(
                    "No tienes acceso a este reto",
                    403
                )
            );

        });

        test("should map challenger and challenged vehicles correctly", async () => {

            (prisma.challenge.findUnique as jest.Mock)
                .mockResolvedValue({
                    id: "challenge-1",
                    challengerId: "1",
                    challengedId: "2",
                    challengerVehicleId: "vehicle-1",
                    challengedVehicleId: "vehicle-2",
                    challenger: {},
                    challenged: {},
                });

            (prisma.vehicle.findMany as jest.Mock)
                .mockResolvedValue([
                    {
                        id: "vehicle-1",
                        vehicleType: "SPORT",
                    },
                    {
                        id: "vehicle-2",
                        vehicleType: "SPORT",
                    },
                ]);

            await getChallengeByIdUseCase.execute(
                "challenge-1",
                "1"
            );

            expect(ChallengeMapper.toResponse)
                .toHaveBeenCalledWith(
                    expect.objectContaining({
                        challengerVehicle: {
                            id: "vehicle-1",
                            vehicleType: "SPORT",
                        },
                        challengedVehicle: {
                            id: "vehicle-2",
                            vehicleType: "SPORT",
                        },
                    })
                );

        });

    });

});