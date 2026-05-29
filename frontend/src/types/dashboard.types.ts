export interface UserProfile {
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

export interface Vehicle {
  id: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  plate?: string;
  photo?: string;
  modifications?: string;
  active: boolean;
}

export interface DiscoverPilot {
  id: string;
  username: string;
  profilePhoto: string | null;
  locality: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  rank: string;
  wins: number;
  losses: number;
  consecutiveWins: number;
  vehicles: Vehicle[];
}

export interface DiscoverPilotsResponse {
  items: DiscoverPilot[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Challenge {
  id: string;
  challengerId: string;
  challengerName?: string;
  challengedId: string;
  challengedName?: string;
  raceType: string;
  challengerVehicleId: string;
  challengerVehicleName?: string;
  challengedVehicleId: string | null;
  challengedVehicleName?: string;
  status: ChallengeStatus;
  winnerId: string | null;
  agreedLocation: string | null;
  agreedDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ChallengeStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "in_progress"
  | "completed"
  | "canceled"
  | "disputed";

export interface CreateChallengeRequest {
  challengedId: string;
  raceType: string;
  agreedLocation: string;
  agreedDate: string;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  referenceId: string | null;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}
