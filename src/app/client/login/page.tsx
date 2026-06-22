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
        router.replace("/products");
      } else {
        const config = getRoleConfig(user.role);
        router.replace(config?.dashboardPath ?? "/dashboards/admin");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBEFC9]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#76A52E] border-t-transparent" />
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
    <main className="min-h-screen bg-[#FBEFC9] flex flex-col justify-between">
      <Navbar />

      <div className="flex-grow flex items-center justify-center px-4 pt-36 pb-24">
        <div className="w-full max-w-[480px]">
          {/* Neo-brutalist Premium Website Container */}
          <div className="rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] p-8 md:p-10 shadow-[6px_6px_0px_#000000] relative overflow-hidden">
            
            <div className="mb-8 text-center">
              <span className="text-5xl block mb-4 select-none">🌿</span>
              <h1 
                className="text-3xl font-bold text-[#5E3A16] tracking-tight"
                style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
              >
                Welcome Back
              </h1>
              <p 
                className="mt-2 text-sm font-semibold text-[#103F5E]"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
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
                <label 
                  className="mb-2 block text-xs font-bold text-black uppercase tracking-wider pl-1"
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                >
                  Email Address or Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com or +91 9876543210"
                  className="w-full rounded-[5px] border-[1.5px] border-black bg-white px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:bg-[#FAF8F3] transition shadow-[2px_2px_0px_#000000] focus:shadow-[1px_1px_0px_#000000]"
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between pl-1">
                  <label 
                    className="block text-xs font-bold text-black uppercase tracking-wider"
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                  >
                    Password
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-xs font-bold text-[#76A52E] hover:underline"
                    style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
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
                  className="w-full rounded-[5px] border-[1.5px] border-black bg-white px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:bg-[#FAF8F3] transition shadow-[2px_2px_0px_#000000] focus:shadow-[1px_1px_0px_#000000]"
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-[30px] bg-[#76A52E] hover:bg-[#659124] text-[#FAF8F3] font-normal border-[1.5px] border-black shadow-[3px_3px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_#000000] transition-all py-3.5 flex justify-center items-center gap-2 text-lg"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#FAF8F3] border-t-transparent" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <p 
              className="mt-8 text-center text-sm font-semibold text-[#103F5E]"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              New here?{" "}
              <Link 
                href="/client/register" 
                className="font-bold text-[#76A52E] hover:underline"
              >
                Create an account
              </Link>
            </p>

            <div className="mt-6 pt-6 border-t border-black/10 text-center">
              <Link 
                href="/login" 
                className="text-xs font-bold text-gray-500 hover:text-black transition"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
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
