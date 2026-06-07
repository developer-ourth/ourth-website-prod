"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/contexts/auth-context";
import { getFounderDashboard } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function FounderDashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getFounderDashboard();
      setData(res);
    } catch {
      setData(null);
      setError("Unable to fetch founder dashboard data from the database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // Map actual API response keys to component variables
  const revenue = (data?.revenue ?? {}) as Record<string, unknown>;
  const orders = (data?.orders ?? {}) as Record<string, unknown>;
  const vendors = (data?.vendors ?? {}) as Record<string, unknown>;
  const cityPerformance = (data?.city_performance ?? []) as Record<string, unknown>[];
  const alerts = ((data?.alerts as Record<string, unknown>)?.items ?? []) as Record<string, unknown>[];
  const impact = ((data?.waste_impact as Record<string, unknown>)?.this_month ?? {}) as Record<string, unknown>;

  const fmt = (n: unknown) => n != null ? Number(n).toLocaleString("en-IN") : "—";

  return (
    <DashboardGuard requiredRole="founder">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">
              🚀 Founder / CXO Dashboard
            </h1>
            <p className="text-sm text-dark-4 dark:text-dark-6">
              Real-time business overview —{" "}
              {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadDashboard}
              className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-gray-dark"
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-gray-dark"
            >
              Sign Out
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 2xl:gap-7.5">
              <StatCard label="Revenue Today" value={`₹${fmt(revenue.today)}`} trend="up" icon="💰" iconBg="bg-yellow-100" />
              <StatCard label="Monthly Revenue" value={`₹${fmt(revenue.this_month)}`} trend="up" icon="📈" iconBg="bg-green-100" />
              <StatCard label="Orders Today" value={fmt(orders.today)} trend="up" icon="📦" iconBg="bg-teal-100" />
              <StatCard label="Orders This Month" value={fmt(orders.this_month)} icon="📅" iconBg="bg-blue-100" />
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 2xl:gap-7.5">
              <StatCard label="Total Vendors" value={fmt(vendors.total)} icon="🏪" iconBg="bg-orange-100" />
              <StatCard label="Active Vendors" value={fmt(vendors.active)} trend="up" icon="🛒" iconBg="bg-green-100" />
              <StatCard label="Pending KYC" value={fmt(vendors.pending_kyc)} icon="📋" iconBg="bg-yellow-100" />
              <StatCard label="Cities Active" value={String(cityPerformance.length || "—")} icon="🏙️" iconBg="bg-indigo-100" />
            </div>

            {/* City Performance */}
            {cityPerformance.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">
                  City Performance (This Month)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stroke dark:border-dark-3">
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">City</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Orders</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cityPerformance.map((row, i) => (
                        <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3 text-sm font-medium text-dark dark:text-white">{String(row.city ?? "—")}</td>
                          <td className="py-3 text-right text-sm text-dark-4">{fmt(row.orders)}</td>
                          <td className="py-3 text-right text-sm font-semibold text-dark dark:text-white">₹{fmt(row.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Alerts */}
            {alerts.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Active Alerts</h2>
                <div className="space-y-3">
                  {alerts.map((alert, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-3 rounded-lg border-l-4 px-4 py-3 ${
                        alert.severity === "critical"
                          ? "border-red bg-red/10"
                          : alert.severity === "warning"
                            ? "border-yellow bg-yellow/10"
                            : "border-blue bg-blue/10"
                      }`}
                    >
                      <span className="mt-0.5 text-lg">
                        {alert.severity === "critical" ? "🔴" : alert.severity === "warning" ? "🟡" : "🔵"}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-dark dark:text-white">{String(alert.title ?? "")}</p>
                        <p className="text-xs text-dark-4">{String(alert.message ?? "")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impact */}
            {impact && Object.keys(impact).length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">
                  🌿 Sustainability Impact (This Month)
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green">{fmt(impact.plastic_avoided_kg)} kg</p>
                    <p className="text-xs text-dark-4">Plastic Avoided</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-teal-600">{fmt(impact.landfill_reduction_kg)} kg</p>
                    <p className="text-xs text-dark-4">Landfill Reduced</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{fmt(impact.co2_saved_kg)} kg</p>
                    <p className="text-xs text-dark-4">CO₂ Saved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{fmt(impact.total_waste_collected_kg)} kg</p>
                    <p className="text-xs text-dark-4">Total Waste</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
