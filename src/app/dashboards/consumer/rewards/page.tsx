"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/contexts/auth-context";
import { getConsumerDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

const TIER_STYLES: Record<string, string> = {
  bronze: "bg-orange-100 text-orange-700",
  silver: "bg-gray-100 text-gray-700",
  gold: "bg-yellow-100 text-yellow-700",
  platinum: "bg-indigo-100 text-indigo-700",
};

export default function ConsumerRewardsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getConsumerDashboard(user.id)
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [user]);

  const score = (data?.sustainability_score ?? {}) as Record<string, unknown>;
  const rewards = (data?.recent_rewards ?? []) as Record<string, unknown>[];
  const fmt = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");
  const tier = String(score.tier ?? "bronze");

  return (
    <DashboardGuard requiredRole="consumer">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">🌱 Eco Scores & Rewards</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Your sustainability impact and points history</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Tier badge */}
            <div className="flex items-center gap-4 rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">🏅</div>
              <div>
                <span className={`rounded-full px-3 py-1 text-sm font-bold uppercase ${TIER_STYLES[tier] ?? "bg-gray-100 text-gray-700"}`}>
                  {tier} tier
                </span>
                <p className="mt-2 text-3xl font-bold text-dark dark:text-white">{fmt(score.total_points)} <span className="text-base font-normal text-dark-4">points</span></p>
              </div>
            </div>

            {/* Score breakdown */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Green Points" value={fmt(score.green_points)} trend="up" icon="🟢" iconBg="bg-green-100" />
              <StatCard label="Carbon Points" value={fmt(score.carbon_points)} trend="up" icon="💨" iconBg="bg-blue-100" />
              <StatCard label="CO₂ Saved" value={score.co2_saved_kg != null ? `${fmt(score.co2_saved_kg)} kg` : "—"} icon="🌍" iconBg="bg-teal-100" />
              <StatCard label="Plastic Avoided" value={score.plastic_avoided_kg != null ? `${fmt(score.plastic_avoided_kg)} kg` : "—"} icon="♻️" iconBg="bg-yellow-100" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Eco Orders" value={fmt(score.eco_orders_count)} icon="📦" iconBg="bg-indigo-100" />
              <StatCard label="Bins Used" value={fmt(score.bins_used_count)} icon="🗑️" iconBg="bg-orange-100" />
            </div>

            {/* Rewards history */}
            {rewards.length > 0 ? (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">⭐ Recent Reward Transactions</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stroke dark:border-dark-3">
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Type</th>
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Description</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Points</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Balance</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rewards.map((r, i) => (
                        <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3">
                            <span className={`rounded px-2 py-0.5 text-xs font-semibold uppercase ${r.transaction_type === "earn" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {String(r.transaction_type ?? "")}
                            </span>
                          </td>
                          <td className="py-3 text-sm text-dark-4">{String(r.description ?? "—")}</td>
                          <td className={`py-3 text-right text-sm font-bold ${r.transaction_type === "earn" ? "text-green-600" : "text-red-600"}`}>
                            {r.transaction_type === "earn" ? "+" : "-"}{fmt(r.points)}
                          </td>
                          <td className="py-3 text-right text-sm text-dark-4">{fmt(r.points_balance_after)}</td>
                          <td className="py-3 text-right text-sm text-dark-4">
                            {r.created_at ? new Date(String(r.created_at)).toLocaleDateString("en-IN") : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="rounded-[10px] bg-white p-10 text-center shadow-1 dark:bg-gray-dark">
                <p className="text-dark-4">No reward transactions yet. Start shopping eco-friendly to earn points!</p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
