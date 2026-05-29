import { GetUserChallengesUseCase } from "../../../application/use-cases/challenges/GetUserChallengesUseCase";
import { prisma } from "../../../infrastructure/database/prisma/prisma.client";
import { CHALLENGE_STATUS } from "../../../shared/constants/challenge.constants";
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

describe("GetUserChallengesUseCase", () => {

    let getUserChallengesUseCase: GetUserChallengesUseCase;

    beforeEach(() => {

        getUserChallengesUseCase = new GetUserChallengesUseCase();

        jest.clearAllMocks();

    });

    describe("execute", () => {

        test("should return completed user challenges successfully", async () => {

            (prisma.challenge.findMany as jest.Mock)
                .mockResolvedValue([
                    {
                        id: "challenge-1",
                        challengerId: "1",
                        challengedId: "2",
                        challengerVehicleId: "vehicle-1",
                        challengedVehicleId: "vehicle-2",
                        status: CHALLENGE_STATUS.COMPLETED,
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
                    status: CHALLENGE_STATUS.COMPLETED,
                });

            const result = await getUserChallengesUseCase.execute("1");

            expect(result).toEqual([
                {
                    id: "challenge-1",
                    status: CHALLENGE_STATUS.COMPLETED,
                },
            ]);

            expect(prisma.challenge.findMany)
                .toHaveBeenCalledWith({
                    where: {
                        OR: [
                            { challengerId: "1" },
                            { challengedId: "1" },
                        ],
                        status: CHALLENGE_STATUS.COMPLETED,
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

        test("should return empty list when user has no completed challenges", async () => {

            (prisma.challenge.findMany as jest.Mock)
                .mockResolvedValue([]);

            (prisma.vehicle.findMany as jest.Mock)
                .mockResolvedValue([]);

            const result = await getUserChallengesUseCase.execute("1");

            expect(result).toEqual([]);

        });

        test("should fetch only completed challenges", async () => {

            (prisma.challenge.findMany as jest.Mock)
                .mockResolvedValue([]);

            (prisma.vehicle.findMany as jest.Mock)
                .mockResolvedValue([]);

            await getUserChallengesUseCase.execute("1");

            expect(prisma.challenge.findMany)
                .toHaveBeenCalledWith({
                    where: {
                        OR: [
                            { challengerId: "1" },
                            { challengedId: "1" },
                        ],
                        status: CHALLENGE_STATUS.COMPLETED,
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

            await getUserChallengesUseCase.execute("1");

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