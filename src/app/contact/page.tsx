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
    <main className="min-h-screen bg-[#F5F8F3] flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Top Sky Section (Contains Tree, Grass, and Title) */}
        <section
          className="relative overflow-hidden pt-44 pb-36 flex items-center min-h-[1000px]"
          style={{
            background: "linear-gradient(180deg, #9BDFF2 0%, #E8F8FC 100%)",
          }}
        >
          {/* Tree Image (Left side) - Figma (X: 0, Y: 0, W: 1003, H: 943) */}
          <div className="absolute left-0 top-0 w-[100%] max-w-[100%] h-[100%] pointer-events-none z-10 select-none hidden md:block">
            <Image
              src="/images/contact/tree.png"
              alt="Green Tree"
              fill
              className="object-contain object-left-top"
              priority
            />
          </div>

          {/* Grass Image (Bottom span) */}
          <div className="absolute left-0 right-0 bottom-0 h-[40%] pointer-events-none z-10 select-none">
            <Image
              src="/images/contact/grass.png"
              alt="Lush green grass"
              fill
              className="object-cover object-bottom"
              priority
            />
          </div>

          {/* Headline (Right aligned) */}
          <div className="relative z-20 mx-auto max-w-[1580px] w-full px-8 lg:px-16 flex justify-end">
            <h1
              className="text-[#2C1F13] font-black text-4xl sm:text-5xl lg:text-6xl text-right max-w-4xl leading-[1.1] tracking-tight"
              style={{ fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif" }}
            >
              We are always happy to hear <br />
              and meet up with you
            </h1>
          </div>
        </section>

        {/* Transition Boundary (Cloud Mask) */}
        <div className="relative w-full h-[60px] bg-[#D8EFE0] -mt-1 z-20">
          <div className="absolute top-[-150px] left-0 right-0 h-[300px] pointer-events-none select-none">
            <Image
              src="/images/contact/clouds.png"
              alt="Cloud boundary"
              fill
              className="object-stretch"
            />
          </div>
        </div>

        {/* Bottom Sage Green Section (Contains the Cards) */}
        <section className="bg-[#D8EFE0] pt-8 pb-24 px-6 relative z-20">
          <div
            className="mx-auto max-w-[1506px] min-h-[595px] bg-[#FAF8F3]/50 rounded-[30px] p-8 md:p-14 border border-[#C6DCD0] flex flex-col md:flex-row gap-12 items-center justify-between"
            style={{ boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)" }}
          >
            {/* Left Column (Contact Details) */}
            <div className="w-full md:w-[45%] flex flex-col justify-center pr-0 md:pr-8">
              <h2 className="text-[#2C1F13] font-bold text-3xl mb-10 tracking-tight">
                <span>
                  Contact Us:
                </span>
              </h2>

              <div className="space-y-6 max-w-[480px]">
                <div>
                  <label className="block text-[#2C1F13] text-[15px] font-bold mb-2 pl-4">
                    Phone number
                  </label>
                  <div className="w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-full px-6 py-4 text-base font-medium text-[#2C1F13]/70" style={{ boxShadow: "inset 0 4px 4px 0 rgba(0, 0, 0, 0.25)" }}>
                    1234567890
                  </div>
                </div>

                <div>
                  <label className="block text-[#2C1F13] text-[15px] font-bold mb-2 pl-4">
                    Email
                  </label>
                  <div className="w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-full px-6 py-4 text-base font-medium text-[#2C1F13]/70" style={{ boxShadow: "inset 0 4px 4px 0 rgba(0, 0, 0, 0.25)" }}>
                    <a href="mailto:ourth@ourth.com" className="underline decoration-[#2C1F13]/70 underline-offset-2 hover:text-[#2C1F13]">
                      ourth@ourth.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (Interactive Form Card) */}
            <div className="w-full md:w-[50%] max-w-[620px]">
              <div
                className="bg-[#FAF8F3]/50 rounded-[35px] p-8 md:p-10 border border-[#E5E0D8] relative"
                style={{ boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)" }}
              >
                {/* Tree sprout / leaf sprout icon at top center */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[#2C1F13] text-[15px] font-bold mb-2 pl-4">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Sage Sharma"
                      className="w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-full px-6 py-4 text-base text-[#2C1F13] placeholder-[#2C1F13]/40 focus:outline-none focus:border-[#5B896F] transition font-medium"
                      style={{ boxShadow: "inset 0 4px 4px 0 rgba(0, 0, 0, 0.25)" }}
                    />
                  </div>

                  <div>
                    <label className="block text-[#2C1F13] text-[15px] font-bold mb-2 pl-4">
                      Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0987654321"
                      className="w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-full px-6 py-4 text-base text-[#2C1F13] placeholder-[#2C1F13]/40 focus:outline-none focus:border-[#5B896F] transition font-medium"
                      style={{ boxShadow: "inset 0 4px 4px 0 rgba(0, 0, 0, 0.25)" }}
                    />
                  </div>

                  <div>
                    <label className="block text-[#2C1F13] text-[15px] font-bold mb-2 pl-4">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sagesharma@gmail.com"
                      className="w-full bg-[#FAF7F2] border border-[#E5E0D8] rounded-full px-6 py-4 text-base text-[#2C1F13] placeholder-[#2C1F13]/40 focus:outline-none focus:border-[#5B896F] transition font-medium"
                      style={{ boxShadow: "inset 0 4px 4px 0 rgba(0, 0, 0, 0.25)" }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitted || loading}
                    className="w-full rounded-full font-bold text-lg py-4 px-6 transition duration-300 shadow-md text-white mt-8 flex items-center justify-center"
                    style={{
                      backgroundColor: (submitted || loading) ? "#5B896F" : "#5B896F",
                    }}
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
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

