export interface AdminUsersByRankDto {
  rank: string;
  count: number;
}

export interface AdminDashboardDto {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalVehicles: number;
  totalChallenges: number;
  completedChallenges: number;
  pendingChallenges: number;
  usersByRank: AdminUsersByRankDto[];
}
