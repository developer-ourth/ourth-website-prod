"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { getAdminAlerts } from "@/lib/api";
import { useEffect, useState } from "react";

const SEVERITY_STYLES: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-blue-100 text-blue-700",
};

export default function AdminAlertsPage() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAlerts({ unresolved: true })
      .then((res) => {
        const rows = (res.data ?? []) as Record<string, unknown>[];
        setItems(rows);
        setTotal(Number(res.total ?? rows.length));
      })
      .catch(() => {
        setItems([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, []);
  const fmt = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");
  const criticalCount = items.filter((a) => String(a.severity ?? "") === "critical").length;

  return (
    <DashboardGuard requiredRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">🚨 Platform Alerts</h1>
            <p className="text-sm text-dark-4 dark:text-dark-6">Unresolved and critical system alerts</p>
          </div>
          {criticalCount > 0 && (
            <span className="animate-pulse rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
              {fmt(criticalCount)} Critical
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Unresolved" value={fmt(total)} trend={total > 0 ? "down" : "up"} icon="⚠️" iconBg="bg-yellow-100" />
              <StatCard label="Critical" value={fmt(criticalCount)} trend={criticalCount > 0 ? "down" : "up"} icon="🚨" iconBg="bg-red-100" />
              <StatCard label="Info / Warning" value={fmt(Math.max(0, total - criticalCount))} trend="up" icon="✅" iconBg="bg-green-100" />
            </div>

            {items.length > 0 ? (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Active Alerts</h2>
                <div className="space-y-3">
                  {items.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg border border-stroke p-4 dark:border-dark-3">
                      <span className={`mt-0.5 rounded px-2 py-0.5 text-xs font-semibold uppercase ${SEVERITY_STYLES[String(a.severity ?? "")] ?? "bg-gray-100 text-gray-600"}`}>
                        {String(a.severity ?? "—")}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-dark dark:text-white">{String(a.title ?? a.message ?? "—")}</p>
                        <p className="mt-0.5 text-xs text-dark-4">
                          {String(a.alert_type ?? "").replace("_", " ")}
                          {a.created_at ? ` · ${new Date(String(a.created_at)).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}` : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[10px] bg-white p-12 text-center shadow-1 dark:bg-gray-dark">
                <p className="text-4xl">✅</p>
                <p className="mt-3 font-medium text-dark dark:text-white">All clear!</p>
                <p className="mt-1 text-sm text-dark-4">No unresolved alerts at this time</p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
