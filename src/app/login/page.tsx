"use client";

import { useAuth } from "@/contexts/auth-context";
import { getRoleConfig } from "@/lib/roles";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import { sendEmailOtp, sendPhoneOtp } from "@/lib/api";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { user, isLoading, login, loginWithGoogleToken, loginWithOtp } = useAuth();
  const router = useRouter();
  
  const [tab, setTab] = useState<"password" | "otp">("password");
  
  // Password state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // OTP state
  const [otpType, setOtpType] = useState<"phone" | "email">("phone");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
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

  const handleSendOtp = async () => {
    if (!identifier.trim()) {
      setError(`Please enter a valid ${otpType === 'email' ? 'email address' : 'phone number'}.`);
      return;
    }
    
    setError("");
    setSubmitting(true);
    
    try {
      if (otpType === 'phone') {
        const res = await sendPhoneOtp(identifier.trim());
        setOtpSent(true);
        toast.success(res.message || "OTP sent to your mobile number!");
      } else {
        const res = await sendEmailOtp(identifier.trim());
        setOtpSent(true);
        toast.success(res.message || "OTP sent successfully!");
      }
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
      const res = await loginWithOtp(identifier.trim(), otp.trim(), otpType);
      
      if (res?.requires_profile_completion) {
        toast.success("OTP verified! Let's complete your profile.");
        // Store identifier in sessionStorage so the next page knows who it is
        sessionStorage.setItem("complete_profile_identifier", identifier.trim());
        sessionStorage.setItem("complete_profile_type", otpType);
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
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F3] px-4">
      <div className="w-full max-w-md">
        <div className="w-full bg-white/85 backdrop-blur-xl border border-white/40 shadow-lg rounded-[5px] p-8">
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
            <h1 className="text-3xl font-bold text-[#2B4D0E] font-['IBM_Plex_Sans']">Sign in to OURTH</h1>
            <p className="mt-2 text-sm text-[#444444] font-['IBM_Plex_Sans']">
              Welcome back! Please enter your details.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-[5px] bg-red-50 border border-red-500 px-4 py-3 text-sm text-red-600 font-['IBM_Plex_Sans']">
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
              Login via OTP
            </button>
          </div>

          {tab === "password" ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-bold text-black font-['IBM_Plex_Sans']">Email / Phone</label>
                <input
                  type="text"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email or Phone Number"
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
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-black outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans']"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-[30px] bg-[#25784C] border-[1.5px] border-black px-6 py-3.5 font-bold text-white transition hover:opacity-90 active:translate-y-[1px] disabled:opacity-60 font-['IBM_Plex_Sans'] text-[18px]"
              >
                {submitting ? "Signing in..." : "Sign In"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-5">
              {!otpSent && (
                <div className="flex space-x-4 mb-4">
                  <label className="flex items-center space-x-2 text-sm font-bold cursor-pointer">
                    <input 
                      type="radio" 
                      name="otpType" 
                      value="phone" 
                      checked={otpType === 'phone'} 
                      onChange={() => { setOtpType('phone'); setIdentifier(''); setError(''); }}
                      className="accent-[#25784C]"
                    />
                    <span>Phone Number</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm font-bold cursor-pointer">
                    <input 
                      type="radio" 
                      name="otpType" 
                      value="email" 
                      checked={otpType === 'email'} 
                      onChange={() => { setOtpType('email'); setIdentifier(''); setError(''); }}
                      className="accent-[#25784C]"
                    />
                    <span>Email Address</span>
                  </label>
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-bold text-black font-['IBM_Plex_Sans']">
                  {otpType === 'phone' ? 'Phone Number' : 'Email Address'}
                </label>
                <input
                  type={otpType === 'email' ? 'email' : 'text'}
                  required
                  disabled={otpSent}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={otpType === 'phone' ? "+919876543210" : "you@example.com"}
                  className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-black outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans'] disabled:opacity-70"
                />
              </div>

              {otpSent && (
                <div>
                  <label className="mb-2 block text-sm font-bold text-black font-['IBM_Plex_Sans']">Enter OTP</label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="6-digit OTP"
                    className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-black outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans']"
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
                className="w-full rounded-[30px] bg-[#25784C] border-[1.5px] border-black px-6 py-3.5 font-bold text-white transition hover:opacity-90 active:translate-y-[1px] disabled:opacity-60 font-['IBM_Plex_Sans'] text-[18px]"
              >
                {submitting ? "Processing..." : otpSent ? "Verify & Sign In" : "Send OTP"}
              </button>
            </form>
          )}

          <div id="recaptcha-container"></div>

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
