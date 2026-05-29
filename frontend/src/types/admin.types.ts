export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  estado: string;
  rank: string;
  wins: number;
  losses: number;
  consecutiveWins: number;
  profilePhoto?: string | null;
  locality?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUsersByRank {
  rank: string;
  count: number;
}

export interface AdminDashboard {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalVehicles: number;
  totalChallenges: number;
  completedChallenges: number;
  pendingChallenges: number;
  usersByRank: AdminUsersByRank[];
}

export interface AdminUsersResponse {
  users: AdminUser[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    pages: number;
  };
}

export interface AdminUsersQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  estado?: string;
  role?: string;
}

export interface AdminChallengePilot {
  id: string;
  username: string;
  email: string;
  rank: string;
}

export interface AdminChallenge {
  id: string;
  challengerId: string;
  challengedId: string;
  raceType: string;
  challengerVehicleId: string;
  challengedVehicleId: string | null;
  status: string;
  winnerId: string | null;
  challengerClaim: string | null;
  challengedClaim: string | null;
  agreedLocation: string | null;
  agreedDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  challenger: AdminChallengePilot;
  challenged: AdminChallengePilot;
}

export interface AdminChallengesResponse {
  challenges: AdminChallenge[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    pages: number;
  };
}

export interface AdminChallengesQuery {
  page?: number;
  pageSize?: number;
  status?: string;
}

export interface ResolveAdminChallengeRequest {
  action: "set_winner" | "cancel" | "annul";
  winnerId?: string;
}
