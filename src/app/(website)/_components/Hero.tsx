"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";

// Lazy load the 3D canvas to avoid blocking the main thread on initial load (huge performance boost)
const Hero3DCarousel = dynamic(() => import("./Hero3DCarousel"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center opacity-0"></div>,
});

export default function Hero() {

  return (
    <section className="relative w-full overflow-hidden">
      {/* Hero container — Figma: 1923×1081, bg #E8F0D8 */}
      <div
        className="relative w-full h-[520px] sm:h-[580px] md:h-[650px] lg:h-[850px]"
        style={{ backgroundColor: "#E8F0D8" }}
      >
        {/* Earth globe — Figma: 1709×1709, left: -426, top: -407 */}
        <div
          className="absolute pointer-events-none z-[2]"
          style={{
            width: "clamp(600px, 85vw, 1650px)",
            height: "clamp(600px, 85vw, 1650px)",
            left: "clamp(-300px, -21vw, -400px)",
            top: "clamp(-280px, -20vw, -390px)",
          }}
        >
          <Image
            src="/images/hero/earth.png"
            alt="Earth Globe"
            fill
            className="object-contain"
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* 3D Product Model - right side */}
        <div className="absolute right-0 top-0 w-[50%] md:w-[55%] lg:w-[55%] h-full z-[5]">
          <Hero3DCarousel />
        </div>

        {/* Left Column: Text & Value Triangle */}
        <div className="relative z-[10] flex flex-col justify-center h-full px-6 sm:px-10 lg:px-16 max-w-[1000px]">

          {/* Headline — Figma: IBM Plex Sans, 700, 80px, color #103F5E, text-shadow */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-bold mb-8 lg:mb-12"
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              color: "#103F5E",
              textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              fontSize: "clamp(2rem, 4.2vw, 80px)",
              lineHeight: "1",
              letterSpacing: "0%",
            }}
          >
            We don&apos;t make just
            <br />
            platters, we serve
            <br />
            our purpose
          </motion.h1>

          {/* Value Pills Triangle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col items-start gap-0"
          >
            {/* Purposeful — Figma: bg rgba(164,204,85,0.2), color #2B4D0E */}
            <div className="flex items-center justify-center ml-20 sm:ml-28 lg:ml-40 mb-0">
              <span
                className="px-6 sm:px-8 py-2 sm:py-3 rounded-[30px] text-sm sm:text-lg lg:text-[22px] font-bold tracking-wide flex items-center justify-center"
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  backgroundColor: "rgba(164, 204, 85, 0.2)",
                  color: "#2B4D0E",
                  minWidth: "180px",
                }}
              >
                Purposeful
              </span>
            </div>

            {/* Arrows — Clockwise Cycle */}
            <div className="flex items-center ml-8 sm:ml-14 lg:ml-28 my-1">
              {/* Arrow 1: Trustworthy → Purposeful (diagonal up-right) */}
              <svg width="60" height="55" viewBox="0 0 70 65" fill="none" className="sm:w-[75px] sm:h-[68px] lg:w-[90px] lg:h-[80px]">
                <defs>
                  <marker id="arrowUpRight" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8" fill="none" stroke="#000" strokeWidth="1.5" />
                  </marker>
                </defs>
                <line x1="10" y1="58" x2="55" y2="5" stroke="#000000" strokeWidth="2" markerEnd="url(#arrowUpRight)" />
              </svg>
              <div className="w-8 sm:w-14 lg:w-20" />
              {/* Arrow 2: Purposeful → Transformative (diagonal down-right) */}
              <svg width="60" height="55" viewBox="0 0 70 65" fill="none" className="sm:w-[75px] sm:h-[68px] lg:w-[90px] lg:h-[80px]">
                <defs>
                  <marker id="arrowDownRight" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8" fill="none" stroke="#000" strokeWidth="1.5" />
                  </marker>
                </defs>
                <line x1="15" y1="5" x2="60" y2="58" stroke="#000000" strokeWidth="2" markerEnd="url(#arrowDownRight)" />
              </svg>
            </div>

            {/* Bottom row: Trustworthy <—— Transformative */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Trustworthy — Figma: bg rgba(92,182,232,0.2), color #103F5E */}
              <span
                className="px-5 sm:px-8 py-2 sm:py-3 rounded-[30px] text-sm sm:text-lg lg:text-[22px] font-bold tracking-wide flex items-center justify-center"
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  backgroundColor: "rgba(92, 182, 232, 0.2)",
                  color: "#103F5E",
                  minWidth: "170px",
                }}
              >
                Trustworthy
              </span>

              {/* Arrow 3: horizontal left — Transformative → Trustworthy */}
              <svg width="70" height="20" viewBox="0 0 90 20" fill="none" className="sm:w-[90px] lg:w-[126px]">
                <defs>
                  <marker id="arrowLeft" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8" fill="none" stroke="#000" strokeWidth="1.5" />
                  </marker>
                </defs>
                <line x1="80" y1="10" x2="10" y2="10" stroke="#000000" strokeWidth="2" markerEnd="url(#arrowLeft)" />
              </svg>

              {/* Transformative — Figma: bg rgba(235,179,57,0.2), color #5E3A16 */}
              <span
                className="px-5 sm:px-8 py-2 sm:py-3 rounded-[30px] text-sm sm:text-lg lg:text-[22px] font-bold tracking-wide flex items-center justify-center"
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  backgroundColor: "rgba(235, 179, 57, 0.2)",
                  color: "#5E3A16",
                  minWidth: "170px",
                }}
              >
                Transformative
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
