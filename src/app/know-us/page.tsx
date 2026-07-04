"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const teamMembers = [
  { name: "Riya Goyal", image: "/images/team/team-02.webp" },
  { name: "Arnav Rajput", image: "/images/team/team-05.webp" },
  { name: "Harshal Mathur", image: "/images/team/team-03.webp" },
  { name: "Rahul Gandhi", image: "/images/team/team-06.webp" },
  { name: "Sahil Bhargava", image: "/images/team/team-04.webp" },
  { name: "Asteria Xing", image: "/images/team/team-07.webp" }
];

const slides = [
  {
    title: "Purposeful",
    description: "Everything we build solves a real environmental problem right at core",
    image: "/images/about/banner.webp",
    activeTitleColor: "text-[#76A52E]",
    rightSloganColor: "text-[#2B4D0E]",
    coreStatementColor: "text-[#76A52E]",
    headingColor: "text-[#2B4D0E]",
    boxBg: "bg-[#76A52E]/15",
    textColor: "text-[#2B4D0E]",
    ctaBg: "bg-[#76A52E]",
    ctaText: "text-white"
  },
  {
    title: "Trustworthy",
    description: "Scientific, transparent, and honest.",
    image: "/images/about/banner_blue.webp",
    activeTitleColor: "text-[#5CB6E8]",
    rightSloganColor: "text-[#154B68]",
    coreStatementColor: "text-[#5CB6E8]",
    headingColor: "text-[#154B68]",
    boxBg: "bg-[#5CB6E8]/15",
    textColor: "text-[#154B68]",
    ctaBg: "bg-[#5CB6E8]",
    ctaText: "text-white"
  },
  {
    title: "Transformative",
    description: "We don't just replace products. We transform behaviour, businesses, and environmental impact.",
    image: "/images/about/banner_yellow.webp",
    activeTitleColor: "text-[#EBB339]",
    rightSloganColor: "text-[#664C12]",
    coreStatementColor: "text-[#EBB339]",
    headingColor: "text-[#664C12]",
    boxBg: "bg-[#EBB339]/15",
    textColor: "text-[#664C12]",
    ctaBg: "bg-[#EBB339]",
    ctaText: "text-white"
  }
];

