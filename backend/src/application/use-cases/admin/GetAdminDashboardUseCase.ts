import { AdminDashboardService } from "../../services/AdminDashboardService";

export class GetAdminDashboardUseCase {
  constructor(private adminDashboardService: AdminDashboardService) {}

  async execute() {
    return this.adminDashboardService.getDashboard();
  }
}
