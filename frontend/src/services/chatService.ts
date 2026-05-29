import { api } from "../api/api";
import type { ApiResponse } from "../types/auth.types";
import type { Conversation, Message } from "../types/dashboard.types";

export const chatService = {
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    const response = await api.get<ApiResponse<Conversation[]>>(
      "/chat/conversations"
    );
    return response.data;
  },

  async getMessages(conversationId: string): Promise<ApiResponse<Message[]>> {
    const response = await api.get<ApiResponse<Message[]>>(
      `/chat/messages/${conversationId}`
    );
    return response.data;
  },
};
