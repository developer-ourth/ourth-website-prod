"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { useState, useEffect } from "react";
import { ImageUpload } from "@/components/ui/image-upload";
import { getToken } from "@/lib/api";

export default function AdminWebsiteSettings() {
  const [settings, setSettings] = useState({
    website_home_banner_url: "",
    website_home_banner_title: "100% Compostable Areca Leaf Tableware",
    website_home_banner_subtitle: "Directly from nature to your table. Zero plastics, zero chemicals.",
    website_marketplace_banner_url: "",
    website_marketplace_tagline: "Explore Eco-Friendly Sustainable Products",
    website_campaign_banner_url: "",
    website_campaign_tagline: "🎁 Special Offer: Earn ₹5 Cashback per ₹100 spent!",
    website_announcement_bar_text: "🌱 Earn 5 Green Points (₹5 Cashback) per ₹100 spent on all orders!",
    website_announcement_bar_enabled: "true",
    website_primary_color: "#2B4D0E",
    website_accent_color: "#E8A33A",
    website_announcement_bg: "#25784C",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/website-settings`
          : "http://localhost:8000/api/v1/website-settings"
      );
      if (res.ok) {
        const data = await res.json();
        setSettings({
          website_home_banner_url: data.website_home_banner_url ?? "",
          website_home_banner_title: data.website_home_banner_title ?? "100% Compostable Areca Leaf Tableware",
          website_home_banner_subtitle: data.website_home_banner_subtitle ?? "Directly from nature to your table. Zero plastics, zero chemicals.",
          website_marketplace_banner_url: data.website_marketplace_banner_url ?? "",
          website_marketplace_tagline: data.website_marketplace_tagline ?? "Explore Eco-Friendly Sustainable Products",
          website_campaign_banner_url: data.website_campaign_banner_url ?? "",
          website_campaign_tagline: data.website_campaign_tagline ?? "🎁 Special Offer: Earn ₹5 Cashback per ₹100 spent!",
          website_announcement_bar_text: data.website_announcement_bar_text ?? "🌱 Earn 5 Green Points (₹5 Cashback) per ₹100 spent on all orders!",
          website_announcement_bar_enabled: data.website_announcement_bar_enabled ?? "true",
          website_primary_color: data.website_primary_color ?? "#2B4D0E",
          website_accent_color: data.website_accent_color ?? "#E8A33A",
          website_announcement_bg: data.website_announcement_bg ?? "#25784C",
        });
      }
    } catch (e) {
      console.error("Error fetching website settings:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const token = getToken();
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/admin/website-settings`
          : "http://localhost:8000/api/v1/admin/website-settings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(settings),
        }
      );

      if (!res.ok) throw new Error("Failed to save website settings");
      setMessage("Website settings updated successfully!");
    } catch (e) {
      console.error("Error saving website settings:", e);
      setMessage("Failed to save website settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-gray-700 font-semibold">Loading Website Settings...</div>;

  return (
    <DashboardGuard requiredRole="admin">
      <div className="p-8 max-w-4xl mx-auto font-['IBM_Plex_Sans']">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Website Customization Settings</h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage website hero banners, marketplace banners, promotional campaigns, and brand colors.
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-[8px] font-bold text-sm border ${
              message.includes("successfully")
                ? "bg-green-50 border-green-400 text-green-800"
                : "bg-red-50 border-red-400 text-red-800"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Section 1: Home Page Hero Banner */}
          <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-200 space-y-5">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-3">1. Home Page Hero Banner</h2>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Hero Banner Custom Image</label>
              <p className="text-xs text-gray-500 mb-3">Recommended size: 1920x600 px (Landscape WEBP/PNG/JPG)</p>
              <ImageUpload
                value={settings.website_home_banner_url}
                onChange={(url) => setSettings({ ...settings, website_home_banner_url: url })}
                aspectHint="1920x600 WEBP, PNG, JPG (max 3 MB)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Hero Main Title</label>
                <input
                  type="text"
                  value={settings.website_home_banner_title}
                  onChange={(e) => setSettings({ ...settings, website_home_banner_title: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm p-2.5 border text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Hero Subtitle</label>
                <input
                  type="text"
                  value={settings.website_home_banner_subtitle}
                  onChange={(e) => setSettings({ ...settings, website_home_banner_subtitle: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm p-2.5 border text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Marketplace Banner */}
          <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-200 space-y-5">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-3">2. Marketplace & Products Banner</h2>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Marketplace Banner Image</label>
              <p className="text-xs text-gray-500 mb-3">Recommended size: 1400x400 px</p>
              <ImageUpload
                value={settings.website_marketplace_banner_url}
                onChange={(url) => setSettings({ ...settings, website_marketplace_banner_url: url })}
                aspectHint="1400x400 WEBP, PNG, JPG (max 3 MB)"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Marketplace Promo Tagline</label>
              <input
                type="text"
                value={settings.website_marketplace_tagline}
                onChange={(e) => setSettings({ ...settings, website_marketplace_tagline: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm p-2.5 border text-sm"
              />
            </div>
          </div>

          {/* Section 3: Campaigns & Announcements */}
          <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-200 space-y-5">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-3">3. Active Campaigns & Announcement Bar</h2>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Campaign Offer Banner Image</label>
              <p className="text-xs text-gray-500 mb-3">Recommended size: 1200x350 px</p>
              <ImageUpload
                value={settings.website_campaign_banner_url}
                onChange={(url) => setSettings({ ...settings, website_campaign_banner_url: url })}
                aspectHint="1200x350 WEBP, PNG, JPG (max 3 MB)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Campaign Tagline</label>
                <input
                  type="text"
                  value={settings.website_campaign_tagline}
                  onChange={(e) => setSettings({ ...settings, website_campaign_tagline: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm p-2.5 border text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Top Announcement Bar Text</label>
                <input
                  type="text"
                  value={settings.website_announcement_bar_text}
                  onChange={(e) => setSettings({ ...settings, website_announcement_bar_text: e.target.value })}
                  className="w-full rounded-md border-gray-300 shadow-sm p-2.5 border text-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <input
                type="checkbox"
                id="announcement_toggle"
                checked={settings.website_announcement_bar_enabled === "true"}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    website_announcement_bar_enabled: e.target.checked ? "true" : "false",
                  })
                }
                className="w-4 h-4 accent-[#2B4D0E] cursor-pointer"
              />
              <label htmlFor="announcement_toggle" className="text-sm font-bold text-gray-800 cursor-pointer select-none">
                Enable Top Announcement Bar on Website
              </label>
            </div>
          </div>

          {/* Section 4: Brand Theme & Colors */}
          <div className="bg-white p-6 rounded-[12px] shadow-sm border border-gray-200 space-y-5">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-3">4. Website Theme & Brand Colors</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Primary Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={
                      settings.website_primary_color.startsWith("#")
                        ? settings.website_primary_color.slice(0, 7)
                        : "#2B4D0E"
                    }
                    onChange={(e) => setSettings({ ...settings, website_primary_color: e.target.value })}
                    className="w-12 h-10 p-0 border-0 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.website_primary_color}
                    onChange={(e) => setSettings({ ...settings, website_primary_color: e.target.value })}
                    className="flex-1 rounded-md border-gray-300 p-2 border text-sm"
                    placeholder="#2B4D0E"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Default: #2B4D0E (Forest Green)</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Accent / Button Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={
                      settings.website_accent_color.startsWith("#")
                        ? settings.website_accent_color.slice(0, 7)
                        : "#E8A33A"
                    }
                    onChange={(e) => setSettings({ ...settings, website_accent_color: e.target.value })}
                    className="w-12 h-10 p-0 border-0 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.website_accent_color}
                    onChange={(e) => setSettings({ ...settings, website_accent_color: e.target.value })}
                    className="flex-1 rounded-md border-gray-300 p-2 border text-sm"
                    placeholder="#E8A33A"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Default: #E8A33A (Warm Gold/Amber)</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Announcement Bar BG</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={
                      settings.website_announcement_bg.startsWith("#")
                        ? settings.website_announcement_bg.slice(0, 7)
                        : "#25784C"
                    }
                    onChange={(e) => setSettings({ ...settings, website_announcement_bg: e.target.value })}
                    className="w-12 h-10 p-0 border-0 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.website_announcement_bg}
                    onChange={(e) => setSettings({ ...settings, website_announcement_bg: e.target.value })}
                    className="flex-1 rounded-md border-gray-300 p-2 border text-sm"
                    placeholder="#25784C"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Default: #25784C (Leaf Green)</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#2B4D0E] hover:bg-[#203b0a] text-white text-lg font-bold rounded-[8px] py-3.5 shadow-md transition disabled:opacity-50"
          >
            {saving ? "Saving Website Settings..." : "Save Website Settings"}
          </button>
        </form>
      </div>
    </DashboardGuard>
  );
}
