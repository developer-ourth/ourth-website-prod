"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/contexts/auth-context";
import { getFinanceDashboard } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function FinanceDashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFinanceDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const revenue = (data?.revenue ?? {}) as Record<string, unknown>;
  const cacLtv = (data?.cac_ltv ?? {}) as Record<string, unknown>;
  const unitEconomics = (data?.unit_economics ?? {}) as Record<string, unknown>;
  const fmt = (n: unknown) => n != null ? Number(n).toLocaleString("en-IN") : "—";

  return (
    <DashboardGuard requiredRole="finance">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">💰 Finance Dashboard</h1>
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
              <StatCard label="Revenue This Month" value={`₹${fmt(revenue.this_month)}`} trend="up" icon="💰" iconBg="bg-green-100" />
              <StatCard label="Revenue Last Month" value={`₹${fmt(revenue.last_month)}`} icon="🏦" iconBg="bg-blue-100" />
              <StatCard label="MoM Growth" value={revenue.mom_growth_percent != null ? `${revenue.mom_growth_percent}%` : "—"} icon="📈" iconBg="bg-teal-100" />
              <StatCard label="Avg Order Value" value={`₹${fmt(unitEconomics.avg_order_value)}`} icon="📋" iconBg="bg-yellow-100" />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 2xl:gap-7.5">
              <StatCard label="CAC" value={cacLtv.cac != null ? `₹${fmt(cacLtv.cac)}` : "—"} icon="🎯" iconBg="bg-orange-100" />
              <StatCard label="LTV" value={cacLtv.ltv != null ? `₹${fmt(cacLtv.ltv)}` : "—"} icon="👑" iconBg="bg-purple-100" />
              <StatCard label="Active Vendors" value={fmt(unitEconomics.active_vendors)} icon="🏠" iconBg="bg-indigo-100" />
            </div>

            {(data?.revenue_by_city as unknown[])?.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Revenue by City</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stroke dark:border-dark-3">
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">City</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Revenue</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Orders</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.revenue_by_city as Record<string, unknown>[]).map((s, i) => (
                        <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3 text-sm text-dark dark:text-white">{String(s.city ?? "")}</td>
                          <td className="py-3 text-right text-sm font-semibold text-green">₹{fmt(s.revenue)}</td>
                          <td className="py-3 text-right text-sm text-dark-4">{fmt(s.orders)}</td>
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
