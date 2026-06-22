"use client";

export default function Hero() {
  const config = {
    heroTitleLine1: "Dining",
    heroTitleLine2: "From the Earth,",
    heroTitleLine3: "Back to Earth",
    heroDescription: "Ourth crafts bowls, plates and takeaway tableware entirely from natural leaves — giving vendors a beautiful, compostable alternative to plastic."
  };

  return (
    <section className="bg-transparent pt-12 pb-0 overflow-hidden relative">
      {/* Hero content grid */}
      <div className="mx-auto max-w-[1625px] px-4 lg:px-[52px] py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Text Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center items-start">
            {/* Badge capsule (Rectangle 138) */}
            <div
              className="inline-flex w-full max-w-[395px] h-[47px] items-center justify-center rounded-[30px] border-[1.5px] border-black bg-[#FAF8F3] text-lg lg:text-[24px] font-normal text-black mb-8 shadow-[1px_1px_0px_0px_#000000]"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              Decomposeable and Eco-friendly
            </div>

            {/* Title (Dining From the Earth, Back to Earth) */}
            <h1
              className="text-5xl md:text-6xl lg:text-[72px] lg:leading-[62px] font-bold mb-6 tracking-tight max-w-[700px]"
              style={{
                fontFamily: "var(--font-poppins), Poppins, sans-serif",
                textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)"
              }}
            >
              <span className="text-[#9C5F22]">{config.heroTitleLine1}</span> <br />
              <span className="text-[#9C5F22]">{config.heroTitleLine2}</span> <br />
              <span className="text-[#5E3A16]">{config.heroTitleLine3}</span>
            </h1>

            {/* Description (Ourth crafts bowls...) */}
            <p
              className="text-lg md:text-xl lg:text-[24px] font-bold text-[#103F5E] lg:leading-[38px] max-w-[700px] mb-8"
              style={{
                fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif"
              }}
            >
              {config.heroDescription}
            </p>
          </div>

          {/* Right Collage Column (7 cols) */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">

            {/* Desktop Collage (Figma layout: 3 columns, exact dimensions) */}
            <div className="hidden lg:flex gap-[12px] h-[466px] w-[736px] select-none">
              {/* Column 1: 321px width */}
              <div className="flex flex-col gap-[17px] w-[321px]">
                <div className="w-[321px] h-[249px] relative overflow-hidden rounded-[5px] shadow-[4px_4px_4px_2px_rgba(0,0,0,0.25)] bg-[#FAF8F3]">
                  <img
                    src="/images/home/image1.png"
                    alt="Food served in organic bowls"
                    className="w-full h-full object-cover rounded-[5px] border-[1.5px] border-black"
                  />
                </div>
                <div className="w-[321px] h-[200px] relative overflow-hidden rounded-[5px] shadow-[4px_4px_4px_2px_rgba(0,0,0,0.25)] bg-[#FAF8F3]">
                  <img
                    src="/images/home/image2.png"
                    alt="Crumpled plastic bottles trash"
                    className="w-full h-full object-cover rounded-[5px] border-[1.5px] border-black"
                  />
                </div>
              </div>

              {/* Column 2: 209px width */}
              <div className="w-[209px] h-[466px] relative overflow-hidden rounded-[5px] shadow-[4px_4px_4px_2px_rgba(0,0,0,0.25)] bg-[#FAF8F3]">
                <img
                  src="/images/home/image3.png"
                  alt="Landfill trash pile"
                  className="w-full h-full object-cover rounded-[5px] border-[1.5px] border-black"
                />
              </div>

              {/* Column 3: 206px width */}
              <div className="flex flex-col gap-[16px] w-[206px]">
                <div className="w-[206px] h-[186px] relative overflow-hidden rounded-[5px] shadow-[4px_4px_4px_2px_rgba(0,0,0,0.25)] bg-[#FAF8F3]">
                  <img
                    src="/images/home/image4.png"
                    alt="Overflowing green trash dumpsters"
                    className="w-full h-full object-cover rounded-[5px] border-[1.5px] border-black"
                  />
                </div>
                <div className="w-[206px] h-[263px] relative overflow-hidden rounded-[5px] shadow-[4px_4px_4px_2px_rgba(0,0,0,0.25)] bg-[#FAF8F3]">
                  <img
                    src="/images/home/image5.png"
                    alt="Crumpled cardboard and cups trash"
                    className="w-full h-full object-cover rounded-[5px] border-[1.5px] border-black"
                  />
                </div>
              </div>
            </div>

            {/* Mobile/Tablet Collage (Fluid) */}
            <div className="lg:hidden grid grid-cols-3 gap-3 h-[300px] md:h-[450px] w-full p-2">
              <div className="flex flex-col gap-3 h-full">
                <div className="flex-[5] relative overflow-hidden rounded-[5px] shadow-[4px_4px_4px_rgba(0,0,0,0.25)] border-[1.5px] border-black">
                  <img src="/images/home/image1.png" alt="Food" className="w-full h-full object-cover" />
                </div>
                <div className="flex-[4] relative overflow-hidden rounded-[5px] shadow-[4px_4px_4px_rgba(0,0,0,0.25)] border-[1.5px] border-black">
                  <img src="/images/home/image2.png" alt="Trash" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="relative overflow-hidden rounded-[5px] shadow-[4px_4px_4px_rgba(0,0,0,0.25)] border-[1.5px] border-black h-full">
                <img src="/images/home/image3.png" alt="Landfill" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-3 h-full">
                <div className="flex-[4] relative overflow-hidden rounded-[5px] shadow-[4px_4px_4px_rgba(0,0,0,0.25)] border-[1.5px] border-black">
                  <img src="/images/home/image4.png" alt="Bins" className="w-full h-full object-cover" />
                </div>
                <div className="flex-[5] relative overflow-hidden rounded-[5px] shadow-[4px_4px_4px_rgba(0,0,0,0.25)] border-[1.5px] border-black">
                  <img src="/images/home/image5.png" alt="Cardboard" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Infinite scrolling marquee ticker (Rectangle 139) */}
      <div className="w-full h-[62px] bg-[#EBB339] border-y-[1.5px] border-black flex items-center overflow-hidden select-none mt-12">
        <div className="flex whitespace-nowrap animate-marquee items-center">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-black font-semibold text-lg lg:text-[24px] uppercase tracking-wider flex items-center" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
              <span className="inline-block w-[15px] h-[15px] rounded-full bg-black flex-shrink-0 ml-[80px] mr-[24px]"></span>
              <span>DISPOSABLE</span>
              <span className="inline-block w-[15px] h-[15px] rounded-full bg-black flex-shrink-0 ml-[80px] mr-[24px]"></span>
              <span>MADE OF SUGARCANE FIBER</span>
              <span className="inline-block w-[15px] h-[15px] rounded-full bg-black flex-shrink-0 ml-[80px] mr-[24px]"></span>
              <span>STRONG</span>
              <span className="inline-block w-[15px] h-[15px] rounded-full bg-black flex-shrink-0 ml-[80px] mr-[24px]"></span>
              <span>DURABLE</span>
              <span className="inline-block w-[15px] h-[15px] rounded-full bg-black flex-shrink-0 ml-[80px] mr-[24px]"></span>
              <span>SAFE FOR HOT AND COLD FOODS</span>
              <span className="inline-block w-[15px] h-[15px] rounded-full bg-black flex-shrink-0 ml-[80px] mr-[24px]"></span>
              <span>LEAK-RESISTANT</span>
            </span>
          ))}
        </div>
      </div>

      {/* CSS injection for infinite marquee animation */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-16.666%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </section>
  );
}
