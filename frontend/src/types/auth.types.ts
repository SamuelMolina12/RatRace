// ─── Auth Types ─────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  profilePhoto?: string;
  zone?: ZoneInput[];
}

export interface ZoneInput {
  locality: string;
  city: string;
  state: string;
  country: string;
}


export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: string;
  rank: string;
  wins: number;
  losses: number;
  consecutiveWins?: number;
  profilePhoto: string | null;
  locality: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}


export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}