export default function KnowUsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <main className="relative min-h-screen w-full bg-white overflow-x-hidden transition-colors duration-1000">

      {/* ===== 1. HERO BANNER ===== */}
      <section className="relative w-full h-[320px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        {/* Background Images with Fade Transition */}
        <div className="absolute inset-0">
          {slides.map((s, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                currentSlide === idx ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={s.image}
                alt="Know Us Banner"
                fill
                className="object-cover"
                priority={idx === 0}
              />
            </div>
          ))}
        </div>
        
        {/* Transparent Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Hero Content */}
        <div className="relative z-10 h-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 lg:px-24 flex items-center">
          <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 md:gap-8 pt-16 sm:pt-20 md:pt-24">
            {/* Left */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-[48px] leading-tight sm:leading-tight md:leading-[46px] font-['IBM_Plex_Sans'] max-w-[695px]">
                What does &quot;Healing OURTH&quot;<br />mean to US?
              </h1>
              
              {/* Dynamic Text Box Card */}
              <div
                className="w-full max-w-[558px] h-[70px] sm:h-[80px] md:h-[100px] lg:h-[138px] rounded-[20px] sm:rounded-[30px] flex items-center px-4 sm:px-6 md:px-8 border border-white/20 transition-all duration-1000"
                style={{
                  background: "rgba(255, 255, 255, 0.12)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
                }}
              >
                <span className={`font-bold text-2xl sm:text-3xl md:text-[36px] lg:text-[48px] leading-tight font-['IBM_Plex_Sans'] transition-all duration-1000 ${slide.activeTitleColor}`}>
                  {slide.title}
                </span>
              </div>
            </div>

            {/* Right Slogan */}
            <p className={`font-semibold text-base sm:text-lg md:text-2xl lg:text-[40px] lg:leading-[46px] text-left md:text-right max-w-[503px] font-['IBM_Plex_Sans'] transition-all duration-1000 ${slide.rightSloganColor}`}>
              {slide.description}
            </p>
          </div>
        </div>

        {/* Slide Indicators / Dots (Manual Controls) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentSlide === idx ? "w-6 bg-white" : "w-2.5 bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ===== 2. CORE STATEMENT ===== */}
      <section className="w-full py-6 sm:py-8 md:py-10 px-4 sm:px-6">
        <p className={`max-w-[1747px] mx-auto text-center font-bold text-sm sm:text-base md:text-lg lg:text-[24px] leading-relaxed sm:leading-relaxed md:leading-[34px] font-['IBM_Plex_Sans'] transition-all duration-1000 ${slide.coreStatementColor}`}>
          Ourth aims to build the world&apos;s most trusted climate-tech ecosystem that makes sustainable living affordable, accessible, and actionable for every citizen, every business, and every community—creating a Clean, Green, Single-Use Plastic-Free Bharat, and inspiring the world to heal OURTH together.
        </p>
      </section>

      {/* ===== 3. WHAT IS HEALING OURTH? ===== */}
      <section className="w-full py-8 sm:py-10 md:py-12 px-4 sm:px-6 relative overflow-visible">
        <h2 className={`text-center font-bold text-2xl sm:text-3xl md:text-[36px] lg:text-[40px] leading-tight md:leading-[46px] font-['IBM_Plex_Sans'] mb-8 sm:mb-10 md:mb-12 transition-all duration-1000 ${slide.headingColor}`}>
          What is Healing OURTH?
        </h2>

        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center lg:items-start gap-8 sm:gap-10 md:gap-12 relative z-10">
          {/* Left: 2x2 Grid of Objective Boxes */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-[30px] flex-shrink-0">
            {/* Box 1 */}
            <div className={`w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] md:w-[200px] md:h-[200px] lg:w-[248px] lg:h-[248px] rounded-[20px] sm:rounded-[25px] md:rounded-[30px] flex items-center justify-center hover:scale-105 transition-all duration-1000 ${slide.boxBg}`}>
              <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] lg:w-[140px] lg:h-[140px]">
                <Image src="/images/about/Element1.webp" alt="Eco Products" fill className="object-contain" />
              </div>
            </div>
            {/* Box 2 */}
            <div className={`w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] md:w-[200px] md:h-[200px] lg:w-[248px] lg:h-[248px] rounded-[20px] sm:rounded-[25px] md:rounded-[30px] flex items-center justify-center hover:scale-105 transition-all duration-1000 ${slide.boxBg}`}>
              <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] lg:w-[140px] lg:h-[140px]">
                <Image src="/images/about/Element2.webp" alt="Waste Disposal" fill className="object-contain" />
              </div>
            </div>
            {/* Box 3 */}
            <div className={`w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] md:w-[200px] md:h-[200px] lg:w-[248px] lg:h-[248px] rounded-[20px] sm:rounded-[25px] md:rounded-[30px] flex items-center justify-center hover:scale-105 transition-all duration-1000 ${slide.boxBg}`}>
              <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] lg:w-[140px] lg:h-[140px]">
                <Image src="/images/about/Element3.webp" alt="Tech Integration" fill className="object-contain" />
              </div>
            </div>
            {/* Box 4 */}
            <div className={`w-[140px] h-[140px] sm:w-[170px] sm:h-[170px] md:w-[200px] md:h-[200px] lg:w-[248px] lg:h-[248px] rounded-[20px] sm:rounded-[25px] md:rounded-[30px] flex items-center justify-center hover:scale-105 transition-all duration-1000 ${slide.boxBg}`}>
              <div className="relative w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] lg:w-[140px] lg:h-[140px]">
                <Image src="/images/about/Element4.webp" alt="Community" fill className="object-contain" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Large Watermark Logo overlapping above and below */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-0 pointer-events-none">
          <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[700px] md:h-[700px] lg:w-[1000px] lg:h-[1000px] opacity-[0.3]">
            <Image
              src="/images/home/HOIPL_3DIndia.webp"
              alt="OURTH Watermark"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* ===== 4. OUR FOUNDER'S VISION ===== */}
      <section className="w-full py-10 sm:py-12 md:py-16 px-4 sm:px-6">
        <h2 className={`text-center font-bold text-2xl sm:text-3xl md:text-[36px] lg:text-[40px] leading-tight md:leading-[46px] font-['IBM_Plex_Sans'] mb-8 sm:mb-10 md:mb-12 transition-all duration-1000 ${slide.headingColor}`}>
          Our Founder&apos;s Vision
        </h2>

        <div className="max-w-[1437px] mx-auto flex flex-col lg:flex-row gap-6 sm:gap-8 items-stretch">
          {/* Founder Image */}
          <div className="w-full lg:w-[496px] h-[350px] sm:h-[450px] md:h-[520px] lg:h-[600px] relative rounded-[20px] sm:rounded-[25px] md:rounded-[30px] overflow-hidden flex-shrink-0 border border-black/10 shadow-lg">
            <Image
              src="/images/team/content.webp"
              alt="Founder"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 496px"
            />
          </div>

          {/* Vision Text */}
          <div className={`flex-grow rounded-[20px] sm:rounded-[25px] md:rounded-[30px] p-5 sm:p-6 md:p-8 lg:p-10 flex items-center transition-all duration-1000 ${slide.boxBg}`}>
            <p className={`font-medium text-sm sm:text-base md:text-lg lg:text-[24px] leading-relaxed sm:leading-relaxed md:leading-[34px] font-['IBM_Plex_Sans'] transition-all duration-1000 ${slide.textColor}`}>
              After spending nearly three decades working across global paper, plastic, packaging, nonwoven and recycling industries, I witnessed the environmental damage caused by single-use plastics firsthand.
              <br /><br />
              I realized that despite billions being invested in recycling and waste management, the core problem remained unchanged: we continued producing disposable products that were never designed for sustainability. Most sustainable alternatives were expensive and targeted only a small premium market.
              <br /><br />
              Millions of tea vendors, food stalls, temples, schools, and ordinary families were left with no practical, affordable option.
              <br /><br />
              Healing OURTH was founded to solve this gap.
            </p>
          </div>
        </div>

        {/* Statement Banner */}
        <div className={`max-w-[1437px] mx-auto mt-6 sm:mt-8 rounded-[20px] sm:rounded-[25px] md:rounded-[30px] flex items-center justify-center px-5 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-center transition-all duration-1000 ${slide.boxBg}`}>
          <p className={`font-bold text-sm sm:text-base md:text-lg lg:text-[24px] leading-relaxed sm:leading-relaxed md:leading-[34px] font-['IBM_Plex_Sans'] transition-all duration-1000 ${slide.textColor}`}>
            Replace single-use plastic at the source with affordable, scalable, truly sustainable alternatives while empowering businesses, communities, and governments to transition toward a circular economy.
          </p>
        </div>
      </section>

      {/* ===== 5. HOW ELSE YOU CAN HELP EARTH WITH? ===== */}
      <section className="w-full py-12">
        <div className="max-w-[1437px] mx-auto px-4 sm:px-6">
          <h2 className={`text-center font-bold text-2xl sm:text-3xl md:text-[36px] lg:text-[40px] leading-tight md:leading-[46px] font-['IBM_Plex_Sans'] mb-8 sm:mb-10 md:mb-12 transition-all duration-1000 ${slide.headingColor}`}>
            How else you can help earth with?
          </h2>
        </div>

        {/* Full-width container spanning edge-to-edge */}
        <div className="relative w-full overflow-hidden bg-white py-12 px-6 md:px-12 border-y border-black/10">
          {/* Full-width Background Image */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <Image src="/images/about/bgimg.webp" alt="Harit Bharat Background" fill className="object-cover" />
            {/* Lighter overlay (30% opacity) so the background image is clearly visible */}
            <div className="absolute inset-0 bg-[#FAF8F3]/30" />
          </div>

          {/* Centered text container */}
          <div className={`relative z-10 max-w-[1437px] mx-auto font-medium text-xs sm:text-sm md:text-base lg:text-[18px] leading-normal sm:leading-relaxed lg:leading-[28px] font-['IBM_Plex_Sans'] space-y-2 lg:space-y-3 transition-all duration-1000 ${slide.rightSloganColor}`}>
            <p className="text-sm sm:text-base md:text-lg lg:text-[22px] font-bold leading-normal lg:leading-[32px]">
              The Harit Bharat Movement is India&apos;s national push for environmental sustainability, deeply rooted in the country&apos;s National Action Plan on Climate Change (NAPCC).
            </p>

            <div className="border-t border-black/10 my-2" />

            <p className="font-bold lg:text-[20px]">The NAPCC Connection</p>
            <ul className="list-disc pl-4 sm:pl-6 space-y-1 lg:space-y-1.5">
              <li><strong>Core Foundation:</strong> The movement directly supports the NAPCC, which is India&apos;s master plan to combat climate change while maintaining economic growth.</li>
              <li><strong>Green India Mission (GIM):</strong> This is one of the eight core missions under the NAPCC. It serves as the primary engine for Harit Bharat by focusing on restoring degraded forests and increasing India&apos;s forest cover.</li>
              <li><strong>Carbon Sinks:</strong> Under the NAPCC framework, Harit Bharat initiatives help India meet its international climate goals by creating massive natural carbon sinks through afforestation.</li>
            </ul>

            <p className="font-bold lg:text-[20px] pt-1">Key Pillars</p>
            <ul className="list-disc pl-4 sm:pl-6 space-y-1 lg:space-y-1.5">
              <li><strong>Mass Afforestation:</strong> Scaling up tree-planting drives like the public &quot;Ek Ped Maa Ke Naam&quot; campaign to meet NAPCC forest targets.</li>
              <li><strong>Green Financing:</strong> Funding eco-friendly startups and landscape restoration through initiatives like the Harit Bharat Fund.</li>
              <li><strong>Clean Energy:</strong> Accelerating the shift to solar power, wind energy, and electric vehicles (EVs) in line with NAPCC&apos;s renewable energy goals.</li>
              <li><strong>Digital Tracking:</strong> Using the Harit-Sankalp platform to transparently track seeds and nursery management for national conservation.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== 6. OUR VISIONARY TEAM ===== */}
      <section className="w-full py-10 sm:py-12 md:py-16 px-4 sm:px-6">
        <h2 className={`text-center font-bold text-2xl sm:text-3xl md:text-[36px] lg:text-[40px] leading-tight md:leading-[46px] font-['IBM_Plex_Sans'] mb-10 sm:mb-12 md:mb-16 transition-all duration-1000 ${slide.headingColor}`}>
          Our Visionary Team
        </h2>

        {/* Team Grid */}
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 md:gap-10 lg:gap-12 justify-items-center mb-10 sm:mb-12 md:mb-16">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
              <div className="relative w-[110px] h-[130px] sm:w-[130px] sm:h-[150px] md:w-[150px] md:h-[170px] lg:w-[180px] lg:h-[200px] rounded-[20px] sm:rounded-[25px] md:rounded-[30px] overflow-hidden bg-white shadow-md border border-black/10">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-top hover:scale-105 transition-all duration-300"
                  sizes="(max-width: 640px) 110px, (max-width: 768px) 130px, (max-width: 1024px) 150px, 180px"
                />
              </div>
              <h3 className="font-bold text-[#2C1F13] text-xs sm:text-sm md:text-base font-['IBM_Plex_Sans']">{member.name}</h3>
            </div>
          ))}
        </div>

        {/* Join Us CTA */}
        <div className="max-w-[1400px] mx-auto flex justify-center sm:justify-end">
          <Link
            href="/contact"
            className={`w-[200px] sm:w-[240px] md:w-[274px] h-[50px] sm:h-[60px] md:h-[70px] rounded-[25px] sm:rounded-[30px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] flex items-center justify-between px-5 sm:px-6 md:px-8 hover:translate-y-[-2px] active:translate-y-0 transition-all duration-1000 ${slide.ctaBg}`}
          >
            <span className={`font-bold text-lg sm:text-xl md:text-[24px] font-['IBM_Plex_Sans'] transition-all duration-1000 ${slide.ctaText}`}>
              Join Us
            </span>
            <span className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center border border-black/10 shadow-sm">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#2B4D0E]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>
      </section>

    </main>
  );
}
