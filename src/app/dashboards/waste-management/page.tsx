"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/contexts/auth-context";
import { getWasteManagementDashboard } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WasteManagementDashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWasteManagementDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const dustbinStats = (data?.dustbins ?? {}) as Record<string, unknown>;
  const collectionsToday = (data?.collections_today ?? {}) as Record<string, unknown>;
  const monthlyImpact = (data?.monthly_impact ?? {}) as Record<string, unknown>;
  const fmt = (n: unknown) => n != null ? Number(n).toLocaleString("en-IN") : "—";

  return (
    <DashboardGuard requiredRole="waste_management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">♻️ Waste Management Dashboard</h1>
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
              <StatCard label="Total Dustbins" value={fmt(dustbinStats.total)} icon="🗑️" iconBg="bg-gray-100" />
              <StatCard label="Full Bins (≥90%)" value={fmt(dustbinStats.full)} icon="⚠️" iconBg="bg-red-100" />
              <StatCard label="Collections Today" value={fmt(collectionsToday.total)} trend="up" icon="🚛" iconBg="bg-blue-100" />
              <StatCard label="Completed Today" value={fmt(collectionsToday.completed)} icon="✅" iconBg="bg-green-100" />
            </div>

            {Object.keys(monthlyImpact).length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">🌿 Monthly Impact</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green">{fmt(monthlyImpact.plastic_avoided_kg)} kg</p>
                    <p className="text-xs text-dark-4">Plastic Avoided</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-teal-600">{fmt(monthlyImpact.co2_saved_kg)} kg</p>
                    <p className="text-xs text-dark-4">CO₂ Saved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{fmt(monthlyImpact.total_waste_collected_kg)} kg</p>
                    <p className="text-xs text-dark-4">Total Collected</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{monthlyImpact.avg_recycling_rate != null ? `${monthlyImpact.avg_recycling_rate}%` : "—"}</p>
                    <p className="text-xs text-dark-4">Recycling Rate</p>
                  </div>
                </div>
              </div>
            )}

            {(data?.segregation_this_month as Record<string, unknown>) && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">📦 Segregation This Month</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {Object.entries((data?.segregation_this_month as Record<string, unknown>) ?? {}).map(([key, val]) => (
                    <div key={key} className="text-center">
                      <p className="text-xl font-bold text-dark dark:text-white">{fmt(val)} kg</p>
                      <p className="text-xs capitalize text-dark-4">{key.replace(/_/g, " ")}</p>
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
