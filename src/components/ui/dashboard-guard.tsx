"use client";

import { useAuth } from "@/contexts/auth-context";
import type { UserRole } from "@/lib/roles";
import { getRoleConfig } from "@/lib/roles";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface DashboardGuardProps {
  requiredRole: UserRole | UserRole[];
  children: React.ReactNode;
}

export function DashboardGuard({ requiredRole, children }: DashboardGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const isAllowed = (role: UserRole) => {
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role);
    }
    return role === requiredRole;
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (!isLoading && user && !isAllowed(user.role)) {
      const config = getRoleConfig(user.role);
      router.push(config?.dashboardPath ?? "/login");
    }
  }, [user, isLoading, requiredRole, router]);

  if (isLoading || !user || !isAllowed(user.role)) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
