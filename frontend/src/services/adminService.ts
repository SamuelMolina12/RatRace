import { api } from "../api/api";
import type { ApiResponse } from "../types/auth.types";
import type {
  AdminChallenge,
  AdminChallengesQuery,
  AdminChallengesResponse,
  AdminDashboard,
  AdminUser,
  AdminUsersQuery,
  AdminUsersResponse,
  ResolveAdminChallengeRequest,
} from "../types/admin.types";

export const adminService = {
  async getDashboard(): Promise<ApiResponse<AdminDashboard>> {
    const response =
      await api.get<ApiResponse<AdminDashboard>>("/admin/dashboard");
    return response.data;
  },

  async getUsers(
    params: AdminUsersQuery,
  ): Promise<ApiResponse<AdminUsersResponse>> {
    const response = await api.get<ApiResponse<AdminUsersResponse>>(
      "/admin/users",
      {
        params,
      },
    );
    return response.data;
  },

  async getUserById(id: string): Promise<ApiResponse<AdminUser>> {
    const response = await api.get<ApiResponse<AdminUser>>(
      `/admin/users/${id}`,
    );
    return response.data;
  },

  async suspendUser(id: string): Promise<ApiResponse<AdminUser>> {
    const response = await api.patch<ApiResponse<AdminUser>>(
      `/admin/users/${id}/suspend`,
    );
    return response.data;
  },

  async activateUser(id: string): Promise<ApiResponse<AdminUser>> {
    const response = await api.patch<ApiResponse<AdminUser>>(
      `/admin/users/${id}/activate`,
    );
    return response.data;
  },

  async getChallenges(
    params: AdminChallengesQuery,
  ): Promise<ApiResponse<AdminChallengesResponse>> {
    const response = await api.get<ApiResponse<AdminChallengesResponse>>(
      "/admin/challenges",
      {
        params,
      },
    );
    return response.data;
  },

  async resolveChallenge(
    id: string,
    data: ResolveAdminChallengeRequest,
  ): Promise<ApiResponse<{ challenge: AdminChallenge; ranking?: unknown }>> {
    const response = await api.patch<
      ApiResponse<{ challenge: AdminChallenge; ranking?: unknown }>
    >(`/admin/challenges/${id}/resolve`, data);
    return response.data;
  },
};
