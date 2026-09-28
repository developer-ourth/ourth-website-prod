"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { useAuth } from "@/contexts/auth-context";
import { sendWhatsAppBroadcastApi, importCsvLeadsApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ImageUpload } from "@/components/ui/image-upload";

export default function DedicatedMarketingDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Broadcast state
  const [recipientPhone, setRecipientPhone] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState(
    "🌱 Hi {name}, check out our 100% compostable Areca Leaf tableware! Direct from nature to your table. 🌿"
  );
  const [mediaType, setMediaType] = useState<"none" | "image" | "video">("none");
  const [mediaUrl, setMediaUrl] = useState("");
  const [ctaType, setCtaType] = useState<"none" | "shop_now" | "get_quote">("shop_now");
  const [sending, setSending] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; success: boolean } | null>(null);

  // CSV Bulk Upload state
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const handleAutoImportCsv = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("csv_file", file);
      const res = await importCsvLeadsApi(formData);
      if (res?.status === "success") {
        setStatusMsg({
          text: `📂 ${res.message || "CSV contacts ingested successfully!"} Ready for broadcast.`,
          success: true,
        });
      }
    } catch (e: any) {
      console.error("CSV Auto Import failed", e);
    }
  };

  // Stats state
  const [stats, setStats] = useState({
    totalBroadcasts: 1420,
    metaCapiEvents: 8940,
    leadsCaptured: 348,
    conversionRate: "4.8%",
  });

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const insertVariable = (variable: string) => {
    setBroadcastMessage((prev) => prev + " " + variable);
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatusMsg(null);

    try {
      const res = await sendWhatsAppBroadcastApi({
        recipient_phone: recipientPhone || undefined,
        message: broadcastMessage,
        media_type: mediaType,
        media_url: mediaUrl || undefined,
        cta_type: ctaType,
      });

      setStatusMsg({
        text: res.message || "WhatsApp broadcast launched successfully!",
        success: true,
      });

      if (res.sent_count) {
        setStats((prev) => ({
          ...prev,
          totalBroadcasts: prev.totalBroadcasts + res.sent_count,
        }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to dispatch WhatsApp broadcast";
      setStatusMsg({ text: msg, success: false });
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

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-[14px] border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">WhatsApp Sent</p>
              <h3 className="text-2xl font-black text-[#0D3A27] mt-1">{stats.totalBroadcasts}</h3>
              <p className="text-[11px] text-green-600 font-semibold mt-0.5">↑ 12% vs last week</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-2xl">
              💬
            </div>
          </div>

          <div className="bg-white p-5 rounded-[14px] border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Meta CAPI Events</p>
              <h3 className="text-2xl font-black text-[#0D3A27] mt-1">{stats.metaCapiEvents}</h3>
              <p className="text-[11px] text-blue-600 font-semibold mt-0.5">Real-time Pixel Sync</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-2xl">
              🎯
            </div>
          </div>

          <div className="bg-white p-5 rounded-[14px] border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Meta Leads Captured</p>
              <h3 className="text-2xl font-black text-[#0D3A27] mt-1">{stats.leadsCaptured}</h3>
              <p className="text-[11px] text-purple-600 font-semibold mt-0.5">CTWA & Lead Ads</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-2xl">
              📥
            </div>
          </div>

          <div className="bg-white p-5 rounded-[14px] border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Campaign Conv. Rate</p>
              <h3 className="text-2xl font-black text-[#0D3A27] mt-1">{stats.conversionRate}</h3>
              <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Attributed Sales</p>
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
                      onClick={() => { setRecipientPhone(""); }}
                      className={`p-3 text-xs font-bold rounded-xl border text-left transition ${
                        !recipientPhone && !csvFile
                          ? "bg-[#0D3A27] text-white border-[#0D3A27]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-bold">📢 All CRM Leads</div>
                      <div className="text-[10px] font-normal opacity-80 mt-0.5">Broadcast to all database contacts</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { document.getElementById("marketing_csv_input")?.click(); }}
                      className={`p-3 text-xs font-bold rounded-xl border text-left transition ${
                        csvFile
                          ? "bg-[#0D3A27] text-white border-[#0D3A27]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-bold">📂 Bulk CSV Upload</div>
                      <div className="text-[10px] font-normal opacity-80 mt-0.5">
                        {csvFile ? `Selected: ${csvFile.name}` : "Upload phone list CSV"}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setCsvFile(null); }}
                      className={`p-3 text-xs font-bold rounded-xl border text-left transition ${
                        recipientPhone && !csvFile
                          ? "bg-[#0D3A27] text-white border-[#0D3A27]"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="font-bold">📱 Single Number</div>
                      <div className="text-[10px] font-normal opacity-80 mt-0.5">Enter individual recipient phone</div>
                    </button>
                  </div>

                  {/* Hidden CSV Input & File Status */}
                  <input
                    id="marketing_csv_input"
                    type="file"
                    accept=".csv,text/csv,application/vnd.ms-excel"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCsvFile(file);
                        setRecipientPhone("");
                        handleAutoImportCsv(file);
                      }
                    }}
                    className="hidden"
                  />

                  {csvFile && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-900 font-semibold mb-3">
                      <span>📄 Loaded CSV: {csvFile.name} (Ready for Broadcast)</span>
                      <button
                        type="button"
                        onClick={() => setCsvFile(null)}
                        className="text-red-600 hover:underline font-bold text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {!csvFile && (
                    <div>
                      <input
                        type="text"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        placeholder="Leave empty for ALL leads, or enter phone (e.g. 918700209752)"
                        className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-[#2B4D0E] outline-none"
                      />
                      <p className="text-[11px] text-gray-500 mt-1">
                        Format: Country code + 10 digit number (e.g. 918700209752)
                      </p>
                    </div>
                  )}
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
                  {sending ? "Sending WhatsApp Broadcast..." : "🚀 Launch WhatsApp Broadcast Now"}
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
                <span>🎯</span> Campaign Channel Breakdown
              </h3>

              <div className="space-y-3 text-sm">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Meta Click-to-WhatsApp (CTWA)</span>
                    <span className="text-green-700">45%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-[45%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Google Search & Places B2B</span>
                    <span className="text-blue-700">32%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-[32%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Direct Website Orders</span>
                    <span className="text-amber-700">23%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full w-[23%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardGuard>
  );
}
