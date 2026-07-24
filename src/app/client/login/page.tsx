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
import toast from "react-hot-toast";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function ClientLoginPage() {
  const { user, isLoading, login, loginWithGoogleToken, loginWithOtp } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<"password" | "otp">("password");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "consumer" || user.role === "vendor") {
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

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
      });
    }
  };

  const handleSendOtp = async () => {
    let finalPhone = phone.trim();
    if (!finalPhone) {
      setError("Please enter a valid phone number.");
      return;
    }
    
    // Auto-prepend +91 if they just typed a 10 digit number
    if (/^\d{10}$/.test(finalPhone)) {
      finalPhone = "+91" + finalPhone;
      setPhone(finalPhone);
    }

    if (!/^\+[1-9]\d{1,14}$/.test(finalPhone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setError("");
    setSubmitting(true);
    
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, finalPhone, appVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
      toast.success("OTP sent to your phone!");
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to send OTP.");
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
      if (!confirmationResult) throw new Error("Please resend the OTP.");
      const result = await confirmationResult.confirm(otp.trim());
      const idToken = await result.user.getIdToken();
      
      const res = await loginWithOtp(phone.trim(), idToken, "phone");
      
      if (res?.requires_profile_completion) {
        toast.success("OTP verified! Let's complete your profile.");
        sessionStorage.setItem("complete_profile_identifier", phone.trim());
        sessionStorage.setItem("complete_profile_type", "phone");
        router.push("/complete-profile");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Invalid OTP.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F3] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="w-full bg-white rounded-xl border border-gray-100 shadow-md p-8 sm:p-10">
          
          {/* Logo & Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center">
              <Image 
                src="/images/logo/HOIPL_3DIndia.webp" 
                alt="Healing OURTH Logo" 
                width={80} 
                height={80} 
                className="object-contain drop-shadow-md"
              />
            </div>
            <h1 className="text-3xl font-bold text-[#2B4D0E] font-['IBM_Plex_Sans']">Welcome Back</h1>
            <p className="mt-1.5 text-sm text-gray-600 font-['IBM_Plex_Sans']">
              Sign in to your account to order tableware
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-500/40 px-4 py-3 text-sm text-red-600 font-['IBM_Plex_Sans']">
              {error}
            </div>
          )}

          {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
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
          )}
          
          {/* Tabs */}
          <div className="mb-6 flex w-full border-b border-gray-200">
            <button
              type="button"
              className={`flex-1 py-2.5 text-sm font-bold border-b-2 transition text-center ${tab === "password" ? "border-[#2B4D0E] text-[#2B4D0E]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              onClick={() => { setTab("password"); setError(""); }}
            >
              Password
            </button>
            <button
              type="button"
              className={`flex-1 py-2.5 text-sm font-bold border-b-2 transition text-center ${tab === "otp" ? "border-[#2B4D0E] text-[#2B4D0E]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              onClick={() => { setTab("otp"); setError(""); }}
            >
              Phone OTP
            </button>
          </div>

          {tab === "password" ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-black font-['IBM_Plex_Sans']">Email / Phone</label>
                <input
                  type="text"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com or +91 9876543210"
                  className="w-full rounded-lg border border-black bg-[#FAF8F3] px-4 py-3 text-black placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans']"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
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
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-black bg-[#FAF8F3] px-4 py-3 text-black placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans']"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-[30px] bg-[#25784C] border-[1.5px] border-black px-6 py-3.5 font-bold text-white transition hover:opacity-90 active:translate-y-[1px] disabled:opacity-60 font-['IBM_Plex_Sans'] text-[18px] shadow-sm"
                >
                  {submitting ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-black font-['IBM_Plex_Sans']">Phone Number</label>
                <input
                  type="text"
                  required
                  disabled={otpSent}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+919876543210"
                  className="w-full rounded-lg border border-black bg-[#FAF8F3] px-4 py-3 text-black placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans'] disabled:opacity-70 disabled:bg-gray-100"
                />
              </div>

              {otpSent && (
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-black font-['IBM_Plex_Sans']">Enter 6-digit OTP</label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="• • • • • •"
                    className="w-full rounded-lg border border-black bg-[#FAF8F3] px-4 py-3 text-black placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans'] tracking-widest text-center text-lg font-bold"
                  />
                  <div className="mt-2 text-right">
                    <button type="button" onClick={handleSendOtp} className="text-xs font-bold text-[#2B4D0E] hover:underline">
                      Resend OTP
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-[30px] bg-[#25784C] border-[1.5px] border-black px-6 py-3.5 font-bold text-white transition hover:opacity-90 active:translate-y-[1px] disabled:opacity-60 font-['IBM_Plex_Sans'] text-[18px] shadow-sm"
                >
                  {submitting ? "Processing..." : otpSent ? "Verify & Sign In" : "Send OTP"}
                </button>
              </div>
            </form>
          )}

          <div id="recaptcha-container"></div>

          <p className="mt-8 text-center text-sm text-[#444444] font-['IBM_Plex_Sans']">
            New here?{" "}
            <Link href="/client/register" className="font-bold text-[#2B4D0E] hover:underline">
              Create an account
            </Link>
          </p>

          <div className="mt-6 pt-5 text-center border-t border-gray-100">
            <Link
              href="/login"
              className="text-xs font-bold text-gray-500 hover:text-gray-900 transition font-['IBM_Plex_Sans']"
            >
              Are you a team member or vendor? Go to Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
