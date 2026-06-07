"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { getFinanceDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

export default function FinanceBurnPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFinanceDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const burn = (data?.burn_runway ?? {}) as Record<string, unknown>;
  const fmt = (n: unknown) => (n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—");

  const runwayDays = Number(burn.runway_days ?? 0);
  const runwayColor = runwayDays >= 180 ? "text-green-600" : runwayDays >= 90 ? "text-yellow-500" : "text-red-600";

  return (
    <DashboardGuard requiredRole="finance">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">🔥 Burn Rate & Runway</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Cash burn metrics and runway projection</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Daily Burn Rate" value={fmt(burn.daily_burn_rate)} trend="down" icon="🔥" iconBg="bg-red-100" />
              <StatCard label="Cash Balance" value={fmt(burn.cash_balance)} icon="💵" iconBg="bg-green-100" />
              <div className="rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark">
                <p className="text-sm text-dark-4">Runway</p>
                <p className={`mt-1 text-2xl font-bold ${runwayColor}`}>{runwayDays > 0 ? `${runwayDays} days` : "—"}</p>
                <p className="mt-1 text-xs text-dark-4">{runwayDays >= 180 ? "✅ Healthy" : runwayDays >= 90 ? "⚠️ Monitor closely" : "🚨 Critical — fundraise now"}</p>
              </div>
            </div>

            {/* Projection */}
            {burn.cash_balance != null && burn.daily_burn_rate != null && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Burn Details</h2>
                <div className="divide-y divide-stroke dark:divide-dark-3">
                  {[
                    { label: "Cash Balance", value: fmt(burn.cash_balance) },
                    { label: "Daily Burn Rate", value: fmt(burn.daily_burn_rate) },
                    { label: "Monthly Burn (estimate)", value: burn.daily_burn_rate != null ? fmt(Number(burn.daily_burn_rate) * 30) : "—" },
                    { label: "Runway", value: runwayDays > 0 ? `${runwayDays} days` : "—" },
                    { label: "Months of Runway", value: runwayDays > 0 ? `${(runwayDays / 30).toFixed(1)} months` : "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-3">
                      <span className="text-sm text-dark-4">{label}</span>
                      <span className="text-sm font-medium text-dark dark:text-white">{value}</span>
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
