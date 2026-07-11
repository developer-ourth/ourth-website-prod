"use client";

import Image from "next/image";

export default function TornBanner() {
  return (
    <section className="relative w-full bg-[#FAF8F3] overflow-hidden">

      {/* Desktop/Tablet: Show the torn paper image (768px+) */}
      <div
        className="hidden md:block relative w-full"
        style={{ height: "clamp(180px, 30vw, 680px)" }}
      >
        <div
          className="absolute left-0 w-full pointer-events-none select-none"
          style={{
            height: "clamp(460px, 62vw, 940px)",
            top: "clamp(-100px, -13vw, -200px)",
          }}
        >
          <Image
            src="/images/home/torn.webp"
            alt="Torn paper banner"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* Mobile: Clean text-only version (<768px) */}
      <div className="md:hidden py-8 px-6 text-center">
        <p
          className="text-xl sm:text-2xl font-black text-[#4E3629] tracking-tight"
          style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
        >
          Be the Generation That Changed Everything.
        </p>
      </div>

    </section>
  );
}

