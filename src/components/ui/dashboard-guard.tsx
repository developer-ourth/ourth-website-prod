"use client";

import { useAuth } from "@/contexts/auth-context";
import type { UserRole } from "@/lib/roles";
import { getRoleConfig } from "@/lib/roles";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface DashboardGuardProps {
  requiredRole: UserRole;
  children: React.ReactNode;
}

export function DashboardGuard({ requiredRole, children }: DashboardGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (!isLoading && user && user.role !== requiredRole) {
      const config = getRoleConfig(user.role);
      router.push(config?.dashboardPath ?? "/login");
    }
  }, [user, isLoading, requiredRole, router]);

  if (isLoading || !user || user.role !== requiredRole) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
