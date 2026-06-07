"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { getWasteManagementDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

export default function WasteRecyclingPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWasteManagementDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const segregation = (data?.segregation_this_month ?? {}) as Record<string, unknown>;
  const recycling = (data?.recycling_this_month ?? {}) as Record<string, unknown>;
  const fmt = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");

  return (
    <DashboardGuard requiredRole="waste_management">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">♻️ Recycling & Segregation</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Monthly waste segregation and recycling metrics</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Segregation */}
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Segregation This Month</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Dry Waste (kg)" value={fmt(segregation.dry_waste_kg)} icon="📋" iconBg="bg-indigo-100" />
                <StatCard label="Wet Waste (kg)" value={fmt(segregation.wet_waste_kg)} icon="🌿" iconBg="bg-green-100" />
                <StatCard label="Plastic Waste (kg)" value={fmt(segregation.plastic_waste_kg)} icon="♻️" iconBg="bg-blue-100" />
                <StatCard label="E-Waste (kg)" value={fmt(segregation.e_waste_kg)} icon="🗑️" iconBg="bg-red-100" />
              </div>
            </div>

            {/* Recycling */}
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Recycling This Month</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Input (kg)" value={fmt(recycling.input_kg)} trend="up" icon="♻️" iconBg="bg-green-100" />
                <StatCard label="Recycled (kg)" value={fmt(recycling.recycled_kg)} icon="🧴" iconBg="bg-blue-100" />
                <StatCard label="Efficiency" value={recycling.avg_efficiency_percent != null ? `${Number(recycling.avg_efficiency_percent).toFixed(1)}%` : "—"} icon="📰" iconBg="bg-yellow-100" />
                <StatCard label="CO₂ Saved (kg)" value={fmt(recycling.co2_saved_kg)} icon="🔧" iconBg="bg-gray-100" />
              </div>
            </div>

            {/* Segregation score */}
            {segregation.dry_waste_kg != null && (
              <div className="rounded-[10px] border border-green-200 bg-green-50 p-5 dark:border-green-800 dark:bg-green-900/10">
                <p className="font-semibold text-green-700 dark:text-green-400">
                  🌍 Total waste segregated this month: {fmt(Number(segregation.dry_waste_kg ?? 0) + Number(segregation.wet_waste_kg ?? 0) + Number(segregation.plastic_waste_kg ?? 0) + Number(segregation.e_waste_kg ?? 0) + Number(segregation.hazardous_waste_kg ?? 0) + Number(segregation.other_waste_kg ?? 0))} kg
                </p>
                <p className="mt-1 text-sm text-green-600 dark:text-green-500">
                  Good segregation keeps recyclables clean and maximises recovery rates.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
