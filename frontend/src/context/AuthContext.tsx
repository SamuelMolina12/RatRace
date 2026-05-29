import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import type {
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from "../types/auth.types";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "ratrace_token";
const USER_KEY = "ratrace_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY)
  );

  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  const fetchFullProfile = async (): Promise<AuthUser | null> => {
    try {
      const response = await userService.getMyProfile();
      if (response.success && response.data) {
        return response.data as AuthUser;
      }
    } catch {
      // ignore
    }
    return null;
  };

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      const profile = await fetchFullProfile();

      if (profile) {
        setUser(profile);
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      }

      setIsLoading(false);
    };

    verifyToken();
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    const response = await authService.login(data);

    if (!response.success) {
      throw new Error(response.error || "Error al iniciar sesión");
    }

    const { token: newToken } = response.data!;

    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);

    const profile = await fetchFullProfile();
    if (profile) {
      setUser(profile);
      localStorage.setItem(USER_KEY, JSON.stringify(profile));
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authService.register(data);

    if (!response.success) {
      throw new Error(response.error || "Error al registrarse");
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const profile = await fetchFullProfile();
    if (profile) {
      setUser(profile);
      localStorage.setItem(USER_KEY, JSON.stringify(profile));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, isLoading, login, register, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
}
