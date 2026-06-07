"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useAuth } from "@/contexts/auth-context";
import { getConsumerDashboard } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConsumerDashboard() {
  const { logout, user } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getConsumerDashboard(user.id)
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const score = (data?.sustainability_score ?? {}) as Record<string, unknown>;
  const recentRewards = (data?.recent_rewards ?? []) as Record<string, unknown>[];
  const activeSubscriptions = (data?.active_subscriptions ?? []) as Record<string, unknown>[];
  const subscription = activeSubscriptions[0] ?? null;
  const fmt = (n: unknown) => n != null ? Number(n).toLocaleString("en-IN") : "—";

  return (
    <DashboardGuard requiredRole="consumer">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">
              🌱 Consumer Dashboard
            </h1>
            <p className="text-sm text-dark-4 dark:text-dark-6">
              Welcome back, {user?.name ?? ""}
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
              <StatCard label="Green Points" value={fmt(score.total_points)} trend="up" icon="⭐" iconBg="bg-yellow-100" />
              <StatCard label="Eco Orders" value={fmt(score.eco_orders_count)} icon="📦" iconBg="bg-blue-100" />
              <StatCard label="CO₂ Saved" value={score.co2_saved_kg != null ? `${fmt(score.co2_saved_kg)} kg` : "—"} icon="🌿" iconBg="bg-green-100" />
              <StatCard label="Active Subscriptions" value={String(activeSubscriptions.length || "0")} icon="🔄" iconBg="bg-purple-100" />
            </div>

            {subscription && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">📦 Active Subscription</h2>
                <div className="flex items-center justify-between rounded-lg bg-green/10 px-4 py-3">
                  <div>
                    <p className="font-semibold text-dark dark:text-white">{String(subscription.plan_name ?? "")}</p>
                    <p className="text-xs text-dark-4">{String(subscription.frequency ?? "")} — ₹{String(subscription.plan_price ?? "")}</p>
                  </div>
                  <span className="rounded-full bg-green px-3 py-1 text-xs font-medium text-white">
                    {String(subscription.status ?? "")}
                  </span>
                </div>
              </div>
            )}

            {recentRewards.length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">⭐ Recent Rewards</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stroke dark:border-dark-3">
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Type</th>
                        <th className="pb-3 text-left text-sm font-medium text-dark-4">Description</th>
                        <th className="pb-3 text-right text-sm font-medium text-dark-4">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRewards.map((r, i) => (
                        <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3 text-sm font-medium text-dark dark:text-white">{String(r.transaction_type ?? "")}</td>
                          <td className="py-3 text-sm text-dark-4">{String(r.description ?? "")}</td>
                          <td className={`py-3 text-right text-sm font-semibold ${r.transaction_type === "earn" ? "text-green" : "text-red"}`}>
                            {r.transaction_type === "earn" ? "+" : "-"}{String(r.points ?? "")}
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

