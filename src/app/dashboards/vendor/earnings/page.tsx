"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/contexts/auth-context";
import { getVendorDashboard, getVendorEarnings } from "@/lib/api";
import { useEffect, useState } from "react";

export default function VendorEarningsPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [earningsTrend, setEarningsTrend] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getVendorDashboard(user.vendor_id ?? 0),
      getVendorEarnings(user.vendor_id ?? 0, 30),
    ])
      .then(([summaryRes, earningsRes]) => {
        setSummary(summaryRes);
        setEarningsTrend((earningsRes.earnings_trend ?? []) as Record<string, unknown>[]);
      })
      .catch(() => {
        setSummary(null);
        setEarningsTrend([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const today = (summary?.today ?? {}) as Record<string, unknown>;
  const thisWeek = (summary?.this_week ?? {}) as Record<string, unknown>;
  const fmt = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");

  const revenueThisWeek = Number(thisWeek.revenue ?? 0);
  const revenueToday = Number(today.revenue ?? 0);
  const growth = revenueToday > 0 ? ((revenueThisWeek - revenueToday) / revenueToday) * 100 : 0;

  return (
    <DashboardGuard requiredRole="vendor">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">💰 Earnings</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Your revenue overview and weekly trends</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Today" value={`₹${fmt(today.revenue)}`} trend="up" icon="💰" iconBg="bg-green-100" />
              <StatCard label="This Week" value={`₹${fmt(thisWeek.revenue)}`} trend="up" icon="📆" iconBg="bg-blue-100" />
              <StatCard label="Week Orders" value={fmt(thisWeek.orders)} trend="up" icon="📅" iconBg="bg-indigo-100" />
              <StatCard
                label="Week vs Today"
                value={`${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`}
                trend={growth >= 0 ? "up" : "down"}
                icon="🔼"
                iconBg="bg-purple-100"
              />
            </div>

            {earningsTrend.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Weekly Performance</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stroke dark:border-dark-3">
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Period</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Orders</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {earningsTrend.map((s, i) => (
                        <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3 text-sm text-dark dark:text-white">{String(s.stats_date ?? "—")}</td>
                          <td className="py-3 text-right text-sm text-dark-4">{fmt(s.total_orders)}</td>
                          <td className="py-3 text-right text-sm font-medium text-dark dark:text-white">₹{fmt(s.total_revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {earningsTrend.length === 0 && (
              <div className="rounded-[10px] bg-white p-12 text-center shadow-1 dark:bg-gray-dark">
                <p className="text-dark-4">No weekly stats available yet. Stats update daily.</p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
