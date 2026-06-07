"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { getMarketingDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

export default function MarketingCampaignsPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMarketingDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const summary = (data?.campaign_summary ?? {}) as Record<string, unknown>;
  const campaigns = (data?.active_campaigns ?? []) as Record<string, unknown>[];
  const fmt = (n: unknown) => (n != null ? `₹${Number(n).toLocaleString("en-IN")}` : "—");
  const fmtN = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");

  return (
    <DashboardGuard requiredRole="marketing">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">📣 Campaigns</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Active marketing campaigns and performance</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Active Campaigns" value={fmtN(summary.active_campaigns)} icon="📣" iconBg="bg-indigo-100" />
              <StatCard label="Total Budget" value={fmt(campaigns.reduce((sum, c) => sum + Number(c.budget ?? 0), 0))} icon="💰" iconBg="bg-blue-100" />
              <StatCard label="Total Spent" value={fmt(summary.total_spent)} icon="💸" iconBg="bg-red-100" />
              <StatCard label="Impressions" value={fmtN(summary.total_impressions)} trend="up" icon="👁️" iconBg="bg-purple-100" />
            </div>

            {campaigns.length > 0 ? (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Active Campaigns</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stroke dark:border-dark-3">
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Campaign</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Budget</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Spent</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Impressions</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Clicks</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Conversions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((c, i) => (
                        <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3 text-sm font-medium text-dark dark:text-white">{String(c.name ?? "—")}</td>
                          <td className="py-3 text-right text-sm text-dark-4">{fmt(c.budget)}</td>
                          <td className="py-3 text-right text-sm text-dark-4">{fmt(c.amount_spent)}</td>
                          <td className="py-3 text-right text-sm text-dark-4">{fmtN(c.impressions)}</td>
                          <td className="py-3 text-right text-sm text-dark-4">{fmtN(c.clicks)}</td>
                          <td className="py-3 text-right text-sm font-semibold text-green-600">{fmtN(c.conversions)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="rounded-[10px] bg-white p-12 text-center shadow-1 dark:bg-gray-dark">
                <p className="text-dark-4">No active campaigns</p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
