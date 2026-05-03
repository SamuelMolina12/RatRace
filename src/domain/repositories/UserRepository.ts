export interface CreateUserData {
  username: string;
  email: string;
  passwordHash: string;
  rank?: string;
  wins?: number;
  losses?: number;
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


export interface UserRepository {
  findByEmail(email: string): Promise<any | null>;
  findByUsername(username: string): Promise<any | null>;
  create(data: CreateUserData): Promise<any>;
  findById(id: string): Promise<any | null>;
   updateProfile(id: string, data: UpdateUserProfileData): Promise<any>;
}