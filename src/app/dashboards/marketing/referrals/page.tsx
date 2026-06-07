"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { getMarketingDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

export default function MarketingReferralsPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMarketingDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const referrals = (data?.referrals ?? {}) as Record<string, unknown>;
  const referralStats = (referrals.by_status ?? {}) as Record<string, unknown>;
  const totalReferrals = Number(referrals.total_this_month ?? 0);
  const convertedReferrals = Number(referrals.converted_this_month ?? 0);
  const conversionRate = referrals.conversion_rate_percent != null ? Number(referrals.conversion_rate_percent).toFixed(1) : "0";
  const fmtN = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");

  return (
    <DashboardGuard requiredRole="marketing">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">🔗 Referrals</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Referral programme performance</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              <StatCard label="Total Referrals" value={fmtN(totalReferrals)} trend="up" icon="🔗" iconBg="bg-indigo-100" />
              <StatCard label="Converted" value={fmtN(convertedReferrals)} trend="up" icon="✅" iconBg="bg-green-100" />
              <div className="rounded-[10px] bg-white p-5 shadow-1 dark:bg-gray-dark">
                <p className="text-sm text-dark-4">Conversion Rate</p>
                <p className="mt-1 text-2xl font-bold text-primary">{conversionRate}%</p>
                <p className="mt-1 text-xs text-dark-4">{convertedReferrals} of {totalReferrals} referred users converted</p>
              </div>
            </div>

            {/* Referral stats breakdown */}
            {Object.keys(referralStats).length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">Referral Stats Breakdown</h2>
                <div className="divide-y divide-stroke dark:divide-dark-3">
                  {Object.entries(referralStats).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between py-3">
                      <span className="text-sm capitalize text-dark-4">{key.replace(/_/g, " ")}</span>
                      <span className="text-sm font-medium text-dark dark:text-white">{fmtN(val)}</span>
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
