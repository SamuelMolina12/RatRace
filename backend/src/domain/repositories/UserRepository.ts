export interface CreateUserData {
  username: string;
  email: string;
  passwordHash: string;
  role?: string;
  estado?: string;
  rank?: string;
  wins?: number;
  losses?: number;
  consecutiveWins?: number;
  profilePhoto?: string;
  locality?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface UpdateUserProfileData {
  username?: string;
  profilePhoto?: string | null;
  locality?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
}

export interface FindDiscoverablePilotsParams {
  userId: string;
  rank: string;
  vehicleType: string;
  page: number;
  limit: number;
  locality?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface AdminUserFilters {
  search?: string;
  estado?: string;
  role?: string;
}

export interface UserRepository {
  findByEmail(email: string): Promise<any | null>;
  findByUsername(username: string): Promise<any | null>;
  create(data: CreateUserData): Promise<any>;
  findById(id: string): Promise<any | null>;
  updateProfile(id: string, data: UpdateUserProfileData): Promise<any>;
  findAll(
    page: number,
    pageSize: number,
    filters?: AdminUserFilters,
  ): Promise<any[]>;
  countAll(filters?: AdminUserFilters): Promise<number>;
  countByEstado(estado: string): Promise<number>;
  updateRole(id: string, role: string): Promise<any>;
  updateEstado(id: string, estado: string): Promise<any>;

  findActiveVehicleByUserId(userId: string): Promise<any | null>;

  findDiscoverablePilots(params: FindDiscoverablePilotsParams): Promise<any>;
}
