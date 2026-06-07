"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { getWasteManagementDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

export default function WasteImpactPage() {
  const [data, setData, ] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWasteManagementDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const impact = (data?.monthly_impact ?? {}) as Record<string, unknown>;
  const fmt = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");

  return (
    <DashboardGuard requiredRole="waste_management">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">🌍 Environmental Impact</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Monthly environmental metrics and sustainability performance</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <StatCard label="Waste Diverted (kg)" value={fmt(impact.waste_diverted_kg)} trend="up" icon="♻️" iconBg="bg-green-100" />
              <StatCard label="CO₂ Saved (kg)" value={fmt(impact.co2_saved_kg)} trend="up" icon="🌱" iconBg="bg-teal-100" />
              <StatCard label="Plastic Recycled (kg)" value={fmt(impact.plastic_recycled_kg)} trend="up" icon="🧴" iconBg="bg-blue-100" />
              <StatCard label="Compost Generated (kg)" value={fmt(impact.compost_generated_kg)} trend="up" icon="🌿" iconBg="bg-yellow-100" />
              <StatCard label="Trees Equivalent" value={fmt(impact.trees_equivalent)} trend="up" icon="🌳" iconBg="bg-green-100" />
              <StatCard label="Collections Done" value={fmt(impact.collections_count)} icon="🚛" iconBg="bg-indigo-100" />
            </div>

            {/* Co2 equivalent callout */}
            {impact.co2_saved_kg != null && Number(impact.co2_saved_kg) > 0 && (
              <div className="rounded-[10px] border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/10">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">🌳</div>
                  <div>
                    <p className="text-xl font-bold text-green-700 dark:text-green-300">
                      {fmt(impact.trees_equivalent)} Trees Worth of CO₂ Saved
                    </p>
                    <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                      Your waste management operations saved {fmt(impact.co2_saved_kg)} kg of CO₂ emissions this month.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* All impact fields */}
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Full Impact Summary</h2>
              <div className="divide-y divide-stroke dark:divide-dark-3">
                {Object.entries(impact).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between py-3">
                    <span className="text-sm capitalize text-dark-4">{key.replace(/_/g, " ")}</span>
                    <span className="text-sm font-medium text-dark dark:text-white">{fmt(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
