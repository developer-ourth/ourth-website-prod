"use client";

import { useAuth } from "@/contexts/auth-context";
import { getRoleConfig } from "@/lib/roles";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      const config = getRoleConfig(user.role);
      router.replace(config?.dashboardPath ?? "/dashboards/admin");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-2 dark:bg-[#020d1a]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email.trim(), password);
    } catch (err: unknown) {
      const msg = err as { message?: string };
      setError(msg?.message ?? "Invalid credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F3] px-4">
      <div className="w-full max-w-md">
        <div className="w-full bg-white/85 backdrop-blur-xl border border-white/40 shadow-lg rounded-[5px] p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#2B4D0E] text-2xl text-white">
              🌿
            </div>
            <h1 className="text-3xl font-bold text-[#2B4D0E] font-['IBM_Plex_Sans']">Sign in to Ourth</h1>
            <p className="mt-2 text-sm text-[#444444] font-['IBM_Plex_Sans']">
              Use your account email. Dashboard access is assigned by your role.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-[5px] bg-red-50 border border-red-500 px-4 py-3 text-sm text-red-600 font-['IBM_Plex_Sans']">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-black font-['IBM_Plex_Sans']">Email Address</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@ourth.local"
                className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-black outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans']"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-bold text-black font-['IBM_Plex_Sans']">Password</label>
                <a href="/forgot-password" className="text-xs font-bold text-[#2B4D0E] hover:underline font-['IBM_Plex_Sans']">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-black outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans']"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-[30px] bg-[#25784C] border-[1.5px] border-black px-6 py-3.5 font-bold text-white transition hover:opacity-90 active:translate-y-[1px] disabled:opacity-60 font-['IBM_Plex_Sans'] text-[18px]"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#444444] font-['IBM_Plex_Sans']">
            New user?{" "}
            <a href="/register" className="font-bold text-[#2B4D0E] hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
