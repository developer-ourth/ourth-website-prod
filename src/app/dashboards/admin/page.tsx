"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/contexts/auth-context";
import { getAdminDashboard } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const usersData = (data?.users ?? {}) as Record<string, unknown>;
  const vendorsData = (data?.vendors ?? {}) as Record<string, unknown>;
  const alertsData = (data?.alerts ?? {}) as Record<string, unknown>;
  const recentUsers = (usersData.recent ?? []) as Record<string, unknown>[];
  const criticalAlerts = (alertsData.critical ?? []) as Record<string, unknown>[];
  const criticalCount = criticalAlerts.length;
  const fmt = (n: unknown) => n != null ? Number(n).toLocaleString("en-IN") : "—";

  return (
    <DashboardGuard requiredRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">🔧 Admin Dashboard</h1>
            <p className="text-sm text-dark-4 dark:text-dark-6">
              {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
            </p>
          </div>
          <button onClick={handleLogout} className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-gray-dark">
            Sign Out
          </button>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 2xl:gap-7.5">
              <StatCard label="Total Users" value={fmt(usersData.total)} trend="up" icon="👥" iconBg="bg-blue-100" />
              <StatCard label="Total Vendors" value={fmt(vendorsData.total)} trend="up" icon="🛒" iconBg="bg-orange-100" />
              <StatCard label="KYC Pending" value={fmt((vendorsData.by_kyc_status as Record<string, unknown>)?.under_review)} icon="📋" iconBg="bg-yellow-100" />
              <StatCard label="Critical Alerts" value={fmt(criticalCount)} icon="🔔" iconBg="bg-red-100" />
            </div>

            {criticalAlerts.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Critical Alerts</h2>
                <div className="space-y-3">
                  {criticalAlerts.map((alert, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg border-l-4 border-red bg-red/10 px-4 py-3">
                      <span className="text-lg">🔴</span>
                      <div>
                        <p className="text-sm font-semibold text-dark dark:text-white">{String(alert.title ?? "")}</p>
                        <p className="text-xs text-dark-4">{String(alert.alert_type ?? "")} — {String(alert.city ?? "")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recentUsers.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Recent Users</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stroke dark:border-dark-3">
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Name</th>
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Email</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((u, i) => (
                        <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3 text-sm font-medium text-dark dark:text-white">{String(u.name ?? "")}</td>
                          <td className="py-3 text-sm text-dark-4">{String(u.email ?? "")}</td>
                          <td className="py-3 text-right text-sm text-dark-4">{String(u.role ?? "—")}</td>
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
