"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { getWasteManagementDashboard, getWasteDustbins } from "@/lib/api";
import { useEffect, useState } from "react";

const FILL_COLOR = (pct: number) =>
  pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-yellow-400" : "bg-green-500";

export default function WasteDustbinsPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [bins, setBins] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getWasteManagementDashboard(), getWasteDustbins(1)])
      .then(([summaryRes, binsRes]) => {
        setData(summaryRes);
        setBins((binsRes.data ?? []) as Record<string, unknown>[]);;
      })
      .catch(() => {
        setData(null);
        setBins([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const dustbins = (data?.dustbins ?? {}) as Record<string, unknown>;
  const byType = (dustbins.by_type ?? {}) as Record<string, number>;
  const fmt = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");

  return (
    <DashboardGuard requiredRole="waste_management">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">🗑️ Dustbin Status</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Real-time fill levels and bin health monitoring</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Total Bins" value={fmt(dustbins.total)} icon="🗑️" iconBg="bg-gray-100" />
              <StatCard label="Full Bins" value={fmt(dustbins.full)} trend={Number(dustbins.full ?? 0) > 0 ? "down" : "up"} icon="🚨" iconBg="bg-red-100" />
              <StatCard label="Avg Fill Level" value={dustbins.avg_fill_level_percent != null ? `${Number(dustbins.avg_fill_level_percent).toFixed(1)}%` : "—"} icon="📊" iconBg="bg-blue-100" />
              <StatCard label="Bin Types" value={String(Object.keys(byType).length)} icon="🏷️" iconBg="bg-purple-100" />
            </div>

            {/* By type breakdown */}
            {Object.keys(byType).length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Bins by Type</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {Object.entries(byType).map(([type, count]) => (
                    <div key={type} className="rounded-lg bg-gray-50 p-4 text-center dark:bg-dark-2">
                      <p className="text-xl font-bold text-dark dark:text-white">{count}</p>
                      <p className="mt-1 text-xs capitalize text-dark-4">{type.replace("_", " ")}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dustbin status table */}
            {bins.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">All Bins</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stroke dark:border-dark-3">
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Bin ID</th>
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Type</th>
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Location</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Fill Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bins.map((b, i) => {
                        const fill = Number(b.fill_level_percent ?? 0);
                        return (
                          <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                            <td className="py-3 text-sm font-mono text-dark dark:text-white">{String(b.bin_label ?? b.qr_code ?? "—")}</td>
                            <td className="py-3 text-sm capitalize text-dark-4">{String(b.bin_type ?? "—").replace("_", " ")}</td>
                            <td className="py-3 text-sm text-dark-4">{String(b.area ?? b.city ?? "—")}</td>
                            <td className="py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                                  <div className={`h-full rounded-full ${FILL_COLOR(fill)}`} style={{ width: `${fill}%` }} />
                                </div>
                                <span className="text-sm font-medium text-dark dark:text-white">{fill}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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
