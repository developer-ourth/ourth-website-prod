"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/contexts/auth-context";
import { getMarketingDashboard } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MarketingDashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMarketingDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const campaignSummary = (data?.campaign_summary ?? {}) as Record<string, unknown>;
  const campaigns = (data?.active_campaigns ?? []) as Record<string, unknown>[];
  const fmt = (n: unknown) => n != null ? Number(n).toLocaleString("en-IN") : "—";

  return (
    <DashboardGuard requiredRole="marketing">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">📣 Marketing Dashboard</h1>
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
              <StatCard label="Active Campaigns" value={fmt(campaignSummary.active_campaigns)} trend="up" icon="📪" iconBg="bg-purple-100" />
              <StatCard label="Total Impressions" value={fmt(campaignSummary.total_impressions)} trend="up" icon="👁️" iconBg="bg-blue-100" />
              <StatCard label="Conversions" value={fmt(campaignSummary.total_conversions)} trend="up" icon="🎯" iconBg="bg-green-100" />
              <StatCard label="Total Spent" value={campaignSummary.total_spent != null ? `₹${fmt(campaignSummary.total_spent)}` : "—"} icon="💸" iconBg="bg-orange-100" />
            </div>

            {campaigns.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Campaigns</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stroke dark:border-dark-3">
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Name</th>
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Type</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Impressions</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Conversions</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((c, i) => (
                        <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3 text-sm font-medium text-dark dark:text-white">{String(c.name ?? "")}</td>
                          <td className="py-3 text-sm text-dark-4">{String(c.type ?? "")}</td>
                          <td className="py-3 text-right text-sm text-dark-4">{fmt(c.impressions)}</td>
                          <td className="py-3 text-right text-sm font-semibold text-green">{fmt(c.conversions)}</td>
                          <td className="py-3 text-right text-sm">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.status === "active" ? "bg-green/20 text-green" : "bg-yellow/20 text-yellow-600"}`}>
                              {String(c.status ?? "")}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
