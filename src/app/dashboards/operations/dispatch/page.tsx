"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useOperationsLiveRefresh } from "@/hooks/use-operations-live-refresh";
import { getOperationsDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

export default function OperationsDispatchPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    try {
      const response = await getOperationsDashboard();
      setData(response);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  useOperationsLiveRefresh(loadDashboard);

  const orders = (data?.orders ?? {}) as Record<string, unknown>;
  const deliveries = (data?.deliveries ?? {}) as Record<string, unknown>;
  const byStatus = (deliveries.by_status ?? {}) as Record<string, unknown>;
  const fmt = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");

  return (
    <DashboardGuard requiredRole="operations">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">🏷️ Dispatch Slips</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Orders awaiting dispatch and current delivery status</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="To Dispatch" value={fmt(orders.to_dispatch)} icon="📤" iconBg="bg-yellow-100" trend={Number(orders.to_dispatch ?? 0) > 0 ? "down" : "up"} />
              <StatCard label="In Transit" value={fmt(orders.in_transit)} trend="up" icon="🚚" iconBg="bg-blue-100" />
              <StatCard label="Delivered Today" value={fmt(deliveries.today_delivered)} trend="up" icon="✅" iconBg="bg-green-100" />
              <StatCard label="Total Today" value={fmt(deliveries.today_total)} icon="📦" iconBg="bg-indigo-100" />
            </div>

            {/* Status breakdown */}
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Delivery Status Breakdown</h2>
              {Object.keys(byStatus).length === 0 ? (
                <p className="text-dark-4">No delivery data available</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(byStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center gap-3">
                      <span className="w-28 text-sm capitalize text-dark dark:text-white">{status.replace("_", " ")}</span>
                      <div className="flex-1 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                        <div
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${Math.min(100, (Number(count) / Math.max(...Object.values(byStatus).map(Number))) * 100)}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-sm font-medium text-dark dark:text-white">{String(count)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dispatch queue note */}
            {Number(orders.to_dispatch ?? 0) > 0 && (
              <div className="rounded-[10px] border border-yellow-200 bg-yellow-50 p-5 dark:border-yellow-800 dark:bg-yellow-900/10">
                <p className="font-semibold text-yellow-700 dark:text-yellow-400">⚠️ {fmt(orders.to_dispatch)} orders pending dispatch</p>
                <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-500">
                  These orders are confirmed but not yet assigned to a delivery partner.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
