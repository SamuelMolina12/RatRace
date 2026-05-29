import { api } from "../api/api";
import type { ApiResponse } from "../types/auth.types";
import type { Challenge, CreateChallengeRequest } from "../types/dashboard.types";

export const challengeService = {
  async getMyChallenges(status?: string): Promise<ApiResponse<Challenge[]>> {
    const response = await api.get<ApiResponse<Challenge[]>>("/challenges/my", {
      params: status ? { status } : undefined,
    });
    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<Challenge>> {
    const response = await api.get<ApiResponse<Challenge>>(`/challenges/${id}`);
    return response.data;
  },

  async create(data: CreateChallengeRequest): Promise<ApiResponse<Challenge>> {
    const response = await api.post<ApiResponse<Challenge>>("/challenges", data);
    return response.data;
  },

  async accept(id: string): Promise<ApiResponse<Challenge>> {
    const response = await api.patch<ApiResponse<Challenge>>(
      `/challenges/${id}/accept`
    );
    return response.data;
  },

  async reject(id: string): Promise<ApiResponse<Challenge>> {
    const response = await api.patch<ApiResponse<Challenge>>(
      `/challenges/${id}/reject`
    );
    return response.data;
  },

  async cancel(id: string): Promise<ApiResponse<Challenge>> {
    const response = await api.patch<ApiResponse<Challenge>>(
      `/challenges/${id}/cancel`
    );
    return response.data;
  },

  async start(id: string): Promise<ApiResponse<Challenge>> {
    const response = await api.patch<ApiResponse<Challenge>>(
      `/challenges/${id}/start`
    );
    return response.data;
  },

  async complete(
    id: string,
    winnerId: string
  ): Promise<ApiResponse<Challenge>> {
    const response = await api.patch<ApiResponse<Challenge>>(
      `/challenges/${id}/complete`,
      { winnerId }
    );
    return response.data;
  },
};
