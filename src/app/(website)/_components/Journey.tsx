"use client";
import Image from "next/image";

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

        {/* ========== DESKTOP/LAPTOP ORBITAL LAYOUT ========== */}
        <div className="hidden lg:block relative w-full h-[600px] xl:h-[720px] 2xl:h-[850px]">

          {/* Central Globe — 676/1920 ≈ 35.2% width, vertically centred */}
          <div
            className="absolute left-1/2 -translate-x-1/2 z-10 w-[26%] xl:w-[30%] 2xl:w-[35.2%] max-w-[676px]"
            style={{ top: "22%" }}
          >
            <Image
              src="/images/home/HOIPL_3DIndia.webp"
              alt="Healing OURTH Globe"
              width={676}
              height={669}
              className="w-full h-auto object-contain"
            />
          </div>

          {/* ---------- icon3 — Top Center ---------- */}
          <div
            className="absolute flex flex-row items-center gap-2 xl:gap-4 z-20 left-[34%] xl:left-[38%] 2xl:left-[42%] top-[4%]"
          >
            <Image
              src={steps[2].image}
              alt={steps[2].title}
              width={160}
              height={160}
              className="w-[90px] h-[90px] xl:w-[125px] xl:h-[125px] 2xl:w-[160px] 2xl:h-[160px] object-contain flex-shrink-0"
            />
            <div className="text-left w-[120px] xl:w-[170px] 2xl:w-[205px]">
              <p
                className="text-[14px] xl:text-[17px] 2xl:text-[20px] font-semibold text-black leading-snug"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[2].title}
              </p>
              <p
                className="text-[11px] xl:text-[13px] 2xl:text-[16px] font-normal text-black mt-1 leading-normal"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[2].desc}
              </p>
            </div>
          </div>

          {/* ---------- icon2 — Middle Left ---------- */}
          <div
            className="absolute flex flex-row-reverse items-center gap-2 xl:gap-4 z-20 left-[1%] xl:left-[6%] 2xl:left-[12%] top-[24%]"
          >
            <Image
              src={steps[1].image}
              alt={steps[1].title}
              width={160}
              height={160}
              className="w-[90px] h-[90px] xl:w-[125px] xl:h-[125px] 2xl:w-[160px] 2xl:h-[160px] object-contain flex-shrink-0"
            />
            <div className="text-right w-[120px] xl:w-[170px] 2xl:w-[205px]">
              <p
                className="text-[14px] xl:text-[17px] 2xl:text-[20px] font-semibold text-black leading-snug"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[1].title}
              </p>
              <p
                className="text-[11px] xl:text-[13px] 2xl:text-[16px] font-normal text-black mt-1 leading-normal"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[1].desc}
              </p>
            </div>
          </div>

          {/* ---------- icon4 — Middle Right ---------- */}
          <div
            className="absolute flex flex-row items-center gap-2 xl:gap-4 z-20 right-[1%] xl:right-[5%] 2xl:right-[10%] top-[24%]"
          >
            <Image
              src={steps[3].image}
              alt={steps[3].title}
              width={160}
              height={160}
              className="w-[90px] h-[90px] xl:w-[125px] xl:h-[125px] 2xl:w-[160px] 2xl:h-[160px] object-contain flex-shrink-0"
            />
            <div className="text-left w-[120px] xl:w-[170px] 2xl:w-[205px]">
              <p
                className="text-[14px] xl:text-[17px] 2xl:text-[20px] font-semibold text-black leading-snug"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[3].title}
              </p>
              <p
                className="text-[11px] xl:text-[13px] 2xl:text-[16px] font-normal text-black mt-1 leading-normal"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[3].desc}
              </p>
            </div>
          </div>

          {/* ---------- icon1 — Lower Left ---------- */}
          <div
            className="absolute flex flex-row-reverse items-center gap-2 xl:gap-4 z-20 left-0 xl:left-[1%] 2xl:left-[2%] top-[66%]"
          >
            <Image
              src={steps[0].image}
              alt={steps[0].title}
              width={160}
              height={160}
              className="w-[90px] h-[90px] xl:w-[125px] xl:h-[125px] 2xl:w-[160px] 2xl:h-[160px] object-contain flex-shrink-0"
            />
            <div className="text-right w-[120px] xl:w-[170px] 2xl:w-[205px]">
              <p
                className="text-[14px] xl:text-[17px] 2xl:text-[20px] font-semibold text-black leading-snug"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[0].title}
              </p>
              <p
                className="text-[11px] xl:text-[13px] 2xl:text-[16px] font-normal text-black mt-1 leading-normal"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[0].desc}
              </p>
            </div>
          </div>

          {/* ---------- icon5 — Lower Right ---------- */}
          <div
            className="absolute flex flex-row items-center gap-2 xl:gap-4 z-20 right-0 xl:right-[1%] 2xl:right-[2%] top-[66%]"
          >
            <Image
              src={steps[4].image}
              alt={steps[4].title}
              width={160}
              height={160}
              className="w-[90px] h-[90px] xl:w-[125px] xl:h-[125px] 2xl:w-[160px] 2xl:h-[160px] object-contain flex-shrink-0"
            />
            <div className="text-left w-[120px] xl:w-[170px] 2xl:w-[205px]">
              <p
                className="text-[14px] xl:text-[17px] 2xl:text-[20px] font-semibold text-black leading-snug"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[4].title}
              </p>
              <p
                className="text-[11px] xl:text-[13px] 2xl:text-[16px] font-normal text-black mt-1 leading-normal"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {steps[4].desc}
              </p>
            </div>
          </div>

        </div>

        {/* ========== MOBILE / TABLET LINEAR LAYOUT ========== */}
        <div className="lg:hidden flex flex-col gap-8 mt-8 w-full max-w-[1000px] mx-auto px-4">
          {/* Globe on mobile/tablet */}
          <div className="flex justify-center">
            <Image
              src="/images/home/HOIPL_3DIndia.webp"
              alt="Healing OURTH Globe"
              width={240}
              height={240}
              className="w-[200px] h-[200px] md:w-[240px] md:h-[240px] object-contain"
            />
          </div>
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {steps.map((s) => (
              <div key={s.id} className="flex items-center gap-4 bg-white p-5 border border-black/10 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-[80px] h-[80px] md:w-[90px] md:h-[90px] flex-shrink-0">
                  <Image src={s.image} alt={s.title} width={90} height={90} className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-base md:text-lg font-bold text-black" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>{s.title}</p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
