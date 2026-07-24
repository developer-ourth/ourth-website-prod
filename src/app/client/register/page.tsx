"use client";

import { useAuth } from "@/contexts/auth-context";
import { getRoleConfig } from "@/lib/roles";
import { registerApi, setToken } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/app/(website)/_components/Navbar";
import Footer from "@/app/(website)/_components/Footer";
import { GoogleLogin } from "@react-oauth/google";
import Image from "next/image";

export default function ClientRegisterPage() {
  const { user, isLoading, loginWithGoogleToken } = useAuth();
  const router = useRouter();

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
      localStorage.setItem("ourth_auth_user", JSON.stringify({ ...res.data.user }));
      router.replace("/products");
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message ?? "Registration failed. Please try again.");
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
                  alt="Healing OURTH Logo" 
                  width={80} 
                  height={80} 
                  className="object-contain drop-shadow-md"
                />
              </div>
              <h1 className="text-3xl font-bold text-[#2B4D0E]">
                Create Account
              </h1>
              <p className="mt-2 text-sm text-[#444444]">
                Sign up to start purchasing eco-friendly tableware
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-[5px] border-[1.5px] border-red-600 bg-red-50 px-4 py-3 text-sm text-red-600 font-bold">
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
                      setError(err?.message || "Google registration failed.");
                    }
                  }
                }}
                onError={() => setError("Google Login Failed")}
              />
            </div>
          )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-bold text-black pl-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Asteria Xing"
                  className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#25784C] transition"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-black pl-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#25784C] transition"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-black pl-1">
                  Mobile Number (optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#25784C] transition"
                />
              </div>

              <div className="flex items-center gap-2 pl-1 py-2">
                <input
                  type="checkbox"
                  id="isBusiness"
                  checked={isBusiness}
                  onChange={(e) => setIsBusiness(e.target.checked)}
                  className="h-4 w-4 rounded border-black text-black focus:ring-black accent-black cursor-pointer"
                />
                <label 
                  htmlFor="isBusiness" 
                  className="text-sm font-bold text-[#444444] cursor-pointer select-none"
                >
                  I am registering as a business
                </label>
              </div>

              {isBusiness && (
                <div className="space-y-4 pt-2 border-t border-black/10 transition-all duration-200">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-black pl-1">
                      Business Name
                    </label>
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Acme Corp"
                      className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#25784C] transition"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-bold text-black pl-1">
                      GSTIN (optional)
                    </label>
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      placeholder="22AAAAA0000A1Z5"
                      className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#25784C] transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-bold text-black pl-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#25784C] transition"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-black pl-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-sm text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#25784C] transition"
                />
              </div>

              <div className="text-[11px] text-[#444444] pl-1 leading-relaxed pt-1">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-[30px] bg-[#25784C] border-[1.5px] border-black text-white font-bold transition hover:opacity-90 active:translate-y-[1px] py-3.5 flex justify-center items-center gap-2 text-lg mt-2"
              >
                {submitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-[#444444]">
              Already have an account?{" "}
              <Link 
                href="/client/login" 
                className="font-bold text-[#2B4D0E] hover:underline"
              >
                Sign in
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
