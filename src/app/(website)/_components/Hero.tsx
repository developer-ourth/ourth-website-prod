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
      {/* Hero container */}
      <div
        className="relative w-full flex flex-col xl:block overflow-hidden xl:h-[850px]"
        style={{ backgroundColor: "#E8F0D8" }}
      >
        {/* Earth globe */}
        <div
          className="absolute pointer-events-none z-[2] left-[-120px] top-[-50px] sm:left-[-200px] sm:top-[-150px] xl:left-[-400px] xl:top-[-390px]"
          style={{
            width: "clamp(550px, 85vw, 1650px)",
            height: "clamp(550px, 85vw, 1650px)",
          }}
        >
          <Image
            src="/images/hero/earth.png"
            alt="Earth Globe"
            fill
            className="object-contain opacity-40 xl:opacity-100"
            priority
            fetchPriority="high"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* 3D Product Model — sits on top on mobile/tablet, absolute-right on xl+ */}
        <div className="relative xl:absolute xl:right-0 xl:top-0 w-full xl:w-[55%] h-[40vh] sm:h-[45vh] md:h-[50vh] xl:h-full z-[5] mt-16 xl:mt-0 order-1 xl:order-none">
          <Hero3DCarousel />
        </div>

        {/* Left Column: Text & Value Triangle — below model on mobile/tablet, left side on xl+ */}
        <div className="relative z-[10] flex flex-col justify-center w-full xl:w-[50%] xl:h-full px-5 sm:px-10 xl:px-16 pt-6 pb-12 xl:py-0 order-2 xl:order-none mx-auto xl:mx-0 max-w-[600px] xl:max-w-[1000px] text-center xl:text-left">

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-bold mb-8 xl:mb-12"
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              color: "#103F5E",
              textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              fontSize: "clamp(1.5rem, 4.2vw, 80px)",
              lineHeight: "1.1",
              letterSpacing: "0%",
            }}
          >
            We don&apos;t make just
            <br className="hidden sm:block" />
            {" "}platters, we serve
            <br className="hidden sm:block" />
            {" "}our purpose
          </motion.h1>

          {/* Value Pills Triangle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center xl:items-start xl:pl-16 w-full mx-auto xl:mx-0 max-w-[460px] xl:max-w-[500px]"
          >
            {/* Purposeful */}
            <div className="flex justify-center w-full">
              <span
                className="px-5 sm:px-6 py-2 rounded-[30px] text-sm sm:text-base xl:text-[22px] font-bold tracking-wide flex items-center justify-center"
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  backgroundColor: "rgba(164, 204, 85, 0.2)",
                  color: "#2B4D0E",
                }}
              >
                Purposeful
              </span>
            </div>

            {/* Arrows */}
            <div className="flex justify-between items-center w-[55%] sm:w-[50%] mx-auto my-1 sm:my-2">
              {/* Arrow 1: Trustworthy → Purposeful (diagonal up-right) */}
              <svg viewBox="0 0 70 65" fill="none" className="w-[35px] sm:w-[50px] xl:w-[90px]">
                <defs>
                  <marker id="arrowUpRight" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8" fill="none" stroke="#000" strokeWidth="1.5" />
                  </marker>
                </defs>
                <line x1="10" y1="58" x2="55" y2="5" stroke="#000000" strokeWidth="2" markerEnd="url(#arrowUpRight)" />
              </svg>
              
              {/* Arrow 2: Purposeful → Transformative (diagonal down-right) */}
              <svg viewBox="0 0 70 65" fill="none" className="w-[35px] sm:w-[50px] xl:w-[90px]">
                <defs>
                  <marker id="arrowDownRight" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8" fill="none" stroke="#000" strokeWidth="1.5" />
                  </marker>
                </defs>
                <line x1="15" y1="5" x2="60" y2="58" stroke="#000000" strokeWidth="2" markerEnd="url(#arrowDownRight)" />
              </svg>
            </div>

            {/* Bottom row: Trustworthy <—— Transformative */}
            <div className="flex items-center justify-between w-full gap-1 sm:gap-3">
              {/* Trustworthy */}
              <span
                className="px-3 sm:px-5 py-2 rounded-[30px] text-[12px] sm:text-sm xl:text-[22px] font-bold tracking-wide flex items-center justify-center flex-shrink-0"
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  backgroundColor: "rgba(92, 182, 232, 0.2)",
                  color: "#103F5E",
                }}
              >
                Trustworthy
              </span>

              {/* Arrow 3: horizontal left */}
              <svg viewBox="0 0 90 20" fill="none" className="w-[30px] sm:w-[50px] xl:w-[100px] flex-shrink-0">
                <defs>
                  <marker id="arrowLeft" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8" fill="none" stroke="#000" strokeWidth="1.5" />
                  </marker>
                </defs>
                <line x1="80" y1="10" x2="10" y2="10" stroke="#000000" strokeWidth="2" markerEnd="url(#arrowLeft)" />
              </svg>

              {/* Transformative */}
              <span
                className="px-3 sm:px-5 py-2 rounded-[30px] text-[12px] sm:text-sm xl:text-[22px] font-bold tracking-wide flex items-center justify-center flex-shrink-0"
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  backgroundColor: "rgba(235, 179, 57, 0.2)",
                  color: "#5E3A16",
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

