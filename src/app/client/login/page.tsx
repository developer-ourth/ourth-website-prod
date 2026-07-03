"use client";

import { useAuth } from "@/contexts/auth-context";
import { getRoleConfig } from "@/lib/roles";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/(website)/_components/Navbar";
import Footer from "@/app/(website)/_components/Footer";
import { GoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import { sendOtp } from "@/lib/api";
import toast from "react-hot-toast";

export default function ClientLoginPage() {
  const { user, isLoading, login, loginWithGoogleToken, loginWithOtp } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<"password" | "otp">("password");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
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

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await sendOtp(phone.trim());
      setOtpSent(true);
      toast.success(res.message || "OTP sent successfully!");
    } catch (err: unknown) {
      const msg = err as { message?: string };
      setError(msg?.message ?? "Failed to send OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) return handleSendOtp();
    
    setError("");
    setSubmitting(true);
    try {
      await loginWithOtp(phone.trim(), otp.trim());
    } catch (err: unknown) {
      const msg = err as { message?: string };
      setError(msg?.message ?? "Invalid OTP.");
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
              <div className="mb-4 inline-flex items-center justify-center">
                <Image 
                  src="/images/logo/HOIPL_3DIndia.webp" 
                  alt="Healing Ourth Logo" 
                  width={80} 
                  height={80} 
                  className="object-contain drop-shadow-md"
                />
              </div>
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

            <div className="mb-6 flex justify-center pb-6 border-b border-gray-200">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    try {
                      await loginWithGoogleToken(credentialResponse.credential);
                    } catch (err: any) {
                      setError(err?.message || "Google login failed.");
                    }
                  }
                }}
                onError={() => setError("Google Login Failed")}
              />
            </div>
            
            <div className="mb-6 flex space-x-2">
              <button
                className={`flex-1 py-2 text-sm font-bold border-b-2 transition ${tab === "password" ? "border-[#2B4D0E] text-[#2B4D0E]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                onClick={() => { setTab("password"); setError(""); }}
              >
                Password
              </button>
              <button
                className={`flex-1 py-2 text-sm font-bold border-b-2 transition ${tab === "otp" ? "border-[#2B4D0E] text-[#2B4D0E]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                onClick={() => { setTab("otp"); setError(""); }}
              >
                Phone OTP
              </button>
            </div>

            {tab === "password" ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
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
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-bold text-black pl-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    disabled={otpSent}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+919876543210"
                    className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#25784C] transition disabled:opacity-70"
                  />
                </div>

                {otpSent && (
                  <div>
                    <label className="mb-2 block text-sm font-bold text-black pl-1">Enter OTP</label>
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="6-digit OTP"
                      className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#25784C] transition"
                    />
                    <div className="mt-2 text-right">
                      <button type="button" onClick={handleSendOtp} className="text-xs font-bold text-[#2B4D0E] hover:underline">
                        Resend OTP
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-[30px] bg-[#25784C] border-[1.5px] border-black text-white font-bold transition hover:opacity-90 active:translate-y-[1px] py-3.5 flex justify-center items-center gap-2 text-lg"
                >
                  {submitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Processing...</span>
                    </>
                  ) : otpSent ? (
                    "Verify & Sign In"
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </form>
            )}

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
