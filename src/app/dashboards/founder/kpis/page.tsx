"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { getFounderDashboard, getFounderKpis } from "@/lib/api";
import { useEffect, useState } from "react";

export default function FounderKPIsPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [kpis, setKpis] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getFounderDashboard(), getFounderKpis(30)])
      .then(([summary, trend]) => {
        setData(summary);
        setKpis(trend);
      })
      .catch(() => {
        setData(null);
        setKpis(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const revenue = (data?.revenue ?? {}) as Record<string, unknown>;
  const orders = (data?.orders ?? {}) as Record<string, unknown>;
  const vendors = (data?.vendors ?? {}) as Record<string, unknown>;
  const trend = (kpis?.revenue_trend ?? []) as Record<string, unknown>[];
  const fmt = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");
  const pct = (n: unknown) => (n != null ? `${Number(n) >= 0 ? "+" : ""}${Number(n).toFixed(1)}%` : "—");

  return (
    <DashboardGuard requiredRole="founder">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">📈 KPIs & Trends</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">
            Revenue, order, and vendor key performance indicators
          </p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Revenue KPIs */}
            <div>
              <h2 className="mb-3 text-base font-semibold text-dark dark:text-white">Revenue</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Today" value={`₹${fmt(revenue.today)}`} trend="up" icon="💰" iconBg="bg-yellow-100" />
                <StatCard label="This Month" value={`₹${fmt(revenue.this_month)}`} trend="up" icon="📈" iconBg="bg-green-100" />
                <StatCard label="Yesterday" value={`₹${fmt(revenue.yesterday)}`} icon="📅" iconBg="bg-blue-100" />
                <StatCard label="DoD Growth" value={pct(revenue.day_over_day_change_percent)} trend={Number(revenue.day_over_day_change_percent ?? 0) >= 0 ? "up" : "down"} icon="🔼" iconBg="bg-purple-100" />
              </div>
            </div>

            {/* Orders KPIs */}
            <div>
              <h2 className="mb-3 text-base font-semibold text-dark dark:text-white">Orders</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Today" value={fmt(orders.today)} trend="up" icon="📦" iconBg="bg-teal-100" />
                <StatCard label="This Month" value={fmt(orders.this_month)} trend="up" icon="📅" iconBg="bg-blue-100" />
                <StatCard label="Pending" value={fmt((orders.by_status as Record<string, unknown>)?.pending)} icon="⏳" iconBg="bg-yellow-100" />
                <StatCard label="Delivered" value={fmt((orders.by_status as Record<string, unknown>)?.delivered)} trend="up" icon="✅" iconBg="bg-green-100" />
              </div>
            </div>

            {/* Vendor KPIs */}
            <div>
              <h2 className="mb-3 text-base font-semibold text-dark dark:text-white">Vendors</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Total" value={fmt(vendors.total)} icon="🏪" iconBg="bg-orange-100" />
                <StatCard label="Active" value={fmt(vendors.active)} trend="up" icon="🟢" iconBg="bg-green-100" />
                <StatCard label="Pending KYC" value={fmt(vendors.pending_kyc)} icon="📋" iconBg="bg-yellow-100" />
                <StatCard label="KYC Pending" value={fmt(vendors.pending_kyc)} trend="up" icon="🆕" iconBg="bg-indigo-100" />
              </div>
            </div>

            {trend.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Revenue Trend (30 days)</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stroke dark:border-dark-3">
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Date</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Orders</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trend.map((row, i) => (
                        <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3 text-sm font-medium text-dark dark:text-white">{String(row.date ?? "—")}</td>
                          <td className="py-3 text-right text-sm text-dark-4">{fmt(row.orders)}</td>
                          <td className="py-3 text-right text-sm font-medium text-dark dark:text-white">₹{fmt(row.revenue)}</td>
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
