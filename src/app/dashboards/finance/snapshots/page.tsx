"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { getFinanceSnapshots } from "@/lib/api";
import { useEffect, useState } from "react";

export default function FinanceSnapshotsPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFinanceSnapshots()
      .then((res) => setRows((res.data ?? []) as Record<string, unknown>[]))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  const trend30d = [...rows].reverse().slice(0, 30).reverse();
  const fmt = (n: unknown) => (n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—");

  const maxRev = trend30d.reduce((m, d) => Math.max(m, Number(d.total_revenue ?? 0)), 1);

  return (
    <DashboardGuard requiredRole="finance">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">📸 Financial Snapshots</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">30-day revenue trend snapshot</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : trend30d.length === 0 ? (
          <div className="rounded-[10px] bg-white p-12 text-center shadow-1 dark:bg-gray-dark">
            <p className="text-dark-4">No trend data available</p>
          </div>
        ) : (
          <>
            {/* Mini bar chart */}
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Revenue — Last 30 Days</h2>
              <div className="flex h-32 items-end gap-1">
                {trend30d.map((d, i) => {
                  const h = Math.max(4, Math.round((Number(d.total_revenue ?? 0) / maxRev) * 100));
                  return (
                    <div key={i} title={`${String(d.snapshot_date ?? "")}: ${fmt(d.total_revenue)}`} className="flex-1 cursor-default rounded-sm bg-primary/70 hover:bg-primary transition-colors" style={{ height: `${h}%` }} />
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between text-xs text-dark-4">
                <span>{String(trend30d[0]?.snapshot_date ?? "")}</span>
                <span>{String(trend30d[trend30d.length - 1]?.snapshot_date ?? "")}</span>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Daily Breakdown</h2>
              <div className="max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-white dark:bg-gray-dark">
                    <tr className="border-b border-stroke dark:border-dark-3">
                      <th className="pb-3 text-left text-sm font-medium text-dark-4">Date</th>
                      <th className="pb-3 text-right text-sm font-medium text-dark-4">Revenue</th>
                      <th className="pb-3 text-right text-sm font-medium text-dark-4">Daily Burn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...trend30d].reverse().map((d, i) => (
                      <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                        <td className="py-2 text-sm text-dark dark:text-white">{String(d.snapshot_date ?? "—")}</td>
                        <td className="py-2 text-right text-sm text-dark-4">{fmt(d.total_revenue)}</td>
                        <td className="py-2 text-right text-sm text-dark-4">{fmt(d.daily_burn_rate)}</td>
                      </tr>
                    ))}
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
