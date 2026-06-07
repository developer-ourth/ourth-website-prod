"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { getWasteCollections, getWasteManagementDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

const STATUS_STYLES: Record<string, string> = {
  collected: "bg-green-100 text-green-700",
  scheduled: "bg-blue-100 text-blue-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  missed: "bg-red-100 text-red-700",
};

export default function WasteCollectionsPage() {
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [collectionsList, setCollectionsList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getWasteManagementDashboard(), getWasteCollections()])
      .then(([summaryRes, collectionsRes]) => {
        setSummary(summaryRes);
        setCollectionsList((collectionsRes.collections ?? []) as Record<string, unknown>[]);
      })
      .catch(() => {
        setSummary(null);
        setCollectionsList([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const collections = (summary?.collections_today ?? {}) as Record<string, unknown>;
  const fmt = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");

  return (
    <DashboardGuard requiredRole="waste_management">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">🚛 Collections</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Today's waste collection runs and history</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Total Today" value={fmt(collections.total)} icon="🚛" iconBg="bg-indigo-100" />
              <StatCard label="Completed" value={fmt(collections.completed)} trend="up" icon="✅" iconBg="bg-green-100" />
              <StatCard label="Pending" value={fmt(collections.pending)} trend={Number(collections.pending ?? 0) > 0 ? "down" : "up"} icon="⏳" iconBg="bg-yellow-100" />
            </div>

            {collectionsList.length > 0 ? (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Recent Collections</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stroke dark:border-dark-3">
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Bin ID</th>
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Type</th>
                        <th className="pb-3 text-center text-sm font-medium text-dark-4">Status</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Weight (kg)</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Collected At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collectionsList.map((c, i) => (
                        <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3 text-sm font-mono text-dark dark:text-white">{String((c.dustbin as Record<string, unknown>)?.bin_label ?? "—")}</td>
                          <td className="py-3 text-sm capitalize text-dark-4">{String((c.dustbin as Record<string, unknown>)?.bin_type ?? "—").replace("_", " ")}</td>
                          <td className="py-3 text-center">
                            <span className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${STATUS_STYLES[String(c.status ?? "")] ?? "bg-gray-100 text-gray-600"}`}>
                              {String(c.status ?? "—").replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-3 text-right text-sm text-dark-4">{String((c.segregation_log as Record<string, unknown>)?.total_waste_kg ?? "—")}</td>
                          <td className="py-3 text-right text-sm text-dark-4">
                            {c.scheduled_time ? new Date(String(c.scheduled_time)).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="rounded-[10px] bg-white p-12 text-center shadow-1 dark:bg-gray-dark">
                <p className="text-4xl">🚛</p>
                <p className="mt-3 text-dark-4">No collections logged yet today</p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
