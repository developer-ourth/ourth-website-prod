"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { getAdminCampaigns } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminCampaigns()
      .then((res) => {
        const rows = (res.data ?? []) as Record<string, unknown>[];
        setCampaigns(rows);
        setTotal(Number(res.total ?? rows.length));
      })
      .catch(() => {
        setCampaigns([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");
  const activeCount = campaigns.filter((c) => String(c.status) === "active").length;

  return (
    <DashboardGuard requiredRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">📣 Campaigns Overview</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Platform-wide campaign summary (detailed data in Marketing dashboard)</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Active Campaigns" value={fmt(activeCount)} trend="up" icon="📣" iconBg="bg-indigo-100" />
              <StatCard label="Total Campaigns" value={fmt(total)} icon="📋" iconBg="bg-blue-100" />
            </div>

            <div className="rounded-[10px] border border-blue-200 bg-blue-50 p-5 dark:border-blue-800 dark:bg-blue-900/10">
              <p className="font-semibold text-blue-700 dark:text-blue-400">💡 Full campaign analytics</p>
              <p className="mt-1 text-sm text-blue-600 dark:text-blue-500">
                Detailed campaign performance — impressions, clicks, conversions, spend, and referral stats — is available in the Marketing dashboard.
              </p>
            </div>

            {campaigns.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Campaign List</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stroke dark:border-dark-3">
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Name</th>
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Type</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Budget</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Spent</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((campaign, index) => (
                        <tr key={index} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3 text-sm font-medium text-dark dark:text-white">{String(campaign.name ?? "—")}</td>
                          <td className="py-3 text-sm text-dark-4">{String(campaign.type ?? "—")}</td>
                          <td className="py-3 text-right text-sm text-dark-4">₹{fmt(campaign.budget)}</td>
                          <td className="py-3 text-right text-sm text-dark-4">₹{fmt(campaign.amount_spent)}</td>
                          <td className="py-3 text-right text-sm text-dark-4 capitalize">{String(campaign.status ?? "—")}</td>
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
