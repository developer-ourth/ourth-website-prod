"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { registerApi } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import toast from "react-hot-toast";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [type, setType] = useState<"phone" | "email" | "">("");

  const [role, setRole] = useState<"consumer" | "vendor">("consumer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [gstin, setGstin] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If they are already fully logged in, redirect them
    if (user) {
      router.replace("/dashboards/admin");
      return;
    }

    const storedIdentifier = sessionStorage.getItem("complete_profile_identifier");
    const storedType = sessionStorage.getItem("complete_profile_type") as "phone" | "email";

    if (!storedIdentifier || !storedType) {
      // They shouldn't be here if they didn't just verify an OTP
      router.replace("/login");
      return;
    }

    setIdentifier(storedIdentifier);
    setType(storedType);

    if (storedType === "email") {
      setEmail(storedIdentifier);
    } else if (storedType === "phone") {
      setPhone(storedIdentifier);
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      // The registerApi handles storing the token in localStorage via the standard flow if we wanted to.
      // But registerApi currently just returns the token. We need to manually log them in, or let them redirect to login.
      // Wait, let's just call the register endpoint and then redirect to login so they can log in via OTP or the new password.
      // Auto-generate a secure random password for passwordless OTP users
      // This satisfies the backend requirement but keeps the frontend flow passwordless.
      // The user can always use "Forgot Password" later if they ever want to set a manual one.
      const secureRandomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10) + "A1!";

      await registerApi(
        name,
        email,
        secureRandomPassword,
        secureRandomPassword,
        phone,
        role,
        role === "vendor" ? gstin : undefined,
        role === "vendor" ? businessName : undefined
      );

      toast.success("Profile created successfully! Please log in.");
      sessionStorage.removeItem("complete_profile_identifier");
      sessionStorage.removeItem("complete_profile_type");
      router.push("/login");
    } catch (err: any) {
      setError(err?.message ?? "Failed to create profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!identifier) return null; // loading or redirecting

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF8F3] px-4 py-12">
      <div className="w-full max-w-lg">
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
            <h1 className="text-3xl font-bold text-[#2B4D0E] font-['IBM_Plex_Sans']">Complete Your Profile</h1>
            <p className="mt-2 text-sm text-[#444444] font-['IBM_Plex_Sans']">
              Your {type} was verified successfully. Tell us a bit about yourself to finish setting up your account.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-[5px] bg-red-50 border border-red-500 px-4 py-3 text-sm text-red-600 font-['IBM_Plex_Sans']">
              {error}
            </div>
          )}

          <div className="mb-6 flex space-x-2">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-bold border-b-2 transition ${role === "consumer" ? "border-[#2B4D0E] text-[#2B4D0E]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              onClick={() => setRole("consumer")}
            >
              I am a Customer
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-bold border-b-2 transition ${role === "vendor" ? "border-[#2B4D0E] text-[#2B4D0E]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
              onClick={() => setRole("vendor")}
            >
              I am a Business (B2B)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-black font-['IBM_Plex_Sans']">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-black outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans']"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-black font-['IBM_Plex_Sans']">Email Address</label>
              <input
                type="email"
                required
                disabled={type === "email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-black outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans'] ${type === 'email' ? 'opacity-70' : ''}`}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-black font-['IBM_Plex_Sans']">Phone Number</label>
              <input
                type="text"
                required={type === "phone"}
                disabled={type === "phone"}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+919876543210"
                className={`w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-black outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans'] ${type === 'phone' ? 'opacity-70' : ''}`}
              />
            </div>

            {role === "vendor" && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-bold text-black font-['IBM_Plex_Sans']">Business Name</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your Company Pvt Ltd"
                    className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-black outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans']"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-bold text-black font-['IBM_Plex_Sans']">GSTIN</label>
                  <input
                    type="text"
                    required
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="22AAAAA0000A1Z5"
                    className="w-full rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] px-4 py-3 text-black outline-none transition focus:ring-2 focus:ring-[#25784C] font-['IBM_Plex_Sans']"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-[30px] bg-[#25784C] border-[1.5px] border-black px-6 py-3.5 mt-4 font-bold text-white transition hover:opacity-90 active:translate-y-[1px] disabled:opacity-60 font-['IBM_Plex_Sans'] text-[18px]"
            >
              {submitting ? "Creating Profile..." : "Complete Profile & Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
