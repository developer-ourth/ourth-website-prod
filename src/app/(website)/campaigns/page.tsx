"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function CampaignsPage() {
  return (
    <main className="relative min-h-screen bg-[#FAF8F3] pt-[70px] lg:pt-[95px] overflow-x-hidden">
      {/* Banner */}
      <section className="relative w-full h-[260px] sm:h-[320px] md:h-[400px] flex items-center justify-center bg-[#2B4D0E]">
        <div className="absolute inset-0">
          <Image
            src="/images/about/banner.webp"
            alt="Campaigns Banner"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-['IBM_Plex_Sans'] mb-4">
            Our Active Campaigns
          </h1>
          <p className="text-[#A4CC55] font-semibold text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto">
            Empowering citizens, businesses, and local communities to replace single-use plastics at the source.
          </p>
        </div>
      </section>

      {/* Campaigns list */}
      <section className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Campaign Card 1 */}
          <div className="flex flex-col bg-white rounded-[30px] border border-black/10 shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
            <div className="relative w-full h-[240px]">
              <Image
                src="/images/about/Element1.webp"
                alt="Ek Ped Maa Ke Naam"
                fill
                className="object-contain p-6 bg-[#C7E08E]/20"
              />
            </div>
            <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-[#76A52E]/10 text-[#76A52E] font-bold text-xs rounded-full uppercase tracking-wider mb-3">
                  Afforestation
                </span>
                <h2 className="text-[#2B4D0E] font-bold text-2xl font-['IBM_Plex_Sans'] mb-3">
                  Ek Ped Maa Ke Naam
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Rooted in the national Green India Mission (GIM), we are facilitating tree planting drives across local nurseries to build massive natural carbon sinks and restore degraded forest landscapes.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-between px-6 py-3 bg-[#76A52E] text-white font-bold text-sm rounded-full hover:bg-[#2B4D0E] transition-colors"
              >
                Get Involved
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Campaign Card 2 */}
          <div className="flex flex-col bg-white rounded-[30px] border border-black/10 shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
            <div className="relative w-full h-[240px]">
              <Image
                src="/images/about/Element2.webp"
                alt="Zero Plastic Bharat"
                fill
                className="object-contain p-6 bg-[#C7E08E]/20"
              />
            </div>
            <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-[#E8503A]/10 text-[#E8503A] font-bold text-xs rounded-full uppercase tracking-wider mb-3">
                  Waste Sourcing
                </span>
                <h2 className="text-[#2B4D0E] font-bold text-2xl font-['IBM_Plex_Sans'] mb-3">
                  Zero Single-Use Plastic Movement
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  Assisting schools, temples, and small vendors in making the clean switch from toxic plastic disposables to completely compostable, locally-sourced leaf tableware.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center justify-between px-6 py-3 bg-[#76A52E] text-white font-bold text-sm rounded-full hover:bg-[#2B4D0E] transition-colors"
              >
                Partner with Us
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
