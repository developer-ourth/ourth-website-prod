"use client";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden border-b-[1.5px] border-black">
      {/* Background street scene */}
      <div
        className="relative w-full h-[400px] sm:h-[500px] md:h-[700px] lg:h-[980px] bg-cover bg-center flex flex-col justify-end"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)), url('/images/hero/hero.webp')",
          backgroundColor: "#7c5835"
        }}
      >
        {/* Purpose Banner overlayed inside the background container at the bottom */}
        <div
          className="w-full py-4 sm:py-6 md:py-8 px-4 border-t-[1.5px] border-black flex items-center justify-center text-center backdrop-blur-[2px] z-20"
          style={{
            backgroundColor: "rgba(27, 106, 158, 0.5)", // #1B6A9E on 50% opacity
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)" // Safari support
          }}
        >
          <h2
            className="text-base sm:text-2xl md:text-4xl lg:text-[72px] xl:text-[100px] 2xl:text-[128px] leading-tight sm:leading-tight md:leading-normal lg:leading-[1.1] font-bold tracking-tight drop-shadow-[0px_4px_4px_rgba(0,0,0,0.15)] text-white/95"
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
