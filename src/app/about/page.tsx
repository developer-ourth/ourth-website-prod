import Image from "next/image";

const coreValues = [
  "Every small choice matters",
  "Replace plastic at the source",
  "Sustainable living made practical",
  "Eco-friendly can be affordable",
  "Every purchase creates environmental impact",
  "From usage to responsible disposal",
];

const standFor = [
  {
    title: "About OURTH",
    text: "OURTH is a sustainability-driven ecosystem created to eliminate single-use plastic at the core through eco-friendly products, circular waste management, technology integration, and community participation. Healing OURTH India Pvt. Ltd. is building not just a product company, but a long-term environmental movement focused on clean, green, healthy, and responsible living.",
  },
  {
    title: "Objective",
    text: "Replace plastic disposables at the grassroots level with affordable eco-friendly alternatives while integrating responsible disposal and waste collection systems.",
  },
  {
    title: "Mission",
    text: "To make sustainable living affordable, accessible, and practical for every household, business, vendor, and community while reducing plastic waste and landfill burden.",
  },
  {
    title: "Vision",
    text: "To build Bharat’s leading circular economy ecosystem connecting consumers, businesses, waste management, and environmental impact through sustainable products and technology.",
  },
];

const teamLandscape = [
  { name: "Riya Goyal", image: "/images/team/team-02.png" },
  { name: "Arnav Rajput", image: "/images/team/team-05.png" },
  { name: "Harshal Mathur", image: "/images/team/team-03.png" },
  { name: "Rahul Gandhi", image: "/images/team/team-06.png" },
  { name: "Sahil Bhargava", image: "/images/team/team-04.png" },
  { name: "Asteria Xing", image: "/images/team/team-07.png" },
];

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-[#FBEFC9] overflow-x-hidden pt-[18px]">

      {/* 1. Where Leaves Become Legacy */}
      <section className="mx-auto max-w-[1625px] px-6 lg:px-[146px] pt-16 lg:pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          {/* Left Text content */}
          <div className="lg:col-span-7 space-y-8">
            <h1
              className="text-[#5E3A16] font-bold text-5xl md:text-6xl lg:text-[72px] lg:leading-[78px] tracking-tight"
              style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
            >
              Where Leaves <br className="hidden md:inline" />
              Become Legacy
            </h1>
            <p
              className="text-[#2B4D0E] text-xl md:text-[24px] leading-[38px] font-bold"
              style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            >
              We believe every meal served on a leaf is a vote for a cleaner
              planet. A quiet act of choosing earth over plastic, tradition over
              convenience, conscience over habit. One plate at a time, vendors
              across India are rewriting the story of single-use. And the earth is
              listening.
            </p>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative w-full max-w-[639px] aspect-[639/577] rounded-[5px] border-[1.5px] border-black bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25)] overflow-hidden hover:translate-y-[-2px] transition-all duration-300">
              <Image
                src="/images/about/hoipl-plate-starter.webp"
                alt="Leaf tableware plates stack"
                fill
                className="object-cover"
                sizes="(max-w-[1024px]) 100vw, 639px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Green Man of INDIA */}
      <section className="mx-auto max-w-[1625px] px-6 lg:px-[146px] py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-[71px] items-stretch justify-center">

          {/* Left card: Founder Image */}
          <div className="w-full lg:w-[504px] flex flex-col justify-center">
            <div className="relative w-full aspect-[504/623] rounded-[5px] border-[1.5px] border-black bg-white overflow-hidden shadow-[4px_4px_0px_#000000]">
              <Image
                src="/images/team/content.png"
                alt="Founder of Ourth"
                fill
                className="object-cover object-top"
                sizes="(max-w-[1024px]) 100vw, 504px"
              />
            </div>
          </div>

          {/* Right card: Text Container (Rectangle 203) */}
          <div className="w-full lg:w-[771px] flex flex-col">
            <div className="h-full rounded-[5px] border-[1.5px] border-black bg-[#C7E08E] p-8 lg:p-12 shadow-[4px_4px_0px_#000000] flex flex-col justify-center space-y-6">
              <h2
                className="text-black font-bold text-4xl md:text-[56px] leading-[62px]"
                style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
              >
                Green Man <br className="hidden md:inline" />
                of INDIA
              </h2>
              <p
                className="text-[#2B4D0E] text-xl md:text-[24px] leading-[38px] font-bold"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                Our founder watched his grandmother serve a feast on sal leaf
                plates handstitched with a thorn. By morning they had joined the
                soil. <br />
                <br />
                Decades later those plates are being replaced by styrofoam. Ourth
                was born to bring that ancient wisdom back — but scaled for modern
                vendors.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Our Core Values */}
      <section className="mx-auto max-w-[1625px] px-6 lg:px-[146px] py-16">
        <h2
          className="text-[#5E3A16] text-center text-4xl md:text-[56px] leading-[62px] font-bold mb-16"
          style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
        >
          Our Core Values
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-[80px] justify-items-center">
          {coreValues.map((value, idx) => (
            <div
              key={idx}
              className="w-full max-w-[420px] h-[200px] rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] p-8 flex items-center justify-center shadow-[4px_4px_0px_#000000] hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_#000000] transition-all duration-300"
            >
              <p
                className="text-[#2C1F13] text-2xl md:text-[32px] leading-[34px] font-medium"
                style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. What We Stand For */}
      <section className="mx-auto max-w-[1625px] px-6 lg:px-[146px] py-16">
        <h2
          className="text-[#2C1F13] text-center text-4xl md:text-[56px] leading-[62px] font-bold mb-20"
          style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
        >
          What We Stand For
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8 justify-items-center">
          {standFor.map((item, idx) => (
            <div key={idx} className="w-full max-w-[320px] relative flex flex-col items-center group mb-12">

              {/* Card Container (Rectangle 91-94) */}
              <div className="w-full min-h-[460px] pb-16 rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] p-6 flex items-center justify-center text-center shadow-[4px_4px_0px_#000000] group-hover:translate-y-[-4px] group-hover:shadow-[6px_6px_0px_#000000] transition-all duration-300">
                <p
                  className="text-[#2C1F13] text-[16px] leading-[28px] font-medium"
                  style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
                >
                  {item.text}
                </p>
              </div>

              {/* Pill Container (Rectangle 95-98) & Pill Text Label */}
              <div className="absolute bottom-[-20px] w-[90%] sm:w-[280px] h-[40px] bg-[#EBB339] border-[1.5px] border-black rounded-[30px] shadow-[2px_2px_0px_#000000]" />

              <div
                className="absolute bottom-[-25px] w-[90%] sm:w-[280px] h-[50px] flex items-center justify-center text-center font-medium text-xl sm:text-[24px] leading-[34px] text-[#2C1F13]"
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
              >
                {item.title}
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* 5. Ourth Team */}
      <section className="mx-auto max-w-[1625px] px-6 lg:px-[146px] py-20 mb-16">
        <h2
          className="text-[#2C1F13] text-center text-4xl md:text-[56px] leading-[62px] font-bold mb-20"
          style={{ fontFamily: "var(--font-poppins), Poppins, sans-serif" }}
        >
          Ourth Team
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left Column: Pranay Bhargava (Large Card - Rectangle 99) */}
          <div className="lg:col-span-4 flex justify-center w-full">
            <div className="w-full max-w-[344px] h-[470px] rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] p-6 flex flex-col justify-between shadow-[4px_4px_0px_#000000] hover:translate-y-[-2px] transition-all duration-300">

              {/* Image 14 */}
              <div className="relative w-full aspect-[293/363] rounded-[5px] border-[1.5px] border-black overflow-hidden bg-white">
                <Image
                  src="/images/team/team-01.png"
                  alt="Pranay Bhargava"
                  fill
                  className="object-cover object-top"
                  sizes="293px"
                />
              </div>

              {/* Name Text */}
              <div
                className="w-full text-center font-medium text-[32px] leading-[34px] text-black"
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                }}
              >
                Pranay Bhargava
              </div>
            </div>
          </div>

          {/* Right Column: Other Team Members Landscape Grid (3 cols x 2 rows) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
            {teamLandscape.map((member, idx) => (
              <div
                key={idx}
                className="w-full max-w-[344px] h-[220px] rounded-[5px] border-[1.5px] border-black bg-[#FAF8F3] p-4 flex items-center gap-4 shadow-[4px_4px_0px_#000000] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_#000000] transition-all duration-300 relative"
              >
                {/* Image (Rectangle 106-111) */}
                <div className="relative w-[140px] h-[188px] rounded-[5px] border-[1.5px] border-black overflow-hidden bg-white flex-shrink-0">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    sizes="140px"
                  />
                </div>

                {/* Name */}
                <div
                  className="font-medium text-lg sm:text-[22px] leading-[28px] text-black text-left flex-grow flex items-center"
                  style={{
                    fontFamily: "'IBM Plex Sans', sans-serif",
                    textShadow: "0px 2px 2px rgba(0, 0, 0, 0.15)",
                  }}
                >
                  {member.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
