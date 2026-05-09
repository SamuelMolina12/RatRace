export interface VehicleDto {
  id: string;
  userId: string;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  plate?: string | null;
  photo?: string | null;
  modifications?: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}