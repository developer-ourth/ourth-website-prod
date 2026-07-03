"use client";

import { getRoleConfig } from "@/lib/roles";
import type { UserRole } from "@/lib/roles";
import { registerApi, setToken } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import Image from "next/image";

function RegisterForm() {
  const router = useRouter();
  const { user, isLoading, loginWithGoogleToken } = useAuth();

  const roleConfig = getRoleConfig("consumer")!;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isBusiness, setIsBusiness] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [gstin, setGstin] = useState("");

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

  const currentRoleConfig = roleConfig;

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
        phone.trim() || undefined,
        isBusiness ? "vendor" : "consumer",
        isBusiness ? (gstin.trim() || undefined) : undefined,
        isBusiness ? (businessName.trim() || undefined) : undefined
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
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F3] px-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => router.push("/login")}
          className="mb-8 flex items-center gap-2 text-sm font-bold text-[#444444] transition hover:text-[#2B4D0E] font-['IBM_Plex_Sans']"
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

        <div className="w-full bg-white/85 backdrop-blur-xl border border-white/40 shadow-lg rounded-[5px] p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center justify-center">
              <Image 
                src="/images/logo/HOIPL_3DIndia.webp" 
                alt="Healing Ourth Logo" 
                width={64} 
                height={64} 
                className="object-contain drop-shadow-md"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2B4D0E] font-['IBM_Plex_Sans']">
                Create Account
              </h1>
              <p className="text-xs text-[#444444] font-['IBM_Plex_Sans']">
                {currentRoleConfig.label} Portal
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-5 rounded-[5px] bg-red-50 border border-red-500 px-4 py-3 text-sm text-red-600 font-['IBM_Plex_Sans']">
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
                    setError(err?.message || "Google registration failed.");
                  }
                }
              }}
              onError={() => setError("Google Login Failed")}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-bold text-black font-['IBM_Plex_Sans']">
                Full Name
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-black outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans']"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-black font-['IBM_Plex_Sans']">
                Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-black outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans']"
              />
            </div>

             <div>
              <label className="mb-2 block text-sm font-bold text-black font-['IBM_Plex_Sans']">
                Mobile Number (optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9876543210"
                className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-black outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans']"
              />
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="isBusiness"
                checked={isBusiness}
                onChange={(e) => setIsBusiness(e.target.checked)}
                className="h-4 w-4 rounded border-black text-black focus:ring-black accent-black cursor-pointer"
              />
              <label htmlFor="isBusiness" className="text-sm font-bold text-[#444444] cursor-pointer select-none font-['IBM_Plex_Sans']">
                I am registering as a business
              </label>
            </div>

            {isBusiness && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-bold text-black font-['IBM_Plex_Sans']">
                    Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Acme Corp"
                    className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-black outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans']"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-black font-['IBM_Plex_Sans']">
                    GSTIN (optional)
                  </label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-black outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans']"
                  />
                </div>
              </>
            )}

            <div>
              <label className="mb-2 block text-sm font-bold text-black font-['IBM_Plex_Sans']">
                Password
              </label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-black outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans']"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-black font-['IBM_Plex_Sans']">
                Confirm Password
              </label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-black outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans']"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-[30px] bg-[#25784C] border-[1.5px] border-black px-6 py-3.5 font-bold text-white transition hover:opacity-90 active:translate-y-[1px] disabled:opacity-60 font-['IBM_Plex_Sans'] text-[18px]"
            >
              {submitting ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#444444] font-['IBM_Plex_Sans']">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-bold text-[#2B4D0E] hover:underline"
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
