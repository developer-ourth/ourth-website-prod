"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/contexts/auth-context";
import { useOperationsLiveRefresh } from "@/hooks/use-operations-live-refresh";
import { getOperationsDashboard } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OperationsDashboard() {
  const { logout } = useAuth();
  const router = useRouter();
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

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const orders = (data?.orders ?? {}) as Record<string, unknown>;
  const deliveries = (data?.deliveries ?? {}) as Record<string, unknown>;
  const stockAlerts = (data?.stock_alerts ?? []) as Record<string, unknown>[];
  const fmt = (n: unknown) => n != null ? Number(n).toLocaleString("en-IN") : "—";

  return (
    <DashboardGuard requiredRole="operations">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">⚙️ Operations Dashboard</h1>
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
              <StatCard label="To Dispatch" value={fmt(orders.to_dispatch)} icon="📦" iconBg="bg-blue-100" />
              <StatCard label="In Transit" value={fmt(orders.in_transit)} trend="up" icon="🚚" iconBg="bg-teal-100" />
              <StatCard label="SLA Breaches" value={fmt(orders.sla_breaches)} icon="⚠️" iconBg="bg-red-100" />
              <StatCard label="Deliveries Today" value={fmt(deliveries.today_total)} trend="up" icon="✅" iconBg="bg-green-100" />
            </div>

            {stockAlerts.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Stock Alerts</h2>
                <div className="space-y-3">
                  {stockAlerts.map((alert, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-yellow/10 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-dark dark:text-white">{String(alert.product_name ?? "")}</p>
                        <p className="text-xs text-dark-4">{String(alert.vendor_name ?? "")} — SKU: {String(alert.sku ?? "")}</p>
                      </div>
                      <span className="text-xs font-medium text-red">Stock: {String(alert.current_stock ?? "")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(data?.active_routes as unknown[])?.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Active Routes</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stroke dark:border-dark-3">
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Route</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Stops</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.active_routes as Record<string, unknown>[]).map((route, index) => (
                        <tr key={String(route.id ?? route.route_number ?? index)} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3 text-sm text-dark dark:text-white">{String(route.route_number ?? "")}</td>
                          <td className="py-3 text-right text-sm text-dark-4">{String(route.total_stops ?? "")}</td>
                          <td className="py-3 text-right text-sm font-medium text-green">{String(route.status ?? "")}</td>
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
