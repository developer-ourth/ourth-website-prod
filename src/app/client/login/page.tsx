"use client";

import { useAuth } from "@/contexts/auth-context";
import { getRoleConfig } from "@/lib/roles";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/(website)/_components/Navbar";
import Footer from "@/app/(website)/_components/Footer";

export default function ClientLoginPage() {
  const { user, isLoading, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "consumer") {
        router.replace("/client/dashboard");
      } else {
        const config = getRoleConfig(user.role);
        router.replace(config?.dashboardPath ?? "/dashboards/admin");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF8F3]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#25784C] border-t-transparent" />
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
      setError(msg?.message ?? "Invalid credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F3] flex flex-col justify-between font-['IBM_Plex_Sans']">
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-4 pt-36 pb-24">
        <div className="w-full max-w-[480px]">
          <div className="w-full bg-white/85 backdrop-blur-xl border border-white/40 shadow-lg rounded-[5px] p-8 md:p-10 relative overflow-hidden">
            
            <div className="mb-8 text-center">
              <span className="text-5xl block mb-4 select-none">🌿</span>
              <h1 className="text-3xl font-bold text-[#2B4D0E]">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-[#444444]">
                Sign in to your account to order tableware
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-[5px] border-[1.5px] border-red-600 bg-red-50 px-4 py-3 text-sm text-red-600 font-bold">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-black pl-1">
                  Email Address or Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com or +91 9876543210"
                  className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#25784C] transition"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between pl-1">
                  <label className="block text-sm font-bold text-black">
                    Password
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-xs font-bold text-[#2B4D0E] hover:underline font-['IBM_Plex_Sans']"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#25784C] transition"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-[30px] bg-[#25784C] border-[1.5px] border-black text-white font-bold transition hover:opacity-90 active:translate-y-[1px] py-3.5 flex justify-center items-center gap-2 text-lg"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-[#444444]">
              New here?{" "}
              <Link 
                href="/client/register" 
                className="font-bold text-[#2B4D0E] hover:underline"
              >
                Create an account
              </Link>
            </p>

            <div className="mt-6 pt-4 text-center">
              <Link 
                href="/login" 
                className="text-xs font-bold text-gray-500 hover:text-black transition"
              >
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
