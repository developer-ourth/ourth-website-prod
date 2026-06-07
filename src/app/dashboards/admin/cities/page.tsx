"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { getAdminDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminCitiesPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const cities = (data?.cities ?? {}) as Record<string, unknown>;
  const byStatus = (cities.by_status ?? {}) as Record<string, number>;
  const fmt = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");

  return (
    <DashboardGuard requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">🏙️ City Management</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Platform presence and city activation status</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Active Cities" value={fmt(cities.active)} trend="up" icon="🏙️" iconBg="bg-green-100" />
              {Object.entries(byStatus).map(([status, count]) => (
                <StatCard key={status} label={status.charAt(0).toUpperCase() + status.slice(1)} value={String(count)} icon={status === "active" ? "✅" : status === "inactive" ? "🚫" : "🕐"} iconBg={status === "active" ? "bg-green-100" : "bg-gray-100"} />
              ))}
            </div>

            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Status Breakdown</h2>
              {Object.keys(byStatus).length === 0 ? (
                <p className="text-dark-4">No city data available</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(byStatus).map(([status, count]) => {
                    const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
                    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                      <div key={status} className="flex items-center gap-3">
                        <span className="w-24 text-sm capitalize text-dark dark:text-white">{status}</span>
                        <div className="flex-1 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                          <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-20 text-right text-sm font-medium text-dark dark:text-white">{count} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
