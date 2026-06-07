"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { useOperationsLiveRefresh } from "@/hooks/use-operations-live-refresh";
import { getOperationsRoutes } from "@/lib/api";
import { useEffect, useState } from "react";

const ROUTE_STATUS_STYLES: Record<string, string> = {
  planned: "bg-blue-100 text-blue-700",
  in_progress: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-700",
};

export default function OperationsRoutesPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRoutes = async () => {
    try {
      const response = await getOperationsRoutes();
      setData(response);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRoutes();
  }, []);

  useOperationsLiveRefresh(loadRoutes);

  const routes = (data?.routes ?? []) as Record<string, unknown>[];

  return (
    <DashboardGuard requiredRole="operations">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">🗺️ Delivery Routes</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Active and planned routes for today</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : routes.length === 0 ? (
          <div className="rounded-[10px] bg-white p-12 text-center shadow-1 dark:bg-gray-dark">
            <p className="text-4xl">🚚</p>
            <p className="mt-3 text-dark-4">No active routes today</p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark">
                <p className="text-sm text-dark-4">Total Routes</p>
                <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{routes.length}</p>
              </div>
              <div className="rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark">
                <p className="text-sm text-dark-4">In Progress</p>
                <p className="mt-1 text-2xl font-bold text-green-600">{routes.filter((r) => r.status === "in_progress").length}</p>
              </div>
              <div className="rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark">
                <p className="text-sm text-dark-4">Planned</p>
                <p className="mt-1 text-2xl font-bold text-blue-600">{routes.filter((r) => r.status === "planned").length}</p>
              </div>
            </div>

            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stroke dark:border-dark-3">
                      <th className="pb-3 text-left text-sm font-medium text-dark-4">Route #</th>
                      <th className="pb-3 text-center text-sm font-medium text-dark-4">Status</th>
                      <th className="pb-3 text-right text-sm font-medium text-dark-4">Stops</th>
                      <th className="pb-3 text-right text-sm font-medium text-dark-4">Completed</th>
                      <th className="pb-3 text-right text-sm font-medium text-dark-4">Distance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((r, i) => {
                      const total = Number(r.total_stops ?? 0);
                      const done = Number(r.completed_stops ?? 0);
                      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                      return (
                        <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3 text-sm font-medium text-dark dark:text-white">{String(r.route_number ?? "—")}</td>
                          <td className="py-3 text-center">
                            <span className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${ROUTE_STATUS_STYLES[String(r.status ?? "")] ?? "bg-gray-100 text-gray-600"}`}>
                              {String(r.status ?? "—").replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-3 text-right text-sm text-dark-4">{total}</td>
                          <td className="py-3 text-right text-sm text-dark-4">
                            {done} / {total}
                            <div className="ml-auto mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                              <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                            </div>
                          </td>
                          <td className="py-3 text-right text-sm text-dark-4">{String(r.total_distance_km ?? "—")} km</td>
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
