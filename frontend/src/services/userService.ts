import { api } from "../api/api";
import type { ApiResponse } from "../types/auth.types";
import type { UserProfile, DiscoverPilotsResponse } from "../types/dashboard.types";

export const userService = {
  async getMyProfile(): Promise<ApiResponse<UserProfile>> {
    const response = await api.get<ApiResponse<UserProfile>>("/users/me");
    return response.data;
  },

  async updateMyProfile(data: {
    username?: string;
    profilePhoto?: string;
    locality?: string;
    city?: string;
    state?: string;
    country?: string;
  }): Promise<ApiResponse<UserProfile>> {
    const response = await api.put<ApiResponse<UserProfile>>("/users/me", data);
    return response.data;
  },

  async getUserProfile(id: string): Promise<ApiResponse<UserProfile>> {
    const response = await api.get<ApiResponse<UserProfile>>(`/users/${id}`);
    return response.data;
  },

  async discoverPilots(params?: {
    page?: number;
    limit?: number;
    locality?: string;
    city?: string;
    state?: string;
    country?: string;
  }): Promise<ApiResponse<DiscoverPilotsResponse>> {
    const response = await api.get<ApiResponse<DiscoverPilotsResponse>>(
      "/users/discover",
      { params }
    );
    return response.data;
  },
};
