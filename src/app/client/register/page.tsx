"use client";

import { useAuth } from "@/contexts/auth-context";
import { getRoleConfig } from "@/lib/roles";
import { registerApi, setToken } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/(website)/_components/Navbar";
import Footer from "@/app/(website)/_components/Footer";

export default function ClientRegisterPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "consumer") {
        router.replace("/products");
      } else {
        const config = getRoleConfig(user.role);
        router.replace(config?.dashboardPath ?? "/dashboards/admin");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#25784C] border-t-transparent" />
      </div>
    );
  }

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
        phone.trim() || undefined
      );
      setToken(res.data.token);
      localStorage.setItem("ourth_auth_user", JSON.stringify({ ...res.data.user }));
      // Redirect to products/cart catalog
      router.replace("/products");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message ?? "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-[#D8EFE0] via-[#FAF7F2] to-[#E2EFE0] flex flex-col justify-between">
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-4 pt-36 pb-24">
        <div className="w-full max-w-[480px]">
          {/* Glassmorphic Container */}
          <div className="rounded-[36px] bg-white/70 backdrop-blur-xl border border-white/40 p-10 md:p-12 shadow-[0_20px_50px_rgba(13,58,39,0.06)] relative overflow-hidden">
            
            {/* Subtle decorative glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#25784C]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#2C1F13]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="mb-8 text-center">
              <span className="text-5xl block mb-4 filter drop-shadow-sm select-none">🌿</span>
              <h1 className="text-3xl font-extrabold text-[#0D3A27] tracking-tight">Create Account</h1>
              <p className="mt-2 text-sm text-[#2C1F13]/70 font-medium">
                Sign up to start purchasing eco-friendly tableware
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl bg-red-50/80 border border-red-100 px-4 py-3 text-sm text-red-700 font-semibold animate-shake">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold text-[#0D3A27] uppercase tracking-wider pl-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Asteria Xing"
                  className="w-full rounded-2xl border border-gray-200/80 bg-white/90 px-5 py-3 text-sm text-[#2C1F13] placeholder-gray-400 outline-none focus:border-[#25784C] focus:ring-1 focus:ring-[#25784C] transition duration-200 shadow-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#0D3A27] uppercase tracking-wider pl-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-gray-200/80 bg-white/90 px-5 py-3 text-sm text-[#2C1F13] placeholder-gray-400 outline-none focus:border-[#25784C] focus:ring-1 focus:ring-[#25784C] transition duration-200 shadow-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#0D3A27] uppercase tracking-wider pl-1">
                  Mobile Number (optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full rounded-2xl border border-gray-200/80 bg-white/90 px-5 py-3 text-sm text-[#2C1F13] placeholder-gray-400 outline-none focus:border-[#25784C] focus:ring-1 focus:ring-[#25784C] transition duration-200 shadow-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#0D3A27] uppercase tracking-wider pl-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-2xl border border-gray-200/80 bg-white/90 px-5 py-3 text-sm text-[#2C1F13] placeholder-gray-400 outline-none focus:border-[#25784C] focus:ring-1 focus:ring-[#25784C] transition duration-200 shadow-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-bold text-[#0D3A27] uppercase tracking-wider pl-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full rounded-2xl border border-gray-200/80 bg-white/90 px-5 py-3 text-sm text-[#2C1F13] placeholder-gray-400 outline-none focus:border-[#25784C] focus:ring-1 focus:ring-[#25784C] transition duration-200 shadow-sm"
                />
              </div>

              <div className="text-[11px] text-[#2C1F13]/70 pl-1 leading-relaxed pt-1">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-2xl bg-[#25784C] px-6 py-3.5 font-bold text-[#D8EFE0] hover:bg-[#1a5b36] disabled:opacity-60 transition duration-200 shadow-md shadow-[#25784C]/10 flex justify-center items-center gap-2 mt-2"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#D8EFE0] border-t-transparent" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm font-semibold text-[#2C1F13]/70">
              Already have an account?{" "}
              <Link href="/client/login" className="font-extrabold text-[#25784C] hover:underline">
                Sign in
              </Link>
            </p>

            <div className="mt-6 pt-6 border-t border-gray-200/50 text-center">
              <Link href="/login" className="text-xs font-bold text-gray-400 hover:text-gray-600 transition">
                Are you a team member or vendor? Go to Portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
