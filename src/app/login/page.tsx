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
    <div className="flex min-h-screen items-center justify-center bg-gray-2 px-4 dark:bg-[#020d1a]">
      <div className="w-full max-w-md">
        <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-white">
              🌿
            </div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">Sign in to Ourth</h1>
            <p className="mt-1 text-sm text-dark-4 dark:text-dark-6">
              Use your account email. Dashboard access is assigned by your role.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">Email Address</label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@ourth.local"
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-dark dark:text-white">Password</label>
                <a href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
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
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-dark-4 dark:text-dark-6">
            New user?{" "}
            <a href="/register" className="font-medium text-primary hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
