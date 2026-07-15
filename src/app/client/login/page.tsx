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
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FAF8F3] font-['IBM_Plex_Sans']">
      
      {/* Left Panel: Brand Experience (Desktop Only) */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-[#0D3A27] via-[#103F5E] to-[#0a2318] flex-col justify-between p-12 xl:p-16 text-white select-none">
        {/* Background Watermark */}
        <div className="absolute -right-20 -bottom-20 w-[550px] h-[550px] opacity-15 pointer-events-none">
          <Image
            src="/images/hero/earth.png"
            alt="Earth watermark"
            fill
            className="object-contain"
          />
        </div>

        {/* Top Brand */}
        <Link href="/" className="inline-flex items-center gap-3 relative z-10 w-fit group">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md p-1.5 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all">
            <Image
              src="/images/logo/HOIPL_3DIndia.webp"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold tracking-wide">Healing OURTH</span>
        </Link>

        {/* Middle Value Quote */}
        <div className="relative z-10 max-w-lg my-auto py-12">
          <span className="inline-block px-3 py-1 rounded-full bg-[#E8F0D8]/20 text-[#E8F0D8] text-xs font-bold uppercase tracking-wider mb-6 border border-[#E8F0D8]/30">
            100% Organic & Compostable
          </span>
          <h2 className="text-3xl xl:text-5xl font-bold leading-tight tracking-tight mb-6" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
            We don&apos;t make just platters, we serve our purpose.
          </h2>
          <p className="text-lg text-white/80 leading-relaxed font-normal">
            Join the movement toward sustainable, plastic-free tableware crafted from natural fallen leaves across Bharat.
          </p>

          {/* Pill Tags */}
          <div className="flex flex-wrap gap-2.5 mt-8 pt-6 border-t border-white/15">
            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-semibold border border-white/10">
              🌱 Purposeful
            </span>
            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-semibold border border-white/10">
              🤝 Trustworthy
            </span>
            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-sm font-semibold border border-white/10">
              ✨ Transformative
            </span>
          </div>
        </div>

        {/* Bottom Footer note */}
        <div className="relative z-10 text-xs text-white/60 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Healing OURTH</span>
          <span>Crafted for a cleaner planet 💚</span>
        </div>
      </div>

      {/* Right Panel: Login Card */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12 xl:p-16">
        <div className="w-full max-w-[440px]">
          
          {/* Mobile Brand Logo */}
          <div className="lg:hidden mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <Image
                src="/images/logo/HOIPL_3DIndia.webp"
                alt="Logo"
                width={60}
                height={60}
                className="object-contain drop-shadow-sm mx-auto"
              />
            </Link>
          </div>

          <div className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-xl p-8 sm:p-10">
            <div className="mb-8 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-['IBM_Plex_Sans']">Welcome Back</h1>
              <p className="mt-1.5 text-sm text-gray-600 font-['IBM_Plex_Sans']">
                Sign in to your account to order tableware
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-['IBM_Plex_Sans'] flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
              <div className="mb-6 flex justify-center pb-6 border-b border-gray-100">
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
            <div className="mb-6 grid grid-cols-2 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                className={`py-2 text-sm font-bold rounded-lg transition-all ${tab === "password" ? "bg-white text-[#0D3A27] shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => { setTab("password"); setError(""); }}
              >
                Password
              </button>
              <button
                type="button"
                className={`py-2 text-sm font-bold rounded-lg transition-all ${tab === "otp" ? "bg-white text-[#0D3A27] shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => { setTab("otp"); setError(""); }}
              >
                Phone OTP
              </button>
            </div>

            {tab === "password" ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-800 font-['IBM_Plex_Sans']">Email or Phone</label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com or +91 9876543210"
                    className="w-full rounded-xl border border-gray-300 bg-[#FAF8F3]/50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0D3A27] focus:ring-2 focus:ring-[#0D3A27]/20 font-['IBM_Plex_Sans']"
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="block text-sm font-bold text-gray-800 font-['IBM_Plex_Sans']">Password</label>
                    <a href="/forgot-password" className="text-xs font-bold text-[#0D3A27] hover:underline font-['IBM_Plex_Sans']">
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
                    className="w-full rounded-xl border border-gray-300 bg-[#FAF8F3]/50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0D3A27] focus:ring-2 focus:ring-[#0D3A27]/20 font-['IBM_Plex_Sans']"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-[#0D3A27] hover:bg-[#155338] px-6 py-3.5 font-bold text-white transition shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-60 font-['IBM_Plex_Sans'] text-base"
                  >
                    {submitting ? "Signing in..." : "Sign In"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-bold text-gray-800 font-['IBM_Plex_Sans']">Phone Number</label>
                  <input
                    type="text"
                    required
                    disabled={otpSent}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+919876543210"
                    className="w-full rounded-xl border border-gray-300 bg-[#FAF8F3]/50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0D3A27] focus:ring-2 focus:ring-[#0D3A27]/20 font-['IBM_Plex_Sans'] disabled:opacity-70 disabled:bg-gray-100"
                  />
                </div>

                {otpSent && (
                  <div>
                    <label className="mb-1.5 block text-sm font-bold text-gray-800 font-['IBM_Plex_Sans']">Enter 6-digit OTP</label>
                    <input
                      type="text"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="• • • • • •"
                      className="w-full rounded-xl border border-gray-300 bg-[#FAF8F3]/50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition focus:border-[#0D3A27] focus:ring-2 focus:ring-[#0D3A27]/20 font-['IBM_Plex_Sans'] tracking-widest text-center text-lg font-bold"
                    />
                    <div className="mt-2 text-right">
                      <button type="button" onClick={handleSendOtp} className="text-xs font-bold text-[#0D3A27] hover:underline">
                        Resend OTP
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-[#0D3A27] hover:bg-[#155338] px-6 py-3.5 font-bold text-white transition shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-60 font-['IBM_Plex_Sans'] text-base"
                  >
                    {submitting ? "Processing..." : otpSent ? "Verify & Sign In" : "Send OTP"}
                  </button>
                </div>
              </form>
            )}

            <div id="recaptcha-container"></div>

            <p className="mt-8 text-center text-sm text-gray-600 font-['IBM_Plex_Sans']">
              New here?{" "}
              <Link href="/client/register" className="font-bold text-[#0D3A27] hover:underline">
                Create an account
              </Link>
            </p>

            <div className="mt-6 pt-5 text-center border-t border-gray-100">
              <Link
                href="/login"
                className="text-xs font-medium text-gray-500 hover:text-gray-900 transition"
              >
                Team member or vendor? Go to Staff Portal →
              </Link>
            </div>
          </div>
        </div>
    </div>
  );
}
