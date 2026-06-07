"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useOperationsLiveRefresh } from "@/hooks/use-operations-live-refresh";
import { getOperationsDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

export default function OperationsSLAPage() {
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
  const partnerPerformance = (data?.delivery_partner_performance ?? []) as Record<string, unknown>[];

  const slaBreaches = Number(orders.sla_breaches ?? 0);
  const avgTime = deliveries.avg_delivery_time_minutes;
  const fmt = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");

  return (
    <DashboardGuard requiredRole="operations">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">⏱️ SLA & Alerts</h1>
            <p className="text-sm text-dark-4 dark:text-dark-6">Service level agreement monitoring and delivery performance</p>
          </div>
          {slaBreaches > 0 && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
              {slaBreaches} SLA Breach{slaBreaches !== 1 ? "es" : ""}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="SLA Breaches" value={fmt(orders.sla_breaches)} trend={slaBreaches > 0 ? "down" : "up"} icon="🚨" iconBg={slaBreaches > 0 ? "bg-red-100" : "bg-green-100"} />
              <StatCard label="In Transit" value={fmt(orders.in_transit)} icon="🚚" iconBg="bg-blue-100" />
              <StatCard label="Avg Delivery Time" value={avgTime != null ? `${fmt(avgTime)} min` : "—"} icon="⏱️" iconBg="bg-teal-100" />
              <StatCard label="Today Failed" value={fmt(deliveries.today_failed)} icon="❌" iconBg="bg-red-100" />
            </div>

            {/* Delivery status breakdown */}
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Today's Delivery Status</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/10">
                  <p className="text-2xl font-bold text-green-600">{fmt(deliveries.today_delivered)}</p>
                  <p className="mt-1 text-sm text-dark-4">Delivered</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-900/10">
                  <p className="text-2xl font-bold text-blue-600">{fmt(deliveries.today_total)}</p>
                  <p className="mt-1 text-sm text-dark-4">Total Today</p>
                </div>
                <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/10">
                  <p className="text-2xl font-bold text-red-600">{fmt(deliveries.today_failed)}</p>
                  <p className="mt-1 text-sm text-dark-4">Failed</p>
                </div>
              </div>
            </div>

            {/* Partner performance */}
            {partnerPerformance.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Delivery Partner Performance (Last 7 Days)</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stroke dark:border-dark-3">
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Partner</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Assigned</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Delivered</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Success Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partnerPerformance.map((p, i) => {
                        const rate = Number(p.success_rate ?? 0);
                        return (
                          <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                            <td className="py-3 text-sm font-medium text-dark dark:text-white">{String(p.name ?? "—")}</td>
                            <td className="py-3 text-right text-sm text-dark-4">{fmt(p.total_assigned)}</td>
                            <td className="py-3 text-right text-sm text-dark-4">{fmt(p.delivered_count)}</td>
                            <td className="py-3 text-right text-sm font-bold" style={{ color: rate >= 90 ? "#22c55e" : rate >= 70 ? "#f59e0b" : "#ef4444" }}>
                              {rate}%
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
