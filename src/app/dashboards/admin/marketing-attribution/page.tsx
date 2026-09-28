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
  const [mediaType, setMediaType] = useState("none");
  const [mediaUrl, setMediaUrl] = useState("");
  const [ctaType, setCtaType] = useState("none");
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

  const handleInsertTag = (tag: string) => {
    setBroadcastMessage((prev) => prev + " " + tag);
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setSendingBroadcast(true);
    setBroadcastAlert(null);

    try {
      const res = await sendWhatsAppBroadcastApi({
        segment,
        message: broadcastMessage,
        media_type: mediaType,
        media_url: mediaUrl,
        cta_type: ctaType,
      });

      if (res?.status === "success") {
        setBroadcastAlert({ type: "success", text: res.message });
        setBroadcastMessage("");
        setMediaUrl("");
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
              Track Meta Ad ROAS, CAPI Event Match Quality, and 1-Click Rich Media WhatsApp Broadcasts
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
              <h2 className="mb-2 text-lg font-bold text-dark dark:text-white">📲 Rich Media WhatsApp Broadcast Controller</h2>
              <p className="mb-4 text-xs text-dark-4 dark:text-dark-6">
                Send targeted promotional WhatsApp campaigns with 10-15s promo videos, static image banners, and interactive CTA buttons via Meta Cloud API.
              </p>

              {broadcastAlert && (
                <div className={`mb-4 rounded-lg p-3 text-sm font-medium ${broadcastAlert.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {broadcastAlert.text}
                </div>
              )}

              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <label className="mb-1 block text-sm font-semibold text-dark dark:text-white">Media Attachment</label>
                    <select
                      value={mediaType}
                      onChange={(e) => setMediaType(e.target.value)}
                      className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm text-dark dark:border-dark-3 dark:text-white"
                    >
                      <option value="none">Text Only (Standard)</option>
                      <option value="image">🖼️ Static Banner Image</option>
                      <option value="video">🎥 10-15s Promo Video</option>
                    </select>
                  </div>
                </div>

                {mediaType !== "none" && (
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-dark dark:text-white">
                      {mediaType === "video" ? "Promo Video URL (10-15s MP4)" : "Image Banner URL"}
                    </label>
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      placeholder={mediaType === "video" ? "https://www.healingourth.com/promo-15s.mp4" : "https://www.healingourth.com/banner.jpg"}
                      className="w-full rounded-lg border border-stroke bg-transparent p-2.5 text-sm text-dark dark:border-dark-3 dark:text-white"
                      required
                    />

                    {mediaUrl && (
                      <div className="mt-2 rounded-lg border border-stroke/50 bg-gray-2 p-2 dark:bg-dark-2">
                        <span className="mb-1 block text-[10px] uppercase font-bold text-dark-4">Media Preview:</span>
                        {mediaType === "image" ? (
                          <img src={mediaUrl} alt="Preview" className="h-32 object-contain rounded border" />
                        ) : (
                          <video src={mediaUrl} controls className="h-32 rounded border" />
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-semibold text-dark dark:text-white">Broadcast Message</label>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-dark-4">Insert Variable:</span>
                      <button type="button" onClick={() => handleInsertTag("{name}")} className="rounded bg-gray-2 px-2 py-0.5 font-mono text-xs hover:bg-gray-3 dark:bg-dark-2 dark:hover:bg-dark-3">
                        {"{name}"}
                      </button>
                      <button type="button" onClick={() => handleInsertTag("{business_name}")} className="rounded bg-gray-2 px-2 py-0.5 font-mono text-xs hover:bg-gray-3 dark:bg-dark-2 dark:hover:bg-dark-3">
                        {"{business_name}"}
                      </button>
                      <button type="button" onClick={() => handleInsertTag("{phone}")} className="rounded bg-gray-2 px-2 py-0.5 font-mono text-xs hover:bg-gray-3 dark:bg-dark-2 dark:hover:bg-dark-3">
                        {"{phone}"}
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    placeholder="Hi {name}! 🌿 Enjoy 10% OFF on 100% natural Areca Leaf Tableware. Use code GREEN10 at https://www.healingourth.com/cart"
                    className="w-full rounded-lg border border-stroke bg-transparent p-3 text-sm text-dark dark:border-dark-3 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-dark dark:text-white">Interactive Call-To-Action (CTA) Button</label>
                  <select
                    value={ctaType}
                    onChange={(e) => setCtaType(e.target.value)}
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm text-dark dark:border-dark-3 dark:text-white"
                  >
                    <option value="none">No Button (Standard Text Link)</option>
                    <option value="shop_now">🛒 "Shop Now" Button (Redirects to https://www.healingourth.com/products)</option>
                    <option value="get_quote">📞 "Get Quote / Call Us" Button (Direct Sales Call)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={sendingBroadcast}
                  className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                >
                  {sendingBroadcast ? "Sending Rich Media Broadcast..." : "🚀 Dispatch WhatsApp Broadcast"}
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
