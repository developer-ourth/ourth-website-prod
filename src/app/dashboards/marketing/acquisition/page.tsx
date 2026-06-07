"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { getMarketingDashboard } from "@/lib/api";
import { useEffect, useState } from "react";

const FUNNEL_LABELS: Record<string, string> = {
  registered: "Registered",
  kyc_submitted: "KYC Submitted",
  kyc_approved: "KYC Approved",
  first_order_placed: "First Order Placed",
  active_30d: "Active (30 days)",
};

export default function MarketingAcquisitionPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMarketingDashboard()
      .then((res) => setData(res))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const vendorAcquisition = (data?.vendor_acquisition ?? {}) as Record<string, unknown>;
  const funnel = (vendorAcquisition.funnel ?? {}) as Record<string, number>;
  const fmtN = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");

  const funnelKeys = ["registered", "kyc_submitted", "kyc_approved", "first_order_placed", "active_30d"];
  const topValue = Math.max(...funnelKeys.map((k) => Number(funnel[k] ?? 0)), 1);

  return (
    <DashboardGuard requiredRole="marketing">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-dark dark:text-white">🎯 Vendor Acquisition</h1>
          <p className="text-sm text-dark-4 dark:text-dark-6">Vendor onboarding funnel and acquisition metrics</p>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="New Vendors (Month)" value={fmtN(vendorAcquisition.new_this_month)} trend="up" icon="🏪" iconBg="bg-indigo-100" />
              <StatCard label="New Consumers (Month)" value={fmtN((data?.consumer_acquisition as Record<string, unknown>)?.new_this_month)} trend="up" icon="👥" iconBg="bg-purple-100" />
              <StatCard label="Pending KYC" value={fmtN(funnel.kyc_submitted != null && funnel.kyc_approved != null ? Number(funnel.kyc_submitted) - Number(funnel.kyc_approved) : 0)} trend={Number(funnel.kyc_submitted ?? 0) > Number(funnel.kyc_approved ?? 0) ? "down" : "up"} icon="⏳" iconBg="bg-yellow-100" />
              <StatCard label="Approved Vendors" value={fmtN(funnel.kyc_approved)} trend="up" icon="✅" iconBg="bg-green-100" />
            </div>

            {/* Funnel */}
            {Object.keys(funnel).length > 0 && (
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h2 className="mb-6 text-lg font-bold text-dark dark:text-white">Vendor Onboarding Funnel</h2>
                <div className="space-y-4">
                  {funnelKeys.map((key, i) => {
                    const count = Number(funnel[key] ?? 0);
                    const prev = i > 0 ? Number(funnel[funnelKeys[i - 1]] ?? 0) : count;
                    const dropPct = prev > 0 && i > 0 ? (((prev - count) / prev) * 100).toFixed(0) : null;
                    const barW = Math.round((count / topValue) * 100);

                    return (
                      <div key={key}>
                        {dropPct !== null && Number(dropPct) > 0 && (
                          <div className="mb-1 flex items-center gap-1 text-xs text-red-400">
                            <span>↓ {dropPct}% drop</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <span className="w-40 text-sm text-dark dark:text-white">{FUNNEL_LABELS[key] ?? key}</span>
                          <div className="flex-1 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                            <div
                              className="h-4 rounded-full transition-all"
                              style={{
                                width: `${barW}%`,
                                backgroundColor: `hsl(${220 - i * 30}, 70%, 55%)`,
                              }}
                            />
                          </div>
                          <span className="w-16 text-right text-sm font-bold text-dark dark:text-white">{fmtN(count)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
