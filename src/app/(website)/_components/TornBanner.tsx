"use client";

import Image from "next/image";

export default function TornBanner() {
  // torn.png natural dimensions ≈ 1456 × 820px
  // Breakdown of the image:
  //   - Top white paper:  ~20.7% of height
  //   - Top torn edge:    ~7.3%
  //   - Transparent gap:  ~37.8%
  //   - Bottom torn edge: ~7.3%
  //   - Bottom white:     ~26.8%
  // We only want to show: torn edges + gap = (7.3 + 37.8 + 7.3) = 52.4% of height
  // Full image height at 100vw = 56.3vw
  // Visible portion: 52.4% × 56.3vw = 29.5vw
  // Shift image up by top white area: 20.7% × 56.3vw = 11.65vw

  return (
    <section
      className="relative w-full"
      style={{
        // Increased height for more vertical space and breathing room
        height: "clamp(260px, 48vw, 680px)",
        overflow: "hidden",
        background: "#FAF8F3",
      }}
    >
      {/* Container with relative layout to let Next.js Image fill it */}
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

      {/* Text centered in the transparent gap, curved to follow the wave pattern using SVG textPath */}
      <div
        className="absolute inset-0 flex items-center justify-center px-4 md:px-16 text-center select-none pointer-events-none"
      >
        <svg viewBox="0 0 1440 320" className="w-full h-full max-h-[680px]">
          <path
            id="textPath-torn"
            fill="none"
            stroke="none"
            d="M 60,210 Q 380,155 720,165 T 1380,95"
          />
          <text
            className="fill-[#4E3629] font-black tracking-tight"
            style={{
              fontFamily: "var(--font-poppins), Poppins, sans-serif",
              fontSize: "clamp(20px, 4.4vw, 56px)",
              textAnchor: "middle",
              dominantBaseline: "middle"
            }}
          >
            <textPath href="#textPath-torn" startOffset="50%">
              Be the Generation That Changed Everything.
            </textPath>
          </text>
        </svg>
      </div>
    </section>
  );
}
