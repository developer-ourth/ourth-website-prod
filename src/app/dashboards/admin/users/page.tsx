"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { getAdminDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const users = (data?.users ?? {}) as Record<string, unknown>;
  const byType = (users.by_type ?? {}) as Record<string, number>;
  const recent = (users.recent ?? []) as Record<string, unknown>[];
  const fmt = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");

  return (
    <DashboardGuard requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">👥 User Management</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">All platform users by role</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Total Users" value={fmt(users.total)} icon="👥" iconBg="bg-indigo-100" />
              {Object.entries(byType).slice(0, 3).map(([type, count]) => (
                <StatCard key={type} label={type.charAt(0).toUpperCase() + type.slice(1) + "s"} value={String(count)} icon="👤" iconBg="bg-blue-100" />
              ))}
            </div>

            {/* Users by type */}
            {Object.keys(byType).length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">By Role</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {Object.entries(byType).map(([type, count]) => (
                    <div key={type} className="rounded-lg bg-gray-50 p-4 text-center dark:bg-dark-2">
                      <p className="text-xl font-bold text-dark dark:text-white">{count}</p>
                      <p className="mt-1 text-xs capitalize text-dark-4">{type}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent users */}
            {recent.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Recently Registered</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stroke dark:border-dark-3">
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Name</th>
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Email</th>
                        <th className="pb-3 text-center text-sm font-medium text-dark-4">Role</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map((u, i) => (
                        <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3 text-sm font-medium text-dark dark:text-white">{String(u.name ?? "—")}</td>
                          <td className="py-3 text-sm text-dark-4">{String(u.email ?? "—")}</td>
                          <td className="py-3 text-center">
                            <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-semibold capitalize text-indigo-700">{String(u.role ?? "—")}</span>
                          </td>
                          <td className="py-3 text-right text-sm text-dark-4">
                            {u.created_at ? new Date(String(u.created_at)).toLocaleDateString("en-IN") : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
