"use client";

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/app/(website)/_components/Navbar";
import Footer from "@/app/(website)/_components/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#FAF8F3] pt-36 pb-24 font-['IBM_Plex_Sans']">
      <div className="mx-auto max-w-[1625px] px-4 lg:px-[146px] w-full">
        {/* Title */}
        <h1 
          className="font-semibold text-[48px] leading-[62px] mb-10 text-left"
          style={{ fontFamily: "'IBM Plex Sans', sans-serif", color: "#2B4D0E" }}
        >
          Contact Us
        </h1>

        <div className="mx-auto w-full max-w-[1200px] min-h-[595px] bg-white/85 backdrop-blur-xl border border-white/40 shadow-lg rounded-[5px] p-8 md:p-14 flex flex-col md:flex-row gap-12 items-center justify-between">
            {/* Left Column (Contact Details) */}
            <div className="w-full md:w-[45%] flex flex-col justify-center pr-0 md:pr-8">
              <h2 className="text-[#2B4D0E] font-bold text-3xl mb-10 tracking-tight" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                <span>
                  We are always happy to hear and meet up with you
                </span>
              </h2>

              <div className="space-y-6 max-w-[480px]">
                <div>
                  <label className="block text-[#2B4D0E] text-[18px] font-bold mb-2">
                    Phone number
                  </label>
                  <div className="w-full rounded-[5px] border-[1.5px] border-black px-4 py-3 text-[18px] bg-[#FAF8F3] text-black">
                    1234567890
                  </div>
                </div>

                <div>
                  <label className="block text-[#2B4D0E] text-[18px] font-bold mb-2">
                    Email
                  </label>
                  <div className="w-full rounded-[5px] border-[1.5px] border-black px-4 py-3 text-[18px] bg-[#FAF8F3] text-black">
                    <a href="mailto:ourth@ourth.com" className="underline decoration-black underline-offset-2 hover:opacity-80">
                      ourth@ourth.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Interactive Form Card) */}
            <div className="w-full md:w-[50%] max-w-[620px]">
              <div className="bg-white/85 backdrop-blur-xl rounded-[5px] p-8 md:p-10 border border-white/40 shadow-lg relative w-full">
                {/* Tree sprout / leaf sprout icon at top center */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name-input" className="block text-[#2B4D0E] text-[18px] font-bold mb-2">
                      Full Name
                    </label>
                    <input
                      id="name-input"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sage Sharma"
                      className="w-full rounded-[5px] border-[1.5px] border-black px-4 py-3 text-[18px] bg-[#FAF8F3] outline-none focus:ring-2 focus:ring-[#25784C] text-black placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone-input" className="block text-[#2B4D0E] text-[18px] font-bold mb-2">
                      Number
                    </label>
                    <input
                      id="phone-input"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0987654321"
                      className="w-full rounded-[5px] border-[1.5px] border-black px-4 py-3 text-[18px] bg-[#FAF8F3] outline-none focus:ring-2 focus:ring-[#25784C] text-black placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <label htmlFor="email-input" className="block text-[#2B4D0E] text-[18px] font-bold mb-2">
                      Email
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sagesharma@gmail.com"
                      className="w-full rounded-[5px] border-[1.5px] border-black px-4 py-3 text-[18px] bg-[#FAF8F3] outline-none focus:ring-2 focus:ring-[#25784C] text-black placeholder-gray-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitted || loading}
                    className="w-full bg-[#25784C] text-white py-3 rounded-[30px] text-[18px] font-semibold border-[1.5px] border-black mt-8 flex items-center justify-center hover:opacity-95 transition disabled:opacity-50 active:translate-y-[1px]"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </span>
                    ) : submitted ? (
                      "Sent!"
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
      </div>
    </main>
  );
}

