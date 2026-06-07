"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import type { UserRole } from "@/lib/roles";
import { useParams, useRouter } from "next/navigation";

interface ComingSoonPageProps {
  role: UserRole;
}

export function ComingSoonPage({ role }: ComingSoonPageProps) {
  const router = useRouter();
  const params = useParams<{ slug: string[] }>();
  const section = (params?.slug ?? [])
    .join(" › ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <DashboardGuard requiredRole={role}>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-4 text-6xl">🚧</div>
        <h1 className="mb-2 text-2xl font-bold text-dark dark:text-white">Coming Soon</h1>
        <p className="mb-1 text-dark-4">
          <span className="font-medium">{section}</span>
        </p>
        <p className="mb-6 text-sm text-dark-4">This section is under construction.</p>
        <button
          onClick={() => router.push(`/dashboards/${role}`)}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          Back to Overview
        </button>
      </div>
    </DashboardGuard>
  );
}
