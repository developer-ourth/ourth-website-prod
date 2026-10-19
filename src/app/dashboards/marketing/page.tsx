"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { useAuth } from "@/contexts/auth-context";
import { sendWhatsAppBroadcastApi, importCsvLeadsApi, getMarketingAttributionApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ImageUpload } from "@/components/ui/image-upload";

export default function DedicatedMarketingDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Broadcast state
  const [audienceMode, setAudienceMode] = useState<"segment" | "single">("segment");
  const [segment, setSegment] = useState<"all" | "b2b" | "b2c" | "abandoned_cart">("all");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [templateName, setTemplateName] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState(
    "🌱 Hi {name}, check out our 100% compostable Areca Leaf tableware! Direct from nature to your table. 🌿"
  );
  const [mediaType, setMediaType] = useState<"none" | "image" | "video">("none");
  const [mediaUrl, setMediaUrl] = useState("");
  const [ctaType, setCtaType] = useState<"none" | "shop_now" | "get_quote">("shop_now");
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; success: boolean } | null>(null);

  // CSV import state
  const [importingCsv, setImportingCsv] = useState(false);

  const handleImportCsv = async (file: File) => {
    setImportingCsv(true);
    setStatusMsg(null);
    try {
      const formData = new FormData();
      formData.append("csv_file", file);
      const res = await importCsvLeadsApi(formData);
      setStatusMsg({
        text: `📂 ${res.message} Imported contacts are now in the CRM and in their segment's audience.`,
        success: true,
      });
      loadStats();
    } catch (e: any) {
      setStatusMsg({ text: e?.message || "CSV import failed.", success: false });
    } finally {
      setImportingCsv(false);
    }
  };

  // Live stats from the backend
  const [stats, setStats] = useState<any>(null);

  const loadStats = async () => {
    try {
      const res = await getMarketingAttributionApi();
      if (res?.status === "success") setStats(res.data);
    } catch (e) {
      console.error("Failed to load marketing stats", e);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const fmt = (n: unknown) => (n != null ? Number(n).toLocaleString("en-IN") : "—");

  const SOURCE_LABELS: Record<string, string> = {
    meta_lead_ad: "Meta Lead Ads",
    whatsapp_ctwa: "Click-to-WhatsApp Ads",
    whatsapp_inbound: "WhatsApp (direct)",
    google_places_lead: "Google Places B2B",
    csv_bulk_import: "CSV Imports",
  };
  const leadsBySource: Record<string, number> = stats?.leads_by_source ?? {};
  const totalBySource = Object.values(leadsBySource).reduce((sum, n) => sum + Number(n), 0);

  const SEGMENT_LABELS: Record<typeof segment, string> = {
    all: "all contacts",
    b2b: "B2B wholesale leads",
    b2c: "retail customers",
    abandoned_cart: "customers with an abandoned cart (last 7 days)",
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const insertVariable = (variable: string) => {
    setBroadcastMessage((prev) => prev + " " + variable);
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();

    const single = audienceMode === "single";
    if (single && !recipientPhone.trim()) {
      setStatusMsg({ text: "Enter the recipient's phone number.", success: false });
      return;
    }
    if (!single && !window.confirm(`Send this WhatsApp message to ${SEGMENT_LABELS[segment]}?`)) {
      return;
    }

    setSending(true);
    setStatusMsg(null);

    try {
      const res = await sendWhatsAppBroadcastApi({
        recipient_phone: single ? recipientPhone : undefined,
        segment: single ? undefined : segment,
        message: broadcastMessage,
        media_type: mediaType,
        media_url: mediaUrl || undefined,
        cta_type: ctaType,
        template_name: templateName.trim() || undefined,
      });

      setStatusMsg({
        text: res.message || "WhatsApp broadcast queued.",
        success: true,
      });
    } catch (err: any) {
      setStatusMsg({ text: err?.message || "Failed to dispatch WhatsApp broadcast", success: false });
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardGuard requiredRole={["marketing", "admin"]}>
      <div className="min-h-screen bg-[#FAF8F3] p-4 md:p-8 font-['IBM_Plex_Sans'] text-[#2C1F13]">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-[16px] border border-[#E5E0D8] shadow-sm">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-3xl">📣</span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0D3A27]">
                Marketing & Growth Command Center
              </h1>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              WhatsApp Broadcast Studio, Meta Conversions API (CAPI), and Real-Time Lead Attribution
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboards/admin/website-settings"
              className="px-4 py-2 bg-[#2B4D0E]/10 text-[#2B4D0E] font-bold rounded-lg text-sm hover:bg-[#2B4D0E]/20 transition"
            >
              ⚙️ Meta API Settings
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Key Performance Indicators (live) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-[14px] border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Leads This Month</p>
              <h3 className="text-2xl font-black text-[#0D3A27] mt-1">{fmt(stats?.leads_this_month)}</h3>
              <p className="text-[11px] text-green-600 font-semibold mt-0.5">{fmt(stats?.total_leads)} leads all time</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-2xl">
              📥
            </div>
          </div>

          <div className="bg-white p-5 rounded-[14px] border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Paid Orders This Month</p>
              <h3 className="text-2xl font-black text-[#0D3A27] mt-1">{fmt(stats?.paid_orders_this_month)}</h3>
              <p className="text-[11px] text-blue-600 font-semibold mt-0.5">Website & app checkout</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-2xl">
              🛒
            </div>
          </div>

          <div className="bg-white p-5 rounded-[14px] border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ad &amp; Lead Touchpoints</p>
              <h3 className="text-2xl font-black text-[#0D3A27] mt-1">{fmt(stats?.total_touchpoints)}</h3>
              <p className="text-[11px] text-purple-600 font-semibold mt-0.5">Lead forms, CTWA, imports</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-2xl">
              🎯
            </div>
          </div>

          <div className="bg-white p-5 rounded-[14px] border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Purchases Sent to Meta</p>
              <h3 className="text-2xl font-black text-[#0D3A27] mt-1">{fmt(stats?.total_capi_synced)}</h3>
              <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Conversions API (CAPI)</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-2xl">
              📈
            </div>
          </div>
        </div>

        {/* Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Broadcast Studio (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-[16px] border border-gray-200 shadow-sm space-y-6">
              <div className="border-b pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span>🚀</span> WhatsApp Rich Media & Interactive CTA Studio
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Send high-converting WhatsApp broadcasts with 10-15s videos, static images, and CTA buttons.
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                  Meta Cloud API Active
                </span>
              </div>

              {statusMsg && (
                <div
                  className={`p-4 rounded-xl text-sm font-semibold border ${
                    statusMsg.success
                      ? "bg-green-50 border-green-300 text-green-800"
                      : "bg-red-50 border-red-300 text-red-800"
                  }`}
                >
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={handleSendBroadcast} className="space-y-6">
                {/* Target Audience Mode Selector */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Target Audience / Broadcast Mode
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => setAudienceMode("segment")}
                      className={`p-3 text-xs font-bold rounded-xl border text-left transition ${
                        audienceMode === "segment"
                          ? "bg-[#0D3A27] text-white border-[#0D3A27]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-bold">📢 Audience Segment</div>
                      <div className="text-[10px] font-normal opacity-80 mt-0.5">All, B2B, retail or abandoned carts</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAudienceMode("single")}
                      className={`p-3 text-xs font-bold rounded-xl border text-left transition ${
                        audienceMode === "single"
                          ? "bg-[#0D3A27] text-white border-[#0D3A27]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-bold">📱 Single Number</div>
                      <div className="text-[10px] font-normal opacity-80 mt-0.5">Test or send to one person</div>
                    </button>

                    <button
                      type="button"
                      disabled={importingCsv}
                      onClick={() => document.getElementById("marketing_csv_input")?.click()}
                      className="p-3 text-xs font-bold rounded-xl border text-left transition bg-gray-50 text-gray-700 border-dashed border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <div className="font-bold">📂 {importingCsv ? "Importing…" : "Import CSV Contacts"}</div>
                      <div className="text-[10px] font-normal opacity-80 mt-0.5">Name, Phone, City, Segment → added to CRM</div>
                    </button>
                  </div>

                  <input
                    id="marketing_csv_input"
                    type="file"
                    accept=".csv,text/csv,application/vnd.ms-excel"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImportCsv(file);
                      e.target.value = "";
                    }}
                    className="hidden"
                  />

                  {audienceMode === "segment" ? (
                    <select
                      value={segment}
                      onChange={(e) => setSegment(e.target.value as typeof segment)}
                      className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2B4D0E] outline-none bg-white"
                    >
                      <option value="all">All contacts with a phone number</option>
                      <option value="b2b">B2B wholesale leads</option>
                      <option value="b2c">Retail customers</option>
                      <option value="abandoned_cart">Abandoned cart (last 7 days, not purchased)</option>
                    </select>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        placeholder="Phone number, e.g. 8700209752 or +91 87002 09752"
                        className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2B4D0E] outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Approved template (needed outside WhatsApp's 24-hour window) */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Approved Template Name <span className="font-normal text-gray-500">(recommended)</span>
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"))}
                    placeholder="e.g. diwali_offer_2026"
                    className="w-full p-3 rounded-xl border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-[#2B4D0E] outline-none"
                  />
                  <p className="text-[11px] text-gray-500 mt-1">
                    WhatsApp only delivers free-form messages to people who messaged you in the last 24 hours. For everyone
                    else, enter a template approved in WhatsApp Manager ({`{{1}}`} is filled with the contact&apos;s name).
                    When a template is set, the message, media and button below are not used.
                  </p>
                </div>

                {/* Message Body & Dynamic Tags */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-bold text-gray-700">Message Content</label>
                    <div className="flex items-center space-x-1.5 text-xs">
                      <span className="text-gray-500">Insert tag:</span>
                      <button
                        type="button"
                        onClick={() => insertVariable("{name}")}
                        className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-mono font-semibold"
                      >
                        {`{name}`}
                      </button>
                      <button
                        type="button"
                        onClick={() => insertVariable("{business_name}")}
                        className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded font-mono font-semibold"
                      >
                        {`{business_name}`}
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2B4D0E] outline-none"
                    required
                  />
                </div>

                {/* Media Attachment Selector */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Media Attachment Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setMediaType("none")}
                      className={`p-3 text-xs font-bold rounded-xl border transition ${
                        mediaType === "none"
                          ? "bg-[#2B4D0E] text-white border-[#2B4D0E]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      📄 Text Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType("image")}
                      className={`p-3 text-xs font-bold rounded-xl border transition ${
                        mediaType === "image"
                          ? "bg-[#2B4D0E] text-white border-[#2B4D0E]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      🖼️ Static Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaType("video")}
                      className={`p-3 text-xs font-bold rounded-xl border transition ${
                        mediaType === "video"
                          ? "bg-[#2B4D0E] text-white border-[#2B4D0E]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      📹 Video (10-15s)
                    </button>
                  </div>

                  {mediaType !== "none" && (
                    <div className="mt-4 space-y-3">
                      <label className="block text-xs font-bold text-gray-700">
                        Upload {mediaType === 'video' ? 'Video (MP4 / MOV / WEBM)' : 'Image (PNG / JPG / WEBP)'}
                      </label>
                      <ImageUpload
                        value={mediaUrl}
                        onChange={(url) => setMediaUrl(url)}
                        aspectHint={mediaType === 'video' ? "MP4, MOV, WEBM (max 10 MB)" : "PNG, JPG, WEBP (max 5 MB)"}
                      />
                      <div className="relative flex items-center my-2">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          Or enter direct URL below
                        </span>
                        <div className="flex-grow border-t border-gray-200"></div>
                      </div>
                      <input
                        type="url"
                        value={mediaUrl}
                        onChange={(e) => setMediaUrl(e.target.value)}
                        placeholder={`Enter direct ${mediaType} URL (e.g. https://www.healingourth.com/promo.${mediaType === 'video' ? 'mp4' : 'jpg'})`}
                        className="w-full p-3 rounded-xl border border-gray-300 text-sm font-mono focus:ring-2 focus:ring-[#2B4D0E] outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Interactive Call to Action (CTA) Button Selector */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Interactive CTA Button
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setCtaType("none")}
                      className={`p-3 text-xs font-bold rounded-xl border transition ${
                        ctaType === "none"
                          ? "bg-[#0D3A27] text-white border-[#0D3A27]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      🚫 No Button
                    </button>
                    <button
                      type="button"
                      onClick={() => setCtaType("shop_now")}
                      className={`p-3 text-xs font-bold rounded-xl border transition ${
                        ctaType === "shop_now"
                          ? "bg-[#0D3A27] text-white border-[#0D3A27]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      🛒 Shop Now Button
                    </button>
                    <button
                      type="button"
                      onClick={() => setCtaType("get_quote")}
                      className={`p-3 text-xs font-bold rounded-xl border transition ${
                        ctaType === "get_quote"
                          ? "bg-[#0D3A27] text-white border-[#0D3A27]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      📞 Get Quote Button
                    </button>
                  </div>
                </div>

                {/* Dispatch Button */}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 bg-[#2B4D0E] hover:bg-[#203b0a] text-white font-extrabold text-base rounded-xl shadow-md transition disabled:opacity-50"
                >
                  {sending ? "Queuing WhatsApp Broadcast..." : "🚀 Launch WhatsApp Broadcast Now"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Quick Shortcuts & Live Activity (1 col) */}
          <div className="space-y-6">
            {/* Quick Navigation Card */}
            <div className="bg-white p-6 rounded-[16px] border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
                <span>⚡</span> Growth Hub Shortcuts
              </h3>

              <div className="space-y-3">
                {stats?.crm_url && (
                  <a
                    href={`${stats.crm_url}/admin/leads`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3.5 bg-gradient-to-r from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 border border-sky-200 rounded-xl transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-sky-900">🗂️ Open Sales CRM (Krayin)</h4>
                        <p className="text-xs text-gray-600">Pipeline, follow-ups, notes & quotes</p>
                      </div>
                      <span className="text-lg">↗</span>
                    </div>
                  </a>
                )}

                {stats?.inbox_url && (
                  <a
                    href={stats.inbox_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3.5 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 rounded-xl transition"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-green-900">💬 Open WhatsApp Inbox (Chatwoot)</h4>
                        <p className="text-xs text-gray-600">Reply to customer chats as a team</p>
                      </div>
                      <span className="text-lg">↗</span>
                    </div>
                  </a>
                )}

                <Link
                  href="/dashboards/sales"
                  className="block p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border border-emerald-200 rounded-xl transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#0D3A27]">🔍 B2B Sales & Leads CRM</h4>
                      <p className="text-xs text-gray-600">Discover Google Places leads & import CSV</p>
                    </div>
                    <span className="text-lg">→</span>
                  </div>
                </Link>

                <Link
                  href="/dashboards/admin/marketing-attribution"
                  className="block p-3.5 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200 rounded-xl transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-purple-900">📊 Marketing Attribution</h4>
                      <p className="text-xs text-gray-600">Track UTM campaigns & Meta CAPI logs</p>
                    </div>
                    <span className="text-lg">→</span>
                  </div>
                </Link>

                <Link
                  href="/dashboards/admin/website-settings"
                  className="block p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 rounded-xl transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-amber-900">⚙️ Meta Credentials & Setup</h4>
                      <p className="text-xs text-gray-600">Configure Access Token, Pixel & Phone ID</p>
                    </div>
                    <span className="text-lg">→</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Campaign Channel Performance */}
            <div className="bg-white p-6 rounded-[16px] border border-gray-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b pb-3 flex items-center gap-2">
                <span>🎯</span> Leads by Channel
              </h3>

              <div className="space-y-3 text-sm">
                {totalBySource === 0 ? (
                  <p className="text-xs text-gray-500">
                    No leads yet. Lead forms, WhatsApp ad clicks, CSV imports and Google Places leads will appear here.
                  </p>
                ) : (
                  Object.entries(leadsBySource)
                    .sort(([, a], [, b]) => Number(b) - Number(a))
                    .map(([source, count]) => {
                      const pct = Math.round((Number(count) / totalBySource) * 100);
                      return (
                        <div key={source}>
                          <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                            <span>{SOURCE_LABELS[source] ?? source}</span>
                            <span className="text-[#0D3A27]">
                              {fmt(count)} · {pct}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className="bg-[#2B4D0E] h-2 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardGuard>
  );
}
