"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { getFinanceDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

export default function FinanceEsgPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFinanceDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const esg = (data?.esg_metrics ?? {}) as Record<string, unknown>;
  const fmt = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");

  return (
    <DashboardGuard requiredRole="finance">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">🌱 ESG Metrics</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Environmental, Social & Governance performance indicators</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {/* E — Environmental */}
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-dark dark:text-white">
                🌍 Environmental
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <StatCard label="CO₂ Saved (kg)" value={fmt(esg.co2_saved_kg)} trend="up" icon="🌱" iconBg="bg-green-100" />
                <StatCard label="Plastic Avoided (kg)" value={fmt(esg.plastic_avoided_kg)} trend="up" icon="♻️" iconBg="bg-blue-100" />
                <StatCard label="Landfill Reduced (kg)" value={fmt(esg.landfill_reduction_kg)} trend="up" icon="🗑️" iconBg="bg-teal-100" />
              </div>
            </div>

            {/* S — Social */}
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-dark dark:text-white">
                🤝 Social
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
                <StatCard label="Eco Orders" value={fmt(esg.eco_orders_count)} icon="👥" iconBg="bg-purple-100" />
                <StatCard label="Impact Events" value={fmt((Number(esg.co2_saved_kg ?? 0) > 0 ? 1 : 0) + (Number(esg.plastic_avoided_kg ?? 0) > 0 ? 1 : 0))} icon="🌿" iconBg="bg-green-100" />
              </div>
            </div>

            {/* Full ESG data */}
            {Object.keys(esg).length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Full ESG Report</h2>
                <div className="divide-y divide-stroke dark:divide-dark-3">
                  {Object.entries(esg).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between py-3">
                      <span className="text-sm capitalize text-dark-4">{key.replace(/_/g, " ")}</span>
                      <span className="text-sm font-medium text-dark dark:text-white">{fmt(val)}</span>
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
