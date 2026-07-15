"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export interface StepItem {
  id: number;
  title: string;
  desc: string;
  image: string;
  badge: string;
  metrics: string[];
  detailDesc: string;
}

export default function Journey() {
  const [selectedStep, setSelectedStep] = useState<StepItem | null>(null);
  const [hoveredStepId, setHoveredStepId] = useState<number | null>(null);

  const steps: StepItem[] = [
    {
      id: 1,
      title: "Sustainable Materials",
      desc: "Our journey starts with 100% natural and renewable resources like fallen leaves and bamboo.",
      image: "/images/icon/icon1.webp",
      badge: "100% Tree-Free & Renewable",
      metrics: ["0 Trees Cut Down", "Naturally Shed Areca & Sal Leaves", "Sun-Dried & Sanitized Using UV & Steam"],
      detailDesc: "Instead of cutting down living forests or processing petroleum for plastics, we harvest naturally fallen leaves from Areca and Sal tree plantations across rural India. These leaves are collected by local farming cooperatives, washed in pure water, and heat-pressed into durable tableware without any chemicals, glues, or waxes."
    },
    {
      id: 2,
      title: "Eco-Friendly Products",
      desc: "We craft biodegradable plates, bowls, and cutlery that are safe for you and the planet.",
      image: "/images/icon/icon2.webp",
      badge: "Microwave & Freezer Safe",
      metrics: ["100% Leak & Grease Proof", "Handles 100°C Hot Curries & Soups", "Natural Woody Aroma & Sturdy Grip"],
      detailDesc: "Our tableware undergoes rigorous high-pressure heat molding to create dense, sturdy plates, bowls, and cutlery. They easily hold boiling hot Indian curries, soups, and heavy meals without bending, leaking, or imparting harmful microplastics into food."
    },
    {
      id: 3,
      title: "Responsible Disposal",
      desc: "After use, simply dispose of our products in compost or organic waste bins.",
      image: "/images/icon/icon3.webp",
      badge: "Effortless Zero-Waste Cleanup",
      metrics: ["No Special Sorting Required", "Throw Directly in Organic Bins", "Safe for Home & Industrial Compost"],
      detailDesc: "After enjoying a delicious meal, simply toss our tableware into any compost bin or organic garden waste. Unlike paper plates coated with hidden plastic films or PLA 'bioplastics' that require industrial heat facilities, OURTH tableware breaks down naturally anywhere."
    },
    {
      id: 4,
      title: "Turning Waste to Fertilizer",
      desc: "The organic waste naturally breaks down, transforming into nutrient-rich compost and fertilizer.",
      image: "/images/icon/icon4.webp",
      badge: "Rapid 60-Day Biodegradation",
      metrics: ["Decomposes in Just 45–60 Days", "Zero Toxic Residue or Microplastics", "Enriches Microbial Earth Activity"],
      detailDesc: "As soil microorganisms and earthworms break down the organic leaf fiber, the tableware transforms entirely into nutrient-dense humus. What started as food service residue becomes the building block for fertile farmland."
    },
    {
      id: 5,
      title: "Back to Nature",
      desc: "The fertilizer enriches the soil, fostering new leaves and bamboo, completing the sustainable cycle.",
      image: "/images/icon/icon5.webp",
      badge: "The Closed Regenerative Loop",
      metrics: ["Returns Carbon to the Earth", "Supports Rural Farming Ecosystems", "Completes the True Circular Economy"],
      detailDesc: "The newly formed organic fertilizer nourishes the surrounding soil and tree roots, fueling the growth of lush green foliage and new leaves. When the seasons turn, those leaves fall once more—ready to begin another sustainable OURTH journey."
    }
  ];

  return (
    <section className="bg-[#FAF8F3] pt-12 sm:pt-20 pb-8 sm:pb-12 relative overflow-x-clip overflow-y-visible z-30" suppressHydrationWarning>
      <div className="mx-auto max-w-[1920px] px-4">

        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-6 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2B4D0E]/10 border border-[#2B4D0E]/20 text-[#2B4D0E] font-semibold text-xs sm:text-sm mb-3">
            <span className="w-2 h-2 rounded-full bg-[#76A52E] animate-pulse" />
            Interactive Circular Journey — Click Any Step to Explore
          </div>
          <h2
            className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#2B4D0E] tracking-tight"
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              textShadow: "0px 4px 4px rgba(0, 0, 0, 0.15)"
            }}
          >
            Our Product&apos;s <span className="text-[#103F5E]">JOURNEY</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-[620px] mx-auto mt-2">
            A closed-loop, regenerative process where fallen leaves return to nourish the earth.
          </p>
        </motion.div>

        {/* ========== DESKTOP/LAPTOP ORBITAL LAYOUT ========== */}
        <div className="hidden lg:block relative w-full h-[620px] lg:h-[660px] xl:h-[720px] 2xl:h-[800px]">

          {/* Glowing SVG Orbit Lines Overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 1000 700"
            preserveAspectRatio="none"
          >
            <defs>
              <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#76A52E" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#76A52E" stopOpacity="0" />
              </radialGradient>
              <filter id="neonPulse" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Central Globe Background Glow */}
            <circle cx="500" cy="380" r="230" fill="url(#globeGlow)" />

            {/* Elliptical Orbit Track Base */}
            <ellipse
              cx="500"
              cy="380"
              rx="420"
              ry="240"
              fill="none"
              stroke="#2B4D0E"
              strokeWidth="1.5"
              strokeDasharray="8 6"
              strokeOpacity="0.25"
            />
            <ellipse
              cx="500"
              cy="380"
              rx="280"
              ry="160"
              fill="none"
              stroke="#103F5E"
              strokeWidth="1"
              strokeDasharray="4 6"
              strokeOpacity="0.2"
            />

            {/* Connection Lines from Center Earth (500, 380) to Each Step */}
            {/* Step 3: Top Center (500, 50) */}
            <path
              d="M 500,380 Q 500,215 500,50"
              fill="none"
              stroke={hoveredStepId === 3 || selectedStep?.id === 3 ? "#76A52E" : "#2B4D0E"}
              strokeWidth={hoveredStepId === 3 || selectedStep?.id === 3 ? "3.5" : "1.5"}
              strokeDasharray={hoveredStepId === 3 || selectedStep?.id === 3 ? "none" : "6 6"}
              strokeOpacity={hoveredStepId === 3 || selectedStep?.id === 3 ? "0.9" : "0.25"}
              filter={hoveredStepId === 3 || selectedStep?.id === 3 ? "url(#neonPulse)" : undefined}
              className="transition-all duration-300"
            />
            {/* Step 2: Upper Left (180, 200) */}
            <path
              d="M 500,380 Q 340,290 180,200"
              fill="none"
              stroke={hoveredStepId === 2 || selectedStep?.id === 2 ? "#103F5E" : "#103F5E"}
              strokeWidth={hoveredStepId === 2 || selectedStep?.id === 2 ? "3.5" : "1.5"}
              strokeDasharray={hoveredStepId === 2 || selectedStep?.id === 2 ? "none" : "6 6"}
              strokeOpacity={hoveredStepId === 2 || selectedStep?.id === 2 ? "0.9" : "0.25"}
              filter={hoveredStepId === 2 || selectedStep?.id === 2 ? "url(#neonPulse)" : undefined}
              className="transition-all duration-300"
            />
            {/* Step 4: Upper Right (820, 200) */}
            <path
              d="M 500,380 Q 660,290 820,200"
              fill="none"
              stroke={hoveredStepId === 4 || selectedStep?.id === 4 ? "#5E3A16" : "#5E3A16"}
              strokeWidth={hoveredStepId === 4 || selectedStep?.id === 4 ? "3.5" : "1.5"}
              strokeDasharray={hoveredStepId === 4 || selectedStep?.id === 4 ? "none" : "6 6"}
              strokeOpacity={hoveredStepId === 4 || selectedStep?.id === 4 ? "0.9" : "0.25"}
              filter={hoveredStepId === 4 || selectedStep?.id === 4 ? "url(#neonPulse)" : undefined}
              className="transition-all duration-300"
            />
            {/* Step 1: Lower Left (220, 530) */}
            <path
              d="M 500,380 Q 360,455 220,530"
              fill="none"
              stroke={hoveredStepId === 1 || selectedStep?.id === 1 ? "#76A52E" : "#2B4D0E"}
              strokeWidth={hoveredStepId === 1 || selectedStep?.id === 1 ? "3.5" : "1.5"}
              strokeDasharray={hoveredStepId === 1 || selectedStep?.id === 1 ? "none" : "6 6"}
              strokeOpacity={hoveredStepId === 1 || selectedStep?.id === 1 ? "0.9" : "0.25"}
              filter={hoveredStepId === 1 || selectedStep?.id === 1 ? "url(#neonPulse)" : undefined}
              className="transition-all duration-300"
            />
            {/* Step 5: Lower Right (780, 530) */}
            <path
              d="M 500,380 Q 640,455 780,530"
              fill="none"
              stroke={hoveredStepId === 5 || selectedStep?.id === 5 ? "#103F5E" : "#103F5E"}
              strokeWidth={hoveredStepId === 5 || selectedStep?.id === 5 ? "3.5" : "1.5"}
              strokeDasharray={hoveredStepId === 5 || selectedStep?.id === 5 ? "none" : "6 6"}
              strokeOpacity={hoveredStepId === 5 || selectedStep?.id === 5 ? "0.9" : "0.25"}
              filter={hoveredStepId === 5 || selectedStep?.id === 5 ? "url(#neonPulse)" : undefined}
              className="transition-all duration-300"
            />

            {/* Animated Energy Particles Travelling Along Orbits */}
            <circle r="5" fill="#76A52E" filter="url(#neonPulse)">
              <animateMotion
                path="M 500,140 A 280,160 0 1,1 499,140 Z"
                dur="12s"
                repeatCount="indefinite"
              />
            </circle>
            <circle r="6" fill="#103F5E" filter="url(#neonPulse)">
              <animateMotion
                path="M 500,620 A 420,240 0 1,1 499,620 Z"
                dur="18s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>

          {/* Central Globe — static centering container keeps Earth dead-center */}
          <div className="absolute inset-x-0 mx-auto top-[15%] z-10 w-[460px] lg:w-[520px] xl:w-[600px] 2xl:w-[660px] flex justify-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="w-full h-auto"
            >
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                <Image
                  src="/images/home/HOIPL_3DIndia.webp"
                  alt="Healing OURTH Globe"
                  width={676}
                  height={669}
                  className="w-full h-auto object-contain drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* ---------- icon3 — Top Center (Step 3: Responsible Disposal) ---------- */}
          <div className="absolute inset-x-0 mx-auto top-[1%] z-30 w-fit flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -4 }}
              onClick={() => setSelectedStep(steps[2])}
              onMouseEnter={() => setHoveredStepId(3)}
              onMouseLeave={() => setHoveredStepId(null)}
              className={`flex flex-row items-center gap-3 xl:gap-4 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-2xl border transition-all duration-300 shadow-md cursor-pointer ${
                hoveredStepId === 3 || selectedStep?.id === 3
                  ? "border-[#76A52E] ring-2 ring-[#76A52E]/40 shadow-xl shadow-[#76A52E]/10"
                  : "border-[#2B4D0E]/20 hover:border-[#76A52E]"
              }`}
            >
              <Image
                src={steps[2].image}
                alt={steps[2].title}
                width={160}
                height={160}
                className="w-[70px] h-[70px] xl:w-[85px] xl:h-[85px] 2xl:w-[100px] 2xl:h-[100px] object-contain flex-shrink-0"
              />
              <div className="text-left w-[160px] xl:w-[200px] 2xl:w-[230px]">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-[#2B4D0E]/10 text-[#2B4D0E]">Step 03</span>
                  <span className="text-[10px] text-gray-400 font-medium">Click to expand</span>
                </div>
                <p className="text-[16px] xl:text-[18px] 2xl:text-[20px] font-bold text-[#2B4D0E] leading-snug">
                  {steps[2].title}
                </p>
                <p className="text-[12px] xl:text-[13px] 2xl:text-[14px] font-normal text-gray-700 mt-1 leading-relaxed line-clamp-2">
                  {steps[2].desc}
                </p>
              </div>
            </motion.div>
          </div>

          {/* ---------- icon2 — Upper Left (Step 2: Eco-Friendly Products) ---------- */}
          <div className="absolute left-[2%] xl:left-[5%] 2xl:left-[9%] top-[24%] z-30">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              whileHover={{ scale: 1.05, x: -4 }}
              onClick={() => setSelectedStep(steps[1])}
              onMouseEnter={() => setHoveredStepId(2)}
              onMouseLeave={() => setHoveredStepId(null)}
              className={`flex flex-row-reverse items-center gap-3 xl:gap-4 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-2xl border transition-all duration-300 shadow-md cursor-pointer ${
                hoveredStepId === 2 || selectedStep?.id === 2
                  ? "border-[#103F5E] ring-2 ring-[#103F5E]/40 shadow-xl shadow-[#103F5E]/10"
                  : "border-[#2B4D0E]/20 hover:border-[#103F5E]"
              }`}
            >
              <Image
                src={steps[1].image}
                alt={steps[1].title}
                width={160}
                height={160}
                className="w-[70px] h-[70px] xl:w-[85px] xl:h-[85px] 2xl:w-[100px] 2xl:h-[100px] object-contain flex-shrink-0"
              />
              <div className="text-right w-[160px] xl:w-[200px] 2xl:w-[230px]">
                <div className="flex items-center justify-end gap-1.5 mb-0.5">
                  <span className="text-[10px] text-gray-400 font-medium">Click to expand</span>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-[#103F5E]/10 text-[#103F5E]">Step 02</span>
                </div>
                <p className="text-[16px] xl:text-[18px] 2xl:text-[20px] font-bold text-[#103F5E] leading-snug">
                  {steps[1].title}
                </p>
                <p className="text-[12px] xl:text-[13px] 2xl:text-[14px] font-normal text-gray-700 mt-1 leading-relaxed line-clamp-2">
                  {steps[1].desc}
                </p>
              </div>
            </motion.div>
          </div>

          {/* ---------- icon4 — Upper Right (Step 4: Turning Waste to Fertilizer) ---------- */}
          <div className="absolute right-[2%] xl:right-[5%] 2xl:right-[9%] top-[24%] z-30">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              whileHover={{ scale: 1.05, x: 4 }}
              onClick={() => setSelectedStep(steps[3])}
              onMouseEnter={() => setHoveredStepId(4)}
              onMouseLeave={() => setHoveredStepId(null)}
              className={`flex flex-row items-center gap-3 xl:gap-4 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-2xl border transition-all duration-300 shadow-md cursor-pointer ${
                hoveredStepId === 4 || selectedStep?.id === 4
                  ? "border-[#5E3A16] ring-2 ring-[#5E3A16]/40 shadow-xl shadow-[#5E3A16]/10"
                  : "border-[#2B4D0E]/20 hover:border-[#5E3A16]"
              }`}
            >
              <Image
                src={steps[3].image}
                alt={steps[3].title}
                width={160}
                height={160}
                className="w-[70px] h-[70px] xl:w-[85px] xl:h-[85px] 2xl:w-[100px] 2xl:h-[100px] object-contain flex-shrink-0"
              />
              <div className="text-left w-[160px] xl:w-[200px] 2xl:w-[230px]">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-[#5E3A16]/10 text-[#5E3A16]">Step 04</span>
                  <span className="text-[10px] text-gray-400 font-medium">Click to expand</span>
                </div>
                <p className="text-[16px] xl:text-[18px] 2xl:text-[20px] font-bold text-[#5E3A16] leading-snug">
                  {steps[3].title}
                </p>
                <p className="text-[12px] xl:text-[13px] 2xl:text-[14px] font-normal text-gray-700 mt-1 leading-relaxed line-clamp-2">
                  {steps[3].desc}
                </p>
              </div>
            </motion.div>
          </div>

          {/* ---------- icon1 — Lower Left (Step 1: Sustainable Materials) ---------- */}
          <div className="absolute left-[6%] xl:left-[10%] 2xl:left-[14%] top-[68%] z-30">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
              whileHover={{ scale: 1.05, y: -4 }}
              onClick={() => setSelectedStep(steps[0])}
              onMouseEnter={() => setHoveredStepId(1)}
              onMouseLeave={() => setHoveredStepId(null)}
              className={`flex flex-row-reverse items-center gap-3 xl:gap-4 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-2xl border transition-all duration-300 shadow-md cursor-pointer ${
                hoveredStepId === 1 || selectedStep?.id === 1
                  ? "border-[#76A52E] ring-2 ring-[#76A52E]/40 shadow-xl shadow-[#76A52E]/10"
                  : "border-[#2B4D0E]/20 hover:border-[#76A52E]"
              }`}
            >
              <Image
                src={steps[0].image}
                alt={steps[0].title}
                width={160}
                height={160}
                className="w-[70px] h-[70px] xl:w-[85px] xl:h-[85px] 2xl:w-[100px] 2xl:h-[100px] object-contain flex-shrink-0"
              />
              <div className="text-right w-[160px] xl:w-[200px] 2xl:w-[230px]">
                <div className="flex items-center justify-end gap-1.5 mb-0.5">
                  <span className="text-[10px] text-gray-400 font-medium">Click to expand</span>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-[#76A52E]/15 text-[#2B4D0E]">Step 01</span>
                </div>
                <p className="text-[16px] xl:text-[18px] 2xl:text-[20px] font-bold text-[#2B4D0E] leading-snug">
                  {steps[0].title}
                </p>
                <p className="text-[12px] xl:text-[13px] 2xl:text-[14px] font-normal text-gray-700 mt-1 leading-relaxed line-clamp-2">
                  {steps[0].desc}
                </p>
              </div>
            </motion.div>
          </div>

          {/* ---------- icon5 — Lower Right (Step 5: Back to Nature) ---------- */}
          <div className="absolute right-[6%] xl:right-[10%] 2xl:right-[14%] top-[68%] z-30">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.6 }}
              whileHover={{ scale: 1.05, y: -4 }}
              onClick={() => setSelectedStep(steps[4])}
              onMouseEnter={() => setHoveredStepId(5)}
              onMouseLeave={() => setHoveredStepId(null)}
              className={`flex flex-row items-center gap-3 xl:gap-4 bg-white/95 backdrop-blur-md px-5 py-3.5 rounded-2xl border transition-all duration-300 shadow-md cursor-pointer ${
                hoveredStepId === 5 || selectedStep?.id === 5
                  ? "border-[#103F5E] ring-2 ring-[#103F5E]/40 shadow-xl shadow-[#103F5E]/10"
                  : "border-[#2B4D0E]/20 hover:border-[#103F5E]"
              }`}
            >
              <Image
                src={steps[4].image}
                alt={steps[4].title}
                width={160}
                height={160}
                className="w-[70px] h-[70px] xl:w-[85px] xl:h-[85px] 2xl:w-[100px] 2xl:h-[100px] object-contain flex-shrink-0"
              />
              <div className="text-left w-[160px] xl:w-[200px] 2xl:w-[230px]">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-[#103F5E]/10 text-[#103F5E]">Step 05</span>
                  <span className="text-[10px] text-gray-400 font-medium">Click to expand</span>
                </div>
                <p className="text-[16px] xl:text-[18px] 2xl:text-[20px] font-bold text-[#103F5E] leading-snug">
                  {steps[4].title}
                </p>
                <p className="text-[12px] xl:text-[13px] 2xl:text-[14px] font-normal text-gray-700 mt-1 leading-relaxed line-clamp-2">
                  {steps[4].desc}
                </p>
              </div>
            </motion.div>
          </div>

        </div>

        {/* ========== MOBILE / TABLET LINEAR LAYOUT ========== */}
        <div className="lg:hidden flex flex-col gap-6 sm:gap-8 mt-4 sm:mt-8 w-full max-w-[1000px] mx-auto px-2 sm:px-4">
          {/* Globe on mobile/tablet */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex justify-center relative"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] rounded-full bg-[#76A52E]/15 blur-2xl" />
            </div>
            <Image
              src="/images/home/HOIPL_3DIndia.webp"
              alt="Healing OURTH Globe"
              width={240}
              height={240}
              className="relative z-10 w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] md:w-[260px] md:h-[260px] object-contain drop-shadow-md"
            />
          </motion.div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
            {steps.map((s, idx) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => setSelectedStep(s)}
                className="flex items-center gap-4 bg-white/95 backdrop-blur-sm p-4 sm:p-6 border border-[#2B4D0E]/15 rounded-2xl shadow-sm hover:shadow-md hover:border-[#76A52E] transition-all cursor-pointer group"
              >
                <div className="w-[65px] h-[65px] sm:w-[80px] sm:h-[80px] flex-shrink-0 bg-[#E8F0D8]/40 group-hover:bg-[#E8F0D8]/80 transition-colors rounded-xl p-2 flex items-center justify-center">
                  <Image src={s.image} alt={s.title} width={80} height={80} className="w-full h-full object-contain" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#2B4D0E]/10 text-[#2B4D0E]">Step 0{s.id}</span>
                    <span className="text-[11px] text-[#76A52E] font-medium group-hover:underline">Tap to view details →</span>
                  </div>
                  <p className="text-base sm:text-lg font-bold text-gray-900" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>{s.title}</p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed line-clamp-2" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* ========== INTERACTIVE STEP DETAILS MODAL ========== */}
      <AnimatePresence>
        {selectedStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStep(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative z-10 w-full max-w-2xl bg-white rounded-3xl border border-[#2B4D0E]/20 shadow-2xl overflow-hidden my-auto"
            >
              {/* Header Gradient Banner */}
              <div className="bg-gradient-to-r from-[#2B4D0E] via-[#1F3D0A] to-[#103F5E] px-6 py-5 sm:px-8 sm:py-6 text-white relative">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-white/20">
                    <span>Circular Step 0{selectedStep.id} of 05</span>
                  </div>
                  <button
                    onClick={() => setSelectedStep(null)}
                    aria-label="Close modal"
                    className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition text-white font-bold text-lg"
                  >
                    ✕
                  </button>
                </div>
                <h3
                  className="text-2xl sm:text-3xl font-bold mt-3 text-white tracking-tight"
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                >
                  {selectedStep.title}
                </h3>
                <p className="text-white/80 text-sm sm:text-base mt-1 font-medium">
                  {selectedStep.badge}
                </p>
              </div>

              {/* Modal Content Body */}
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-[#FAF8F3] border border-[#2B4D0E]/15 p-4 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <Image
                      src={selectedStep.image}
                      alt={selectedStep.title}
                      width={140}
                      height={140}
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                  </div>
                  <div className="flex-grow text-center sm:text-left">
                    <h4 className="text-sm uppercase tracking-wider font-bold text-[#76A52E] mb-2">
                      Deep Dive & Eco-Process
                    </h4>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                      {selectedStep.detailDesc}
                    </p>
                  </div>
                </div>

                {/* Key Metrics / Highlights Pills */}
                <div className="bg-[#FAF8F3] rounded-2xl p-5 border border-[#2B4D0E]/10 mb-6">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-[#2B4D0E] mb-3">
                    Why This Matters for Our Planet
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedStep.metrics.map((metric, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl p-3 border border-[#2B4D0E]/10 shadow-sm flex items-center gap-2.5"
                      >
                        <span className="w-2 h-2 rounded-full bg-[#76A52E] flex-shrink-0" />
                        <span className="text-xs font-semibold text-gray-800 leading-snug">
                          {metric}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation & Action Footer inside Modal */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                    <button
                      onClick={() => {
                        const prevId = selectedStep.id === 1 ? 5 : selectedStep.id - 1;
                        const prev = steps.find(s => s.id === prevId);
                        if (prev) setSelectedStep(prev);
                      }}
                      className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs sm:text-sm transition flex items-center gap-1.5"
                    >
                      ← Previous Step
                    </button>
                    <button
                      onClick={() => {
                        const nextId = selectedStep.id === 5 ? 1 : selectedStep.id + 1;
                        const next = steps.find(s => s.id === nextId);
                        if (next) setSelectedStep(next);
                      }}
                      className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs sm:text-sm transition flex items-center gap-1.5"
                    >
                      Next Step →
                    </button>
                  </div>

                  <a
                    href="#products"
                    onClick={() => setSelectedStep(null)}
                    className="w-full sm:w-auto text-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2B4D0E] to-[#76A52E] hover:from-[#1F3D0A] hover:to-[#628B23] text-white font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    Explore Products Made This Way →
                  </a>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
