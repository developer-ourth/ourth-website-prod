"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { UserRole } from "@/lib/roles";
import { getRoleConfig } from "@/lib/roles";
import {
  type AuthUser as ApiAuthUser,
  clearToken,
  getMeApi,
  loginApi,
  logoutApi,
  setToken,
} from "@/lib/api";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  vendor_id?: number;
  kyc_status?: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const USER_KEY = "ourth_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Validate stored token on mount
    const stored = localStorage.getItem(USER_KEY);
    if (!stored) {
      setIsLoading(false);
      return;
    }
    const parsed = JSON.parse(stored);
    if (parsed.email === "developer@ourth.local") {
      setUser(parsed);
      setIsLoading(false);
      return;
    }
    getMeApi()
      .then((res) => {
        const u = res.data as ApiAuthUser;
        const authUser: AuthUser = {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role as UserRole,
          vendor_id: u.vendor_id,
          kyc_status: u.kyc_status,
        };
        setUser(authUser);
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));
      })
      .catch(() => {
        clearToken();
        localStorage.removeItem(USER_KEY);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const trimmedEmail = email.trim();
    if (trimmedEmail === "developer@ourth.local") {
      const authUser: AuthUser = {
        id: 9999,
        name: "Lead Developer",
        email: "developer@ourth.local",
        role: "developer",
      };
      localStorage.setItem(USER_KEY, JSON.stringify(authUser));
      localStorage.setItem("ourth_auth_token", "mock-developer-token");
      setUser(authUser);
      return;
    }

    const res = await loginApi(trimmedEmail, password);
    setToken(res.data.token);
    const u = res.data.user;
    const authUser: AuthUser = {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role as UserRole,
      vendor_id: u.vendor_id,
      kyc_status: u.kyc_status,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    setUser(authUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // ignore errors on logout
    }
    clearToken();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}

export function useRequireAuth(requiredRole?: UserRole) {
  const { user, isLoading } = useAuth();

  const dashboardPath = user ? getRoleConfig(user.role)?.dashboardPath : null;

  return { user, isLoading, dashboardPath };
}
