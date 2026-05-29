import { api } from "../api/api";
import type { ApiResponse } from "../types/auth.types";
import type { Vehicle } from "../types/dashboard.types";

export interface CreateVehicleRequest {
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  plate?: string;
  photo?: string;
  modifications?: string;
  active?: boolean;
}

export interface UpdateVehicleRequest {
  vehicleType?: string;
  brand?: string;
  model?: string;
  year?: number;
  color?: string;
  plate?: string;
  photo?: string;
  modifications?: string;
}

export const vehicleService = {
  async getMyVehicles(): Promise<ApiResponse<Vehicle[]>> {
    const response = await api.get<ApiResponse<Vehicle[]>>("/vehicles");
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<Vehicle>> {
    const response = await api.get<ApiResponse<Vehicle>>(`/vehicles/${id}`);
    return response.data;
  },

  async create(data: CreateVehicleRequest): Promise<ApiResponse<Vehicle>> {
    const response = await api.post<ApiResponse<Vehicle>>("/vehicles", data);
    return response.data;
  },

  async update(id: string, data: UpdateVehicleRequest): Promise<ApiResponse<Vehicle>> {
    const response = await api.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, data);
    return response.data;
  },

  async remove(id: string): Promise<ApiResponse<null>> {
    const response = await api.delete<ApiResponse<null>>(`/vehicles/${id}`);
    return response.data;
  },

  async setActive(id: string): Promise<ApiResponse<Vehicle>> {
    const response = await api.patch<ApiResponse<Vehicle>>(`/vehicles/${id}/active`);
    return response.data;
  },
};
