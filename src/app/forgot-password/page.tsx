"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPasswordApi } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email,     setEmail]     = useState("");
  const [sent,      setSent]      = useState(false);
  const [error,     setError]     = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await forgotPasswordApi(email.trim());
      setSent(true);
    } catch (err: unknown) {
      const msg = err as { message?: string };
      setError(msg?.message ?? "Could not send reset email. Please try again.");
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
              🔑
            </div>
            <h1 className="text-2xl font-bold text-dark dark:text-white">Forgot Password</h1>
            <p className="mt-1 text-sm text-dark-4 dark:text-dark-6">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="mb-4 rounded-lg bg-green-50 px-4 py-4 text-sm text-green-700">
                Password reset link sent to <strong>{email}</strong>. Please check your inbox.
              </div>
              <Link
                href="/login"
                className="text-sm font-medium text-primary hover:underline"
              >
                ← Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
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
                    placeholder="you@ourth.local"
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send Reset Link"}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-dark-4 dark:text-dark-6">
                Remember your password?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
