"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { getFounderDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

export default function FounderCitiesPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFounderDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const cities = (data?.city_performance ?? []) as Record<string, unknown>[];
  const fmt = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");

  // Compute max revenue for bar width
  const maxRevenue = cities.reduce((m, c) => Math.max(m, Number(c.revenue ?? 0)), 1);

  return (
    <DashboardGuard requiredRole="founder">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">🏙️ City Performance</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">
            Revenue and order breakdown by city this month
          </p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : cities.length === 0 ? (
          <div className="rounded-[10px] bg-white p-12 text-center shadow-1 dark:bg-gray-dark">
            <p className="text-dark-4">No city performance data available</p>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark">
                <p className="text-sm text-dark-4">Active Cities</p>
                <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{cities.length}</p>
              </div>
              <div className="rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark">
                <p className="text-sm text-dark-4">Top City</p>
                <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{String(cities[0]?.city ?? "—")}</p>
              </div>
              <div className="rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark">
                <p className="text-sm text-dark-4">Total City Revenue</p>
                <p className="mt-1 text-2xl font-bold text-dark dark:text-white">
                  ₹{fmt(cities.reduce((s, c) => s + Number(c.revenue ?? 0), 0))}
                </p>
              </div>
            </div>

            {/* City table with mini bar */}
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">City Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stroke dark:border-dark-3">
                      <th className="pb-3 text-left text-sm font-medium text-dark-4">City</th>
                      <th className="pb-3 text-right text-sm font-medium text-dark-4">Orders</th>
                      <th className="pb-3 text-right text-sm font-medium text-dark-4">Order Share</th>
                      <th className="pb-3 text-right text-sm font-medium text-dark-4">Revenue</th>
                      <th className="pb-3 pl-4 text-left text-sm font-medium text-dark-4">Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cities.map((row, i) => {
                      const barWidth = Math.round((Number(row.revenue ?? 0) / maxRevenue) * 100);
                      const totalOrders = cities.reduce((sum, city) => sum + Number(city.orders ?? 0), 0);
                      const orderShare = totalOrders > 0 ? `${((Number(row.orders ?? 0) / totalOrders) * 100).toFixed(1)}%` : "—";
                      return (
                        <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3 text-sm font-medium text-dark dark:text-white">{String(row.city ?? "—")}</td>
                          <td className="py-3 text-right text-sm text-dark-4">{fmt(row.orders)}</td>
                          <td className="py-3 text-right text-sm text-dark-4">{orderShare}</td>
                          <td className="py-3 text-right text-sm font-medium text-dark dark:text-white">₹{fmt(row.revenue)}</td>
                          <td className="py-3 pl-4">
                            <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${barWidth}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
