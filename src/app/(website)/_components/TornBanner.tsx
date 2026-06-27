"use client";

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
        // Only show the 52.4% of the image that contains the tears + gap
        height: "clamp(193px, 43.5vw, 623px)",
        overflow: "hidden",
        background: "#D8EFE0", // matches page background — shows in the transparent gap
      }}
    >
      {/* Full torn.png shifted up to crop the top white paper area */}
      <img
        src="/images/home/torn.png"
        alt="Torn paper banner"
        style={{
          position: "absolute",
          left: 0,
          width: "100%",
          height: "clamp(420px, 56.3vw, 880px)", // full image at natural aspect ratio
          top: "clamp(-80px, -11.65vw, -183px)", // shift up to clip top white paper
          objectFit: "fill",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />

      {/* Text centered in the transparent gap between the two torn edges */}
      <div
        className="absolute inset-0 flex items-center justify-center px-4 md:px-16 text-center"
      >
        <h2
          className="text-[#4E3629] text-3xl md:text-5xl lg:text-[60px] lg:leading-[70px] font-black tracking-tight drop-shadow-[0px_2px_4px_rgba(0,0,0,0.08)] max-w-5xl"
          style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
        >
          Be the Generation That Changed Everything.
        </h2>
      </div>
    </section>
  );
}
