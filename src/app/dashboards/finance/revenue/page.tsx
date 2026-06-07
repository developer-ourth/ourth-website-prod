"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { getFinanceDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

export default function FinanceRevenuePage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFinanceDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const revenue = (data?.revenue ?? {}) as Record<string, unknown>;
  const revenueByCity = (data?.revenue_by_city ?? []) as Record<string, unknown>[];
  const fmt = (n: unknown) => (n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—");

  const maxCity = revenueByCity.reduce((m, c) => Math.max(m, Number(c.revenue ?? 0)), 1);

  return (
    <DashboardGuard requiredRole="finance">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">💰 Revenue Streams</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Revenue breakdown by channel and city</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Product Revenue" value={fmt(revenue.product_revenue)} trend="up" icon="📈" iconBg="bg-green-100" />
              <StatCard label="Subscription Revenue" value={fmt(revenue.subscription_revenue)} trend="up" icon="📅" iconBg="bg-blue-100" />
              <StatCard label="This Month" value={fmt(revenue.this_month)} trend="up" icon="🗓️" iconBg="bg-indigo-100" />
              <StatCard label="Service Revenue" value={fmt(revenue.service_revenue)} icon="📦" iconBg="bg-purple-100" />
            </div>

            {/* Revenue by city */}
            {revenueByCity.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Revenue by City</h2>
                <div className="space-y-3">
                  {revenueByCity.map((c, i) => {
                    const rev = Number(c.revenue ?? 0);
                    const pct = Math.round((rev / maxCity) * 100);
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-24 text-sm text-dark dark:text-white truncate">{String(c.city ?? "—")}</span>
                        <div className="flex-1 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                          <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-28 text-right text-sm font-medium text-dark dark:text-white">{fmt(c.revenue)}</span>
                        <span className="w-12 text-right text-xs text-dark-4">{String(c.orders ?? 0)} orders</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
