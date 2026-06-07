"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { getFinanceDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

export default function FinanceCacLtvPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFinanceDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const cacLtv = (data?.cac_ltv ?? {}) as Record<string, unknown>;
  const unitEco = (data?.unit_economics ?? {}) as Record<string, unknown>;
  const fmt = (n: unknown) => (n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—");
  const fmtRaw = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");

  const ratio = Number(cacLtv.ltv_cac_ratio ?? 0);
  const ratioColor = ratio >= 3 ? "text-green-600" : ratio >= 2 ? "text-yellow-500" : "text-red-600";

  return (
    <DashboardGuard requiredRole="finance">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">📊 CAC / LTV</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Customer acquisition cost, lifetime value, and unit economics</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="CAC" value={fmt(cacLtv.cac)} trend="down" icon="📉" iconBg="bg-red-100" />
              <StatCard label="LTV" value={fmt(cacLtv.ltv)} trend="up" icon="📈" iconBg="bg-green-100" />
              <div className="rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark">
                <p className="text-sm text-dark-4">LTV / CAC Ratio</p>
                <p className={`mt-1 text-2xl font-bold ${ratioColor}`}>{ratio > 0 ? `${ratio.toFixed(2)}x` : "—"}</p>
                <p className="mt-1 text-xs text-dark-4">{ratio >= 3 ? "✅ Excellent (target: 3×)" : ratio >= 2 ? "⚠️ Acceptable" : "🚨 Below target"}</p>
              </div>
            </div>

            {/* Unit economics */}
            {Object.keys(unitEco).length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Unit Economics</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {Object.entries(unitEco).map(([key, val]) => (
                    <div key={key} className="rounded-lg bg-gray-50 p-4 dark:bg-dark-2">
                      <p className="text-xs text-dark-4 capitalize">{key.replace(/_/g, " ")}</p>
                      <p className="mt-1 text-lg font-bold text-dark dark:text-white">
                        {typeof val === "number" && key.includes("revenue") ? fmt(val) : fmtRaw(val)}
                      </p>
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
