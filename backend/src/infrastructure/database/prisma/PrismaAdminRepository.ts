import {
  AdminRepository,
  DashboardUsersByRank,
} from "../../../domain/repositories/AdminRepository";
import { prisma } from "./prisma.client";

export class PrismaAdminRepository implements AdminRepository {
  countUsers() {
    return prisma.user.count();
  }

  countUsersByEstado(estado: string) {
    return 0;
  }

  countVehicles() {
    return prisma.vehicle.count();
  }

  countChallenges() {
    return prisma.challenge.count();
  }

  countChallengesByStatus(status: string) {
    return prisma.challenge.count({
      where: { status },
    });
  }

  async countUsersByRank(): Promise<DashboardUsersByRank[]> {
    const ranks = await prisma.user.groupBy({
      by: ["rank"],
      _count: {
        rank: true,
      },
      orderBy: {
        rank: "asc",
      },
    });

    return ranks.map((item) => ({
      rank: item.rank,
      count: item._count.rank,
    }));
  }
}
