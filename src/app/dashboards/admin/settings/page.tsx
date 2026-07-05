"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { useState, useEffect } from "react";
import { ImageUpload } from "@/components/ui/image-upload";
import { getToken } from "@/lib/api";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    app_background_color: "#FAF8F3",
    header_background_color: "#0d3a27",
    app_text_color: "#2C1F13",
    banner_tagline: "Healing OURTH Tableware",
    banner_subtagline: "100% Organic, Natural & Compostable",
    banner_image_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Use full URL to bypass API proxy if needed, or rely on existing setup.
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/app-settings` : "http://localhost:8000/api/v1/app-settings");
      if (res.ok) {
        const data = await res.json();
        setSettings({
          app_background_color: data.app_background_color ?? "#FAF8F3",
          header_background_color: data.header_background_color ?? "#0d3a27",
          app_text_color: data.app_text_color ?? "#2C1F13",
          banner_tagline: data.banner_tagline ?? "",
          banner_subtagline: data.banner_subtagline ?? "",
          banner_image_url: data.banner_image_url ?? "",
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      // Need bearer token for admin routes usually, but if the web app uses cookies we might just rely on that.
      const token = getToken(); // Assuming standard token storage
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/admin/app-settings` : "http://localhost:8000/api/v1/admin/app-settings", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(settings)
      });
      
      if (!res.ok) throw new Error("Failed to save");
      setMessage("Settings saved successfully!");
    } catch (e) {
      console.error(e);
      setMessage("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <DashboardGuard requiredRole="admin">
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">App Theme Settings</h1>
        
        {message && (
          <div className="mb-4 p-4 rounded bg-blue-50 text-blue-800">
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 bg-white p-6 rounded shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700">App Background Color</label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="color"
                value={settings.app_background_color.startsWith('#') ? settings.app_background_color.slice(0, 7) : "#ffffff"}
                onChange={e => setSettings({...settings, app_background_color: e.target.value})}
                className="w-12 h-10 p-0 border-0 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.app_background_color}
                onChange={e => setSettings({...settings, app_background_color: e.target.value})}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                placeholder="#HexCode"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Default: #FAF8F3 (Cream)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Header & Banner Color</label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="color"
                value={settings.header_background_color.startsWith('#') ? settings.header_background_color.slice(0, 7) : "#ffffff"}
                onChange={e => setSettings({...settings, header_background_color: e.target.value})}
                className="w-12 h-10 p-0 border-0 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.header_background_color}
                onChange={e => setSettings({...settings, header_background_color: e.target.value})}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                placeholder="#HexCode"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Default: #0d3a27 (Frosted Green). Will apply opacity in-app.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">App Text Color</label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="color"
                value={settings.app_text_color.startsWith('#') ? settings.app_text_color.slice(0, 7) : "#000000"}
                onChange={e => setSettings({...settings, app_text_color: e.target.value})}
                className="w-12 h-10 p-0 border-0 rounded cursor-pointer"
              />
              <input
                type="text"
                value={settings.app_text_color}
                onChange={e => setSettings({...settings, app_text_color: e.target.value})}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                placeholder="#HexCode"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Default: #2C1F13 (Dark Coffee/Charcoal)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Custom Image</label>
            <p className="text-xs text-gray-500 mb-2">Recommended dimension: 1000x420 (approx. 2.5:1 aspect ratio landscape)</p>
            <ImageUpload
              value={settings.banner_image_url}
              onChange={(url) => setSettings({ ...settings, banner_image_url: url })}
              aspectHint="1000x420 PNG, JPG, WEBP (max 2 MB)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Banner Tagline</label>
            <input
              type="text"
              value={settings.banner_tagline}
              onChange={e => setSettings({...settings, banner_tagline: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Banner Sub-tagline</label>
            <input
              type="text"
              value={settings.banner_subtagline}
              onChange={e => setSettings({...settings, banner_subtagline: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-green-600 text-white rounded py-2 px-4 hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </div>
    </DashboardGuard>
  );
}
