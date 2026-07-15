"use client";

import Image from "next/image";

export default function TornBanner() {
  return (
    <section className="relative w-full bg-[#FAF8F3] overflow-x-clip overflow-y-visible -mt-6 md:-mt-12 xl:-mt-20 z-20">

      {/* Desktop/Tablet: Show the cropped torn paper image (768px+) */}
      <div className="hidden md:block relative w-full pointer-events-none select-none">
        <Image
          src="/images/home/torn1.webp"
          alt="Torn paper banner"
          width={1920}
          height={450}
          className="w-full h-auto object-contain"
          sizes="100vw"
          priority
        />
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

