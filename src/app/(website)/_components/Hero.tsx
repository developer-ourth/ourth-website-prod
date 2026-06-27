"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden border-b-[1.5px] border-black">
      {/* Background street scene */}
      <div
        className="relative w-full min-h-[550px] lg:h-[980px] bg-cover bg-center flex flex-col justify-end"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('/images/hero/hero.png')",
          backgroundColor: "#7c5835"
        }}
      >
        {/* Purpose Banner overlayed inside the background container at the bottom */}
        <div
          className="w-full py-8 px-4 border-t-[1.5px] border-black flex items-center justify-center text-center backdrop-blur-[12px] z-20"
          style={{
            backgroundColor: "rgba(27, 106, 158, 0.5)", // #1B6A9E on 50% opacity
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)" // Safari support
          }}
        >
          <h2
            className="text-4xl md:text-7xl lg:text-[128px] lg:leading-[128px] font-bold tracking-tight drop-shadow-[0px_4px_4px_rgba(0,0,0,0.15)] bg-clip-text text-transparent bg-gradient-to-b from-white/90 to-white/40"
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            We don't make platters, we serve our purpose
          </h2>
        </div>
      </div>
    </section>
  );
}
