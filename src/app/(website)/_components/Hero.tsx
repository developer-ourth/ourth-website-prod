"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden border-b-[1.5px] border-black mt-[70px] lg:mt-[80px] xl:mt-[95px]">
      {/* Background street scene */}
      <div
        className="relative w-full h-[260px] sm:h-[500px] md:h-[700px] lg:h-[980px] bg-cover bg-center flex flex-col justify-end"
        style={{
          backgroundImage: "url('/images/hero/HOME.png')",
          backgroundColor: "#7c5835"
        }}
      >
        {/* Purpose Banner overlayed inside the background container at the bottom */}
        <div
          className="w-full py-3 sm:py-4 md:py-5 lg:py-6 px-4 border-t-[1.5px] border-black flex items-center justify-center text-center backdrop-blur-[2px] z-20 relative"
          style={{
            backgroundColor: "rgba(27, 106, 158, 0.5)", // #1B6A9E on 50% opacity
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)" // Safari support
          }}
        >
          <h2
            className="text-base sm:text-xl md:text-3xl lg:text-5xl xl:text-6xl 2xl:text-[80px] leading-tight font-bold tracking-tight drop-shadow-[0px_4px_4px_rgba(0,0,0,0.15)] text-white/95"
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif"
            }}
          >
            We don&apos;t make platters, we serve our purpose
          </h2>
        </div>
      </div>
    </section>
  );
}

