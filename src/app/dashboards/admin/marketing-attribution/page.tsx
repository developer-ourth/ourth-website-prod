"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { StatCard } from "@/components/ui/stat-card";
import { useEffect, useState } from "react";
import { getMarketingAttributionApi, sendWhatsAppBroadcastApi } from "@/lib/api";

export default function MarketingAttributionDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [segment, setSegment] = useState("all");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const [broadcastAlert, setBroadcastAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchAttributionData = async () => {
    try {
      const res = await getMarketingAttributionApi();
      if (res?.status === "success") {
        setData(res.data);
      }
    } catch (e) {
      console.error("Failed to load marketing attribution data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributionData();
  }, []);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setSendingBroadcast(true);
    setBroadcastAlert(null);

    try {
      const res = await sendWhatsAppBroadcastApi({
        segment,
        message: broadcastMessage,
      });

      if (res?.status === "success") {
        setBroadcastAlert({ type: "success", text: res.message });
        setBroadcastMessage("");
      } else {
        setBroadcastAlert({ type: "error", text: "Failed to send WhatsApp broadcast." });
      }
    } catch (err: any) {
      setBroadcastAlert({ type: "error", text: err?.message || "Error dispatching broadcast." });
    } finally {
      setSendingBroadcast(false);
    }
  };

  const fmt = (n: any) => (n != null ? Number(n).toLocaleString("en-IN") : "0");

  return (
    <DashboardGuard requiredRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">🎯 Marketing Attribution & WhatsApp Automation</h1>
            <p className="text-sm text-dark-4 dark:text-dark-6">
              Track Meta Ad ROAS, CAPI Event Match Quality, and 1-Click WhatsApp Broadcasts
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <>
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 2xl:gap-7.5">
              <StatCard label="Total Touchpoints" value={fmt(data?.total_touchpoints)} trend="up" icon="📌" iconBg="bg-blue-100" />
              <StatCard label="CAPI Synced Orders" value={fmt(data?.total_capi_synced)} trend="up" icon="⚡" iconBg="bg-green-100" />
              <StatCard label="Successful CAPI Logs" value={fmt(data?.total_capi_logs)} icon="✅" iconBg="bg-purple-100" />
            </div>

            {/* 1-Click WhatsApp Broadcast Sender Section */}
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-2 text-lg font-bold text-dark dark:text-white">📲 1-Click WhatsApp Broadcast Controller</h2>
              <p className="mb-4 text-xs text-dark-4 dark:text-dark-6">
                Send targeted promotional WhatsApp campaign messages to your customer segments via Meta Cloud API.
              </p>

              {broadcastAlert && (
                <div className={`mb-4 rounded-lg p-3 text-sm font-medium ${broadcastAlert.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {broadcastAlert.text}
                </div>
              )}

              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white">Target Audience Segment</label>
                  <select
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm text-dark dark:border-dark-3 dark:text-white"
                  >
                    <option value="all">All Registered Customers</option>
                    <option value="b2b">B2B Wholesale Buyers / Caterers</option>
                    <option value="b2c">B2C Retail Customers</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white">Broadcast Message</label>
                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Hi {name}! 🌿 Enjoy 10% OFF on 100% natural Areca Leaf Tableware. Use code GREEN10 at https://www.healingourth.com/cart"
                    className="w-full rounded-lg border border-stroke bg-transparent p-3 text-sm text-dark dark:border-dark-3 dark:text-white"
                    required
                  />
                  <span className="text-xs text-dark-4">Tip: Use <strong>{"{name}"}</strong> to automatically insert the customer's name!</span>
                </div>

                <button
                  type="submit"
                  disabled={sendingBroadcast}
                  className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                  {sendingBroadcast ? "Sending Broadcast..." : "🚀 Dispatch WhatsApp Broadcast"}
                </button>
              </form>
            </div>

            {/* Campaign ROI Table */}
            <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
              <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">📊 Campaign Revenue & Attribution Breakdown</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stroke dark:border-dark-3">
                      <th className="pb-3 text-left text-sm font-medium text-dark-4">Campaign Name</th>
                      <th className="pb-3 text-center text-sm font-medium text-dark-4">Attributed Orders</th>
                      <th className="pb-3 text-right text-sm font-medium text-dark-4">Total Revenue (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.revenue_by_campaign?.length > 0 ? (
                      data.revenue_by_campaign.map((c: any, i: number) => (
                        <tr key={i} className="border-b border-stroke/50 dark:border-dark-3/50">
                          <td className="py-3 text-sm font-semibold text-dark dark:text-white">{c.campaign_name || "Direct / Organic"}</td>
                          <td className="py-3 text-center text-sm text-dark-4">{c.order_count}</td>
                          <td className="py-3 text-right text-sm font-bold text-green-600">₹{fmt(c.total_revenue)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-sm text-dark-4">
                          No campaign orders recorded yet. As customers click Meta Ads and place orders, live revenue will populate here automatically.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardGuard>
  );
}
