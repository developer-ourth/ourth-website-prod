"use client";

import { DashboardGuard } from "@/components/ui/dashboard-guard";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ConfigData {
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroTitleLine3: string;
  heroDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  contactEmail: string;
  footerTagline: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  showNaturesAnswer: boolean;
  showBuiltForVendors: boolean;
  showProducts: boolean;
}

export default function DeveloperDashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/website-config")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setConfig(data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleChange = (key: keyof ConfigData, value: string | boolean) => {
    if (config) {
      setConfig({ ...config, [key]: value });
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/website-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "🚀 Website design & content changes published successfully!" });
      } else {
        setMessage({ type: "error", text: "❌ Failed to publish changes." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "❌ Connection error. Failed to save configuration." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardGuard requiredRole="developer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">💻 Developer Dashboard & Website Customizer</h1>
            <p className="text-sm text-dark-4 dark:text-dark-6">
              Full redesign control: colors, layout sections, typography, and website copy
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="/" 
              target="_blank" 
              className="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/5"
            >
              View Website
            </a>
            <button 
              onClick={handleLogout} 
              className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white dark:hover:bg-gray-dark"
            >
              Sign Out
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Editor form (span 2) */}
            <div className="lg:col-span-2">
              <form onSubmit={handlePublish} className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark space-y-6">
                <h2 className="text-lg font-bold text-dark dark:text-white border-b border-stroke pb-3 dark:border-dark-3">
                  Website Customizer & Content Editor
                </h2>

                {message && (
                  <div className={`rounded-lg px-4 py-3 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
                    {message.text}
                  </div>
                )}

                {config && (
                  <div className="space-y-6">
                    {/* Design Customizer (Colors) */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Design & Color Customizer</h3>
                      
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div>
                          <label className="mb-2 block text-xs font-semibold text-dark dark:text-white">Primary Brand Color</label>
                          <div className="flex gap-2 items-center">
                            <input 
                              type="color"
                              value={config.primaryColor}
                              onChange={(e) => handleChange("primaryColor", e.target.value)}
                              className="h-9 w-9 cursor-pointer rounded border border-stroke outline-none"
                            />
                            <span className="text-xs font-mono">{config.primaryColor}</span>
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-semibold text-dark dark:text-white">Secondary Accent Color</label>
                          <div className="flex gap-2 items-center">
                            <input 
                              type="color"
                              value={config.secondaryColor}
                              onChange={(e) => handleChange("secondaryColor", e.target.value)}
                              className="h-9 w-9 cursor-pointer rounded border border-stroke outline-none"
                            />
                            <span className="text-xs font-mono">{config.secondaryColor}</span>
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-semibold text-dark dark:text-white">Background Color</label>
                          <div className="flex gap-2 items-center">
                            <input 
                              type="color"
                              value={config.backgroundColor}
                              onChange={(e) => handleChange("backgroundColor", e.target.value)}
                              className="h-9 w-9 cursor-pointer rounded border border-stroke outline-none"
                            />
                            <span className="text-xs font-mono">{config.backgroundColor}</span>
                          </div>
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-semibold text-dark dark:text-white">Global Text Color</label>
                          <div className="flex gap-2 items-center">
                            <input 
                              type="color"
                              value={config.textColor}
                              onChange={(e) => handleChange("textColor", e.target.value)}
                              className="h-9 w-9 cursor-pointer rounded border border-stroke outline-none"
                            />
                            <span className="text-xs font-mono">{config.textColor}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-stroke my-4 dark:border-dark-3" />

                    {/* Layout Controls (Toggles) */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Layout & Section Visibility</h3>
                      
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={config.showNaturesAnswer}
                            onChange={(e) => handleChange("showNaturesAnswer", e.target.checked)}
                            className="h-4 w-4 rounded border-stroke text-[#0D3A27] focus:ring-[#0D3A27]"
                          />
                          <span className="text-sm font-medium text-dark dark:text-white">Show "Nature's Answer" Section</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={config.showBuiltForVendors}
                            onChange={(e) => handleChange("showBuiltForVendors", e.target.checked)}
                            className="h-4 w-4 rounded border-stroke text-[#0D3A27] focus:ring-[#0D3A27]"
                          />
                          <span className="text-sm font-medium text-dark dark:text-white">Show "Built For Vendors" Section</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={config.showProducts}
                            onChange={(e) => handleChange("showProducts", e.target.checked)}
                            className="h-4 w-4 rounded border-stroke text-[#0D3A27] focus:ring-[#0D3A27]"
                          />
                          <span className="text-sm font-medium text-dark dark:text-white">Show "Products" Section</span>
                        </label>
                      </div>
                    </div>

                    <div className="border-t border-stroke my-4 dark:border-dark-3" />

                    {/* Hero Section */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Hero Banner Text</h3>
                      
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <label className="mb-2 block text-xs font-semibold text-dark dark:text-white">Title Line 1</label>
                          <input 
                            type="text"
                            value={config.heroTitleLine1}
                            onChange={(e) => handleChange("heroTitleLine1", e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-semibold text-dark dark:text-white">Title Line 2</label>
                          <input 
                            type="text"
                            value={config.heroTitleLine2}
                            onChange={(e) => handleChange("heroTitleLine2", e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-semibold text-dark dark:text-white">Title Line 3</label>
                          <input 
                            type="text"
                            value={config.heroTitleLine3}
                            onChange={(e) => handleChange("heroTitleLine3", e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold text-dark dark:text-white">Hero Description</label>
                        <textarea 
                          rows={3}
                          value={config.heroDescription}
                          onChange={(e) => handleChange("heroDescription", e.target.value)}
                          className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="border-t border-stroke my-4 dark:border-dark-3" />

                    {/* About Section */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">About Slogan & Description</h3>
                      
                      <div>
                        <label className="mb-2 block text-xs font-semibold text-dark dark:text-white">About Headline</label>
                        <input 
                          type="text"
                          value={config.aboutTitle}
                          onChange={(e) => handleChange("aboutTitle", e.target.value)}
                          className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold text-dark dark:text-white">About Body Text</label>
                        <textarea 
                          rows={3}
                          value={config.aboutDescription}
                          onChange={(e) => handleChange("aboutDescription", e.target.value)}
                          className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="border-t border-stroke my-4 dark:border-dark-3" />

                    {/* Footer & Contacts */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Footer Slogan & Contacts</h3>
                      
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-xs font-semibold text-dark dark:text-white">Contact Email</label>
                          <input 
                            type="email"
                            value={config.contactEmail}
                            onChange={(e) => handleChange("contactEmail", e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-xs font-semibold text-dark dark:text-white">Footer Tagline</label>
                          <input 
                            type="text"
                            value={config.footerTagline}
                            onChange={(e) => handleChange("footerTagline", e.target.value)}
                            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="rounded-lg bg-[#0D3A27] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                  >
                    {saving ? "Publishing Redesign..." : "Publish Redesign & Content"}
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar info (span 1) */}
            <div className="space-y-6">
              <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
                <h3 className="text-lg font-bold text-dark dark:text-white border-b border-stroke pb-3 dark:border-dark-3 mb-4">
                  Website Customization Instructions
                </h3>
                <div className="space-y-4 text-sm leading-relaxed text-dark-4 dark:text-dark-6">
                  <div>
                    <strong className="text-emerald-700 dark:text-emerald-400 block mb-1">🎨 Design Colors</strong>
                    Use the color pickers to edit colors in real-time. Changing colors updates elements across the homepage and about page seamlessly.
                  </div>
                  <div>
                    <strong className="text-emerald-700 dark:text-emerald-400 block mb-1">👁️ Layout Visibility</strong>
                    Toggle sections on/off. Unchecking a section hides it instantly from the public landing page, ideal for feature rollouts or seasonal themes.
                  </div>
                  <div className="p-3 bg-emerald-50 rounded-lg text-emerald-800 text-xs">
                    💡 Press <strong>View Website</strong> at the top right to verify changes in a new tab!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardGuard>
  );
}
