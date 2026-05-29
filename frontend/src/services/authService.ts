import { api } from "../api/api";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  AuthUser,
  ApiResponse,
} from "../types/auth.types";


export const authService = {

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      data
    );
    return response.data;
  },

  async register(
    data: RegisterRequest
  ): Promise<ApiResponse<{ id: string; username: string; email: string }>> {
    const response = await api.post<
      ApiResponse<{ id: string; username: string; email: string }>
    >("/auth/register", data);
    return response.data;
  },

  async getMe(): Promise<ApiResponse<AuthUser>> {
    const response = await api.get<ApiResponse<AuthUser>>("/auth/me");
    return response.data;
  },
};
