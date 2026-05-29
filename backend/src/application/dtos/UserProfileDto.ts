export interface UserProfileDto {
  id: string;
  username: string;
  email: string;
  role: string;
  estado: string;
  rank: string;
  wins: number;
  losses: number;
  profilePhoto?: string | null;
  locality?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
}
