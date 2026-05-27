import { GetAllChallengesUseCase } from "../../../application/use-cases/admin/GetAllChallengesUseCase";
import { prisma } from "../../../infrastructure/database/prisma/prisma.client";

jest.mock("../../../infrastructure/database/prisma/prisma.client", () => ({
    prisma: {
        challenge: {
            findMany: jest.fn(),
            count: jest.fn(),
        },
    },
}));

describe("GetAllChallengesUseCase", () => {

    let getAllChallengesUseCase: GetAllChallengesUseCase;

    beforeEach(() => {

        getAllChallengesUseCase = new GetAllChallengesUseCase();

        jest.clearAllMocks();

    });

    describe("execute", () => {

        test("should return all challenges successfully", async () => {

            (prisma.challenge.findMany as jest.Mock).mockResolvedValue([
                {
                    id: "1",
                    status: "PENDING",
                    challenger: {
                        id: "10",
                        username: "Samuel",
                        email: "samuel@gmail.com",
                        rank: "A",
                    },
                    challenged: {
                        id: "20",
                        username: "Carlos",
                        email: "carlos@gmail.com",
                        rank: "B",
                    },
                },
            ]);

            (prisma.challenge.count as jest.Mock).mockResolvedValue(1);

            const result = await getAllChallengesUseCase.execute();

            expect(result).toEqual({
                challenges: [
                    {
                        id: "1",
                        status: "PENDING",
                        challenger: {
                            id: "10",
                            username: "Samuel",
                            email: "samuel@gmail.com",
                            rank: "A",
                        },
                        challenged: {
                            id: "20",
                            username: "Carlos",
                            email: "carlos@gmail.com",
                            rank: "B",
                        },
                    },
                ],
                pagination: {
                    page: 1,
                    pageSize: 20,
                    total: 1,
                    pages: 1,
                },
            });

            expect(prisma.challenge.findMany)
                .toHaveBeenCalledWith({
                    where: {},
                    include: {
                        challenger: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                rank: true,
                            },
                        },
                        challenged: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                rank: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    skip: 0,
                    take: 20,
                });

        });

        test("should filter challenges by status", async () => {

            (prisma.challenge.findMany as jest.Mock).mockResolvedValue([]);

            (prisma.challenge.count as jest.Mock).mockResolvedValue(0);

            await getAllChallengesUseCase.execute("PENDING");

            expect(prisma.challenge.findMany)
                .toHaveBeenCalledWith({
                    where: {
                        status: "PENDING",
                    },
                    include: {
                        challenger: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                rank: true,
                            },
                        },
                        challenged: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                rank: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    skip: 0,
                    take: 20,
                });

            expect(prisma.challenge.count)
                .toHaveBeenCalledWith({
                    where: {
                        status: "PENDING",
                    },
                });

        });

        test("should apply pagination correctly", async () => {

            (prisma.challenge.findMany as jest.Mock).mockResolvedValue([]);

            (prisma.challenge.count as jest.Mock).mockResolvedValue(50);

            const result = await getAllChallengesUseCase.execute(
                undefined,
                2,
                10
            );

            expect(prisma.challenge.findMany)
                .toHaveBeenCalledWith({
                    where: {},
                    include: {
                        challenger: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                rank: true,
                            },
                        },
                        challenged: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                                rank: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    skip: 10,
                    take: 10,
                });

            expect(result.pagination).toEqual({
                page: 2,
                pageSize: 10,
                total: 50,
                pages: 5,
            });

        });

    });

});