export interface CreateVehicleData {
  userId: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  plate?: string | null;
  photo?: string | null;
  modifications?: string | null;
  active?: boolean;
}

export interface UpdateVehicleData {
  vehicleType?: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  plate?: string | null;
  photo?: string | null;
  modifications?: string | null;
}

export interface VehicleRepository {
  create(data: CreateVehicleData): Promise<any>;
  findById(id: string): Promise<any | null>;
  findByUserId(userId: string): Promise<any[]>;
  countByUserId(userId: string): Promise<number>;
  update(id: string, data: UpdateVehicleData): Promise<any>;
  delete(id: string): Promise<void>;
  deactivateAllByUserId(userId: string): Promise<void>;
  setActive(id: string): Promise<any>;
}