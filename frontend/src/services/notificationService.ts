import { api } from "../api/api";
import type { ApiResponse } from "../types/auth.types";
import type { Notification } from "../types/dashboard.types";

export const notificationService = {
  async getMyNotifications(
    unreadOnly?: boolean
  ): Promise<ApiResponse<Notification[]>> {
    const response = await api.get<ApiResponse<Notification[]>>(
      "/notifications/my",
      {
        params: unreadOnly !== undefined ? { unreadOnly } : undefined,
      }
    );
    return response.data;
  },

  async markAsRead(id: string): Promise<ApiResponse<Notification>> {
    const response = await api.patch<ApiResponse<Notification>>(
      `/notifications/${id}/read`
    );
    return response.data;
  },
};
