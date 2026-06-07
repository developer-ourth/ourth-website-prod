"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { getFounderDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

const SEVERITY_STYLES: Record<string, string> = {
  critical: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
};

export default function FounderAlertsPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFounderDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const alertsBlock = (data?.alerts ?? {}) as Record<string, unknown>;
  const alerts = (alertsBlock.items ?? []) as Record<string, unknown>[];
  const criticalCount = Number(alertsBlock.critical_count ?? 0);
  const unresolvedCount = alerts.length;

  return (
    <DashboardGuard requiredRole="founder">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">🔔 Alerts</h1>
            <p className="text-sm text-dark-4 dark:text-dark-6">
              System and operational alerts requiring attention
            </p>
          </div>
          {criticalCount > 0 && (
            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
              {criticalCount} Critical
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[10px] bg-red-50 p-5 dark:bg-red-900/10">
                <p className="text-sm text-dark-4">Critical Alerts</p>
                <p className="mt-1 text-3xl font-bold text-red-600">{criticalCount}</p>
              </div>
              <div className="rounded-[10px] bg-yellow-50 p-5 dark:bg-yellow-900/10">
                <p className="text-sm text-dark-4">Unresolved Total</p>
                <p className="mt-1 text-3xl font-bold text-yellow-600">{unresolvedCount}</p>
              </div>
            </div>

            {alerts.length === 0 ? (
              <div className="rounded-[10px] bg-white p-12 text-center shadow-1 dark:bg-gray-dark">
                <p className="text-4xl">✅</p>
                <p className="mt-3 text-dark-4">No active alerts — all clear!</p>
              </div>
            ) : (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Active Alerts</h2>
                <div className="space-y-3">
                  {alerts.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg border border-stroke p-4 dark:border-dark-3">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-bold uppercase ${SEVERITY_STYLES[String(a.severity ?? "info")]}`}
                      >
                        {String(a.severity ?? "info")}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-dark dark:text-white">{String(a.title ?? a.alert_type ?? "—")}</p>
                        {a.message != null && (
                          <p className="mt-0.5 text-xs text-dark-4">{String(a.message)}</p>
                        )}
                      </div>
                      {a.city != null && (
                        <span className="text-xs text-dark-4">{String(a.city)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
