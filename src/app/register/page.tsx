"use client";

import { getRoleConfig, ROLES } from "@/lib/roles";
import type { UserRole } from "@/lib/roles";
import { registerApi, setToken } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();

  const roleParam = (searchParams.get("role") ?? "consumer") as UserRole;
  const roleConfig = getRoleConfig(roleParam) ?? getRoleConfig("consumer")!;

  const [selectedRole, setSelectedRole] = useState<UserRole>(
    roleConfig.role as UserRole,
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const currentRoleConfig = getRoleConfig(selectedRole)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await registerApi(
        name.trim(),
        email.trim(),
        password,
        confirmPassword,
        selectedRole,
      );
      setToken(res.data.token);
      // Store user then redirect
      localStorage.setItem(
        "ourth_auth_user",
        JSON.stringify({ ...res.data.user }),
      );
      const config = getRoleConfig(res.data.user.role as UserRole);
      router.replace(config?.dashboardPath ?? "/dashboards/admin");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message ?? "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-2 px-4 dark:bg-[#020d1a]">
      <div className="w-full max-w-md">
        <button
          onClick={() => router.push("/login")}
          className="mb-8 flex items-center gap-2 text-sm text-dark-4 transition hover:text-primary dark:text-dark-6"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M10 3L5 8l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Login
        </button>

        <div className="rounded-[10px] bg-white p-8 shadow-1 dark:bg-gray-dark">
          <div className="mb-6 flex items-center gap-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full ${currentRoleConfig.color} text-2xl text-white`}
            >
              {currentRoleConfig.emoji}
            </div>
            <div>
              <h1 className="text-xl font-bold text-dark dark:text-white">
                Create Account
              </h1>
              <p className="text-xs text-dark-4 dark:text-dark-6">
                {currentRoleConfig.label} Portal
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Role / Portal
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-gray-dark dark:text-white dark:focus:border-primary"
              >
                {ROLES.map((r) => (
                  <option key={r.role} value={r.role}>
                    {r.emoji} {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Full Name
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                Confirm Password
              </label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full rounded-lg px-6 py-3 font-medium text-white transition ${currentRoleConfig.color} hover:opacity-90 disabled:opacity-60`}
            >
              {submitting ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-dark-4 dark:text-dark-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-2 dark:bg-[#020d1a]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
