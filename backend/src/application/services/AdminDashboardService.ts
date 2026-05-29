import { AdminRepository } from "../../domain/repositories/AdminRepository";
import { AdminDashboardDto } from "../dtos/AdminDashboardDto";

export class AdminDashboardService {
  constructor(private adminRepository: AdminRepository) {}

  async getDashboard(): Promise<AdminDashboardDto> {
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalVehicles,
      totalChallenges,
      completedChallenges,
      pendingChallenges,
      usersByRank,
    ] = await Promise.all([
      this.adminRepository.countUsers(),
      this.adminRepository.countUsersByEstado("ACTIVO"),
      this.adminRepository.countUsersByEstado("SUSPENDIDO"),
      this.adminRepository.countVehicles(),
      this.adminRepository.countChallenges(),
      this.adminRepository.countChallengesByStatus("completed"),
      this.adminRepository.countChallengesByStatus("pending"),
      this.adminRepository.countUsersByRank(),
    ]);

    return {
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalVehicles,
      totalChallenges,
      completedChallenges,
      pendingChallenges,
      usersByRank,
    };
  }
}
