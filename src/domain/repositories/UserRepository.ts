export interface CreateUserData {
  username: string;
  email: string;
  passwordHash: string;

  rango?: string;
  victorias?: number;
  derrotas?: number;

  fotoPerfil?: string;
  zonaLocalidad?: string;
  zonaCiudad?: string;
  zonaEstado?: string;
  zonaPais?: string;
}

export interface UserRepository {
  findByEmail(email: string): Promise<any | null>;
  findByUsername(username: string): Promise<any | null>;
  create(data: CreateUserData): Promise<any>;
  findById(id: string): Promise<any | null>;
}