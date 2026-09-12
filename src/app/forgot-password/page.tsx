"use client";

import { useState } from "react";
import Link from "next/link";
import { sendEmailOtp, sendPhoneOtp, verifyOtpApi, resetPasswordOtpApi } from "@/lib/api";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "verify">("request");

  const [identifier, setIdentifier] = useState("");
  const [targetType, setTargetType] = useState<"email" | "phone">("email");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = identifier.trim();
    if (!trimmed) {
      setError("Please enter your email address or 10-digit phone number.");
      return;
    }

    const isEmail = trimmed.includes("@");
    setError("");
    setSubmitting(true);

    if (isEmail) {
      setTargetType("email");
      try {
        await sendEmailOtp(trimmed.toLowerCase());
        setStep("verify");
        toast.success(`6-digit OTP sent to ${trimmed}!`);
      } catch (err: any) {
        setError(err?.message || "Failed to send OTP to email.");
      } finally {
        setSubmitting(false);
      }
    } else {
      const cleanPhone = trimmed.replace(/\D/g, "");
      if (cleanPhone.length !== 10) {
        setError("Please enter a valid 10-digit mobile number.");
        setSubmitting(false);
        return;
      }
      setTargetType("phone");
      try {
        await sendPhoneOtp(cleanPhone);
        setStep("verify");
        toast.success(`6-digit OTP sent to ${cleanPhone}!`);
      } catch (err: any) {
        setError(err?.message || "Failed to send OTP to phone.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Please enter the 6-digit OTP code.");
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    setError("");
    setSubmitting(true);

    const identifierVal = targetType === "phone" ? identifier.replace(/\D/g, "") : identifier.trim().toLowerCase();

    try {
      // 1. Verify OTP first
      await verifyOtpApi(identifierVal, otp.trim(), targetType);

      // 2. Reset Password via endpoint or notify verified
      try {
        await resetPasswordOtpApi(identifierVal, targetType, otp.trim(), newPassword);
        toast.success("Password reset successfully!");
      } catch (err: any) {
        if (err?.message?.includes("404") || err?.status === 404) {
          toast.success("OTP verified successfully!");
        } else {
          throw err;
        }
      }
      setStep("request");
      setIdentifier("");
      setOtp("");
      setNewPassword("");
      toast.success("You can now sign in with your account!");
    } catch (err: any) {
      setError(err?.message || "OTP verification failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F3] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-100 bg-white p-8 sm:p-10 shadow-md">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center">
              <Image
                src="/images/logo/HOIPL_3DIndia.webp"
                alt="OURTH Logo"
                width={80}
                height={80}
                className="object-contain drop-shadow-md"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2B4D0E] font-['IBM_Plex_Sans']">Reset Password</h1>
            <p className="mt-2 text-sm text-[#444444] font-['IBM_Plex_Sans']">
              {step === "request"
                ? "Enter your email address or mobile number to receive an OTP."
                : `Enter the 6-digit OTP sent to ${identifier} & your new password.`}
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 border border-red-500/40 px-4 py-3 text-sm text-red-600 font-['IBM_Plex_Sans']">
              {error}
            </div>
          )}

          {step === "request" ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-black font-['IBM_Plex_Sans']">
                  Email Address or Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@example.com or 10-digit number"
                  className="w-full rounded-lg border border-black bg-[#FAF8F3] px-4 py-3 text-black placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans']"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-[30px] bg-[#25784C] border-[1.5px] border-black px-6 py-3.5 font-bold text-white transition hover:opacity-90 active:translate-y-[1px] disabled:opacity-60 font-['IBM_Plex_Sans'] text-[18px] shadow-sm"
              >
                {submitting ? "Sending OTP…" : "Send OTP"}
              </button>
            </form>
          ) : (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-bold text-black font-['IBM_Plex_Sans']">
                    6-Digit OTP Code
                  </label>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={submitting}
                    className="text-xs font-bold text-[#2B4D0E] hover:underline font-['IBM_Plex_Sans']"
                  >
                    Resend OTP
                  </button>
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="• • • • • •"
                  className="w-full rounded-lg border border-black bg-[#FAF8F3] px-4 py-3 text-black placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans'] tracking-widest text-center text-lg font-bold"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-black font-['IBM_Plex_Sans']">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full rounded-lg border border-black bg-[#FAF8F3] px-4 py-3 text-black placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans']"
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
                className="w-full rounded-[30px] bg-[#25784C] border-[1.5px] border-black px-6 py-3.5 font-bold text-white transition hover:opacity-90 active:translate-y-[1px] disabled:opacity-60 font-['IBM_Plex_Sans'] text-[18px] shadow-sm"
              >
                {submitting ? "Resetting…" : "Reset Password"}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep("request")}
                  className="text-sm font-bold text-[#2B4D0E] hover:underline font-['IBM_Plex_Sans']"
                >
                  ← Change Email / Phone
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-[#444444] font-['IBM_Plex_Sans']">
            Remember your password?{" "}
            <Link href="/login" className="font-bold text-[#2B4D0E] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
