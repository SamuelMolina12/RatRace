import { prisma } from "../../../infrastructure/database/prisma/prisma.client";

export class GetAllChallengesUseCase {
  async execute(status?: string, page: number = 1, pageSize: number = 20) {
    const skip = (page - 1) * pageSize;

    const where = status ? { status } : {};

    const challenges = await prisma.challenge.findMany({
      where,
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
      skip,
      take: pageSize,
    });

    const total = await prisma.challenge.count({ where });

    return {
      challenges,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    };
  }
}
