export interface DashboardUsersByRank {
  rank: string;
  count: number;
}

export interface AdminRepository {
  countUsers(): Promise<number>;
  countUsersByEstado(estado: string): Promise<number>;
  countVehicles(): Promise<number>;
  countChallenges(): Promise<number>;
  countChallengesByStatus(status: string): Promise<number>;
  countUsersByRank(): Promise<DashboardUsersByRank[]>;
}
