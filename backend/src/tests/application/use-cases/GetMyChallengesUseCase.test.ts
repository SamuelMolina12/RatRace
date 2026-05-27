import { GetMyChallengesUseCase } from "../../../application/use-cases/challenges/GetMyChallengesUseCase";
import { prisma } from "../../../infrastructure/database/prisma/prisma.client";
import { ChallengeMapper } from "../../../application/mappers/ChallengeMapper";

jest.mock("../../../infrastructure/database/prisma/prisma.client", () => ({
    prisma: {
        challenge: {
            findMany: jest.fn(),
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

describe("GetMyChallengesUseCase", () => {

    let getMyChallengesUseCase: GetMyChallengesUseCase;

    beforeEach(() => {

        getMyChallengesUseCase = new GetMyChallengesUseCase();

        jest.clearAllMocks();

    });

    describe("execute", () => {

        test("should return user challenges successfully", async () => {

            (prisma.challenge.findMany as jest.Mock)
                .mockResolvedValue([
                    {
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
                    },
                ]);

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

            const result = await getMyChallengesUseCase.execute("1");

            expect(result).toEqual([
                {
                    id: "challenge-1",
                    status: "PENDING",
                },
            ]);

            expect(prisma.challenge.findMany)
                .toHaveBeenCalledWith({
                    where: {
                        AND: [
                            {
                                OR: [
                                    { challengerId: "1" },
                                    { challengedId: "1" },
                                ],
                            },
                            {},
                        ],
                    },
                    include: {
                        challenger: true,
                        challenged: true,
                    },
                    orderBy: {
                        createdAt: "desc",
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

        });

        test("should filter challenges by status", async () => {

            (prisma.challenge.findMany as jest.Mock)
                .mockResolvedValue([]);

            (prisma.vehicle.findMany as jest.Mock)
                .mockResolvedValue([]);

            await getMyChallengesUseCase.execute(
                "1",
                "PENDING"
            );

            expect(prisma.challenge.findMany)
                .toHaveBeenCalledWith({
                    where: {
                        AND: [
                            {
                                OR: [
                                    { challengerId: "1" },
                                    { challengedId: "1" },
                                ],
                            },
                            {
                                status: "PENDING",
                            },
                        ],
                    },
                    include: {
                        challenger: true,
                        challenged: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });

        });

        test("should return empty challenges list when user has no challenges", async () => {

            (prisma.challenge.findMany as jest.Mock)
                .mockResolvedValue([]);

            (prisma.vehicle.findMany as jest.Mock)
                .mockResolvedValue([]);

            const result = await getMyChallengesUseCase.execute("1");

            expect(result).toEqual([]);

        });

        test("should map challenger and challenged vehicles correctly", async () => {

            (prisma.challenge.findMany as jest.Mock)
                .mockResolvedValue([
                    {
                        id: "challenge-1",
                        challengerId: "1",
                        challengedId: "2",
                        challengerVehicleId: "vehicle-1",
                        challengedVehicleId: "vehicle-2",
                        challenger: {},
                        challenged: {},
                    },
                ]);

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

            await getMyChallengesUseCase.execute("1");

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