"use client";

export default function Journey() {
  const steps = [
    {
      id: 1,
      title: "Sustainable Materials",
      desc: "Our journey starts with 100% natural and renewable resources like fallen leaves and bamboo.",
      image: "/images/icon/icon1.webp"
    },
    {
      id: 2,
      title: "Eco-Friendly Products",
      desc: "We craft biodegradable plates, bowls, and cutlery that are safe for you and the planet.",
      image: "/images/icon/icon2.webp"
    },
    {
      id: 3,
      title: "Responsible Disposal",
      desc: "After use, simply dispose of our products in compost or organic waste bins.",
      image: "/images/icon/icon3.webp"
    },
    {
      id: 4,
      title: "Turning Waste to Fertilizer",
      desc: "The organic waste naturally breaks down, transforming into nutrient-rich compost and fertilizer.",
      image: "/images/icon/icon4.webp"
    },
    {
      id: 5,
      title: "Back to Nature",
      desc: "The fertilizer enriches the soil, fostering new leaves and bamboo, completing the sustainable cycle.",
      image: "/images/icon/icon5.webp"
    }
  ];

  /*
   * Layout extracted from Figma CSS (1920×5193 frame):
   *
   * Title "Our product's JOURNEY": centered, top: 1129
   * Globe HOIPL_3DIndia: 676×669 at (622, 1446)
   *
   * icon3 (top-center):  icon at (883, 1298) 155×155,  text at (1066, 1302)
   * icon2 (mid-left):    icon at (478, 1419) 155×155,  text at (230, 1419) right-aligned
   * icon4 (mid-right):   icon at (1284,1419) 155×155,  text at (1482,1432)
   * icon1 (lower-left):  icon at (285, 1729) 155×155,  text at (42, 1736) right-aligned
   * icon5 (lower-right): icon at (1448,1729) 155×155,  text at (1643,1736)
   *
   * Orbital container: y 1220–1920 → ~700px height
   * All X positions as % of 1920.
   * All Y positions as % of 700 (offset from 1220).
   */

  return (
    <section className="bg-[#FAF8F3] pt-16 pb-20 relative overflow-hidden">
      <div className="mx-auto max-w-[1920px] px-4">

        {/* Section Title */}
        <h2
          className="text-center text-4xl lg:text-[40px] font-bold text-[#2B4D0E] mb-4 tracking-tight"
          style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"
          }}
        >
          Our product&apos;s JOURNEY
        </h2>

        {/* ========== DESKTOP ORBITAL LAYOUT ========== */}
        <div className="hidden lg:block relative w-full" style={{ height: "850px" }}>

          {/* Central Globe — 676/1920 ≈ 35.2% width, vertically centred */}
          <div
            className="absolute left-1/2 -translate-x-1/2 z-10"
            style={{ top: "22%", width: "35.2%", maxWidth: "676px" }}
          >
            <img
              src="/images/home/HOIPL_3DIndia.webp"
              alt="Healing Ourth Globe"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* ---------- icon3 — Top Center ---------- */}
          {/* Figma: icon at x≈883 (46%), y offset 7% ; text to the right */}
          <div
            className="absolute flex flex-row items-center gap-4 z-20"
            style={{ left: "42%", top: "4%" }}
          >
            <img
              src={steps[2].image}
              alt={steps[2].title}
              className="w-[160px] h-[160px] object-contain flex-shrink-0"
            />
            <div className="text-left" style={{ maxWidth: "205px" }}>
              <p
                className="text-[20px] font-semibold text-black"
                style={{ lineHeight: "26px", fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[2].title}
              </p>
              <p
                className="text-[16px] font-normal text-black mt-1"
                style={{ lineHeight: "26px", fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[2].desc}
              </p>
            </div>
          </div>

          {/* ---------- icon2 — Middle Left ---------- */}
          {/* Figma: text right-aligned at x=230, icon at x=478, y offset ≈25% */}
          <div
            className="absolute flex flex-row-reverse items-center gap-4 z-20"
            style={{ left: "12%", top: "25%" }}
          >
            <img
              src={steps[1].image}
              alt={steps[1].title}
              className="w-[160px] h-[160px] object-contain flex-shrink-0"
            />
            <div className="text-right" style={{ maxWidth: "205px" }}>
              <p
                className="text-[20px] font-semibold text-black"
                style={{ lineHeight: "26px", fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[1].title}
              </p>
              <p
                className="text-[16px] font-normal text-black mt-1"
                style={{ lineHeight: "26px", fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[1].desc}
              </p>
            </div>
          </div>

          {/* ---------- icon4 — Middle Right ---------- */}
          {/* Figma: icon at x=1284 (66.9%), text at x=1482, y offset ≈25% */}
          <div
            className="absolute flex flex-row items-center gap-4 z-20"
            style={{ right: "10%", top: "25%" }}
          >
            <img
              src={steps[3].image}
              alt={steps[3].title}
              className="w-[160px] h-[160px] object-contain flex-shrink-0"
            />
            <div className="text-left" style={{ maxWidth: "205px" }}>
              <p
                className="text-[20px] font-semibold text-black"
                style={{ lineHeight: "26px", fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[3].title}
              </p>
              <p
                className="text-[16px] font-normal text-black mt-1"
                style={{ lineHeight: "26px", fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[3].desc}
              </p>
            </div>
          </div>

          {/* ---------- icon1 — Lower Left ---------- */}
          {/* Figma: text right-aligned at x=42, icon at x=285, y offset ≈69% */}
          <div
            className="absolute flex flex-row-reverse items-center gap-4 z-20"
            style={{ left: "2%", top: "68%" }}
          >
            <img
              src={steps[0].image}
              alt={steps[0].title}
              className="w-[160px] h-[160px] object-contain flex-shrink-0"
            />
            <div className="text-right" style={{ maxWidth: "205px" }}>
              <p
                className="text-[20px] font-semibold text-black"
                style={{ lineHeight: "26px", fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[0].title}
              </p>
              <p
                className="text-[16px] font-normal text-black mt-1"
                style={{ lineHeight: "26px", fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[0].desc}
              </p>
            </div>
          </div>

          {/* ---------- icon5 — Lower Right ---------- */}
          {/* Figma: icon at x=1448 (75.4%), text at x=1643, y offset ≈69% */}
          <div
            className="absolute flex flex-row items-center gap-4 z-20"
            style={{ right: "2%", top: "68%" }}
          >
            <img
              src={steps[4].image}
              alt={steps[4].title}
              className="w-[160px] h-[160px] object-contain flex-shrink-0"
            />
            <div className="text-left" style={{ maxWidth: "205px" }}>
              <p
                className="text-[20px] font-semibold text-black"
                style={{ lineHeight: "26px", fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[4].title}
              </p>
              <p
                className="text-[16px] font-normal text-black mt-1"
                style={{ lineHeight: "26px", fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[4].desc}
              </p>
            </div>
          </div>

        </div>

        {/* ========== MOBILE / TABLET LINEAR LAYOUT ========== */}
        <div className="lg:hidden grid grid-cols-1 gap-6 mt-8 w-full max-w-[500px] mx-auto">
          {/* Globe on mobile */}
          <div className="flex justify-center mb-4">
            <img
              src="/images/home/HOIPL_3DIndia.webp"
              alt="Healing Ourth Globe"
              className="w-[200px] h-[200px] object-contain"
            />
          </div>
          {steps.map((s) => (
            <div key={s.id} className="flex items-center gap-4 bg-white p-4 border border-black/10 rounded-xl shadow-sm">
              <div className="w-[90px] h-[90px] flex-shrink-0">
                <img src={s.image} alt={s.title} className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-base font-semibold text-black" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>{s.title}</p>
                <p className="text-sm text-gray-600 mt-0.5" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
