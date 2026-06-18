import Image from "next/image";
import Navbar from "@/app/(website)/_components/Navbar";
import Footer from "@/app/(website)/_components/Footer";
import fs from "fs";
import path from "path";

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
    text: "OURTH is a sustainability-driven ecosystem created to eliminate single-use plastic at the core through eco-friendly products, circular waste management, technology integration, and community participation.",
  },
  {
    title: "Objective",
    text: "Replace plastic disposables at a grassroots level with affordable, eco-friendly alternatives while integrating responsible disposal and waste collection systems.",
  },
  {
    title: "Mission",
    text: "To make sustainable living affordable, accessible, and practical for every household, business, vendor, and community while reducing plastic waste and landfill burden.",
  },
  {
    title: "Vision",
    text: "To build Bharat's leading circular economy ecosystem connecting consumers, businesses, waste management, and environmental impact through sustainable products and technology.",
  },
];

const team = [
  { name: "Pranay Bhargava", image: "/images/team/team-01.png", large: true },
  { name: "Riya Goyal", image: "/images/team/team-02.png" },
  { name: "Harshal Mathur", image: "/images/team/team-03.png" },
  { name: "Sahil Bhargava", image: "/images/team/team-04.png" },
  { name: "Arnav Rajput", image: "/images/team/team-05.png" },
  { name: "Rahul Gandhi", image: "/images/team/team-06.png" },
  { name: "Asteria Xing", image: "/images/team/team-07.png" },
];

export default function AboutPage() {
  // Read config dynamically at request time
  let config = {
    aboutTitle: "Eco-friendly, leaf-based tableware",
    aboutDescription: "Ourth is on a mission to eliminate single-use plastics from street food, catering, and home dining. By sourcing fallen leaves from local forests, we craft stunning, natural plates and bowls that are entirely home-compostable.",
    backgroundColor: "#D8EFE0"
  };
  try {
    const configPath = path.join(process.cwd(), "src/data/website-config.json");
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (e) {
    console.error("Failed to read dynamic website config in About", e);
  }

  return (
    <main style={{ background: config.backgroundColor }} className="relative">
      <Navbar />

      <section
        className="relative mx-auto overflow-hidden px-6 pb-20 pt-80"
        style={{ width: "1920px", height: "1080px", maxWidth: "100%" }}
      >
        {/* Top Left Image */}
        <div className="absolute left-0 top-0 w-[35%] max-w-[100%] h-[100%] pointer-events-none z-0 select-none hidden md:block">
          <Image
            src="/images/about/about_top.png"
            alt="About Graphic"
            fill
            className="object-contain object-left-top"
            priority
          />
        </div>
        <div
          className="absolute w-full max-w-[1580px] z-20"
          style={{ left: "280px", top: "250px" }}
        >
          <div className="max-w-[680px]">
            <h1
              style={{
                fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                fontSize: "64px",
                fontWeight: 800,
                lineHeight: "1.1",
                color: "#2C1F13",
              }}
            >
              {config.aboutTitle}
            </h1>

            <p
              className="mt-8"
              style={{
                fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif",
                fontSize: "22px",
                fontWeight: 500,
                lineHeight: "1.45",
                color: "#1B4F34",
              }}
            >
              {config.aboutDescription}
            </p>
          </div>
        </div>

        <div
          className="absolute overflow-hidden rounded-[24px]"
          style={{ left: "1002px", top: "213px", width: "639px", height: "577px" }}
        >
          <Image
            src="/images/about/hoipl-plate-starter.webp"
            alt="Leaf tableware"
            fill
            className="object-contain"
            sizes="639px"
          />
        </div>
      </section>

      <section
        className="relative px-6 py-80"
        style={{
          backgroundImage:
            "linear-gradient(rgba(4,18,10,0.74), rgba(4,18,10,0.74)), url('https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=1800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-10 lg:grid-cols-[380px_1fr]">
          <div className="rounded-[20px] bg-[#D8EFE0] p-2 shadow-xl">
            <div className="relative h-[480px] overflow-hidden rounded-[14px] bg-white">
              <Image
                src="/images/team/team-01.png"
                alt="Founder"
                fill
                className="object-cover"
                sizes="380px"
              />
            </div>
          </div>

          <div className="max-w-[720px]">
            <h2
              style={{
                fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                fontSize: "64px",
                fontWeight: 800,
                lineHeight: "0.95",
                color: "#F2D48A",
              }}
            >
              Green Man
              <br />
              of INDIA
            </h2>

            <p
              className="mt-8"
              style={{
                fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif",
                fontSize: "30px",
                fontWeight: 500,
                lineHeight: "1.45",
                color: "#D8EFE0",
              }}
            >
              Our founder watched his grandmother serve a feast on sal leaf
              plates handstitched with a thorn. By morning they had joined the
              soil. Decades later those plates are being replaced by styrofoam.
              Ourth was born to bring that ancient wisdom back - but scaled for
              modern vendors.
            </p>
          </div>
        </div>
      </section>

      <section className="min-h-[760px] px-6 py-20">
        <div className="mx-auto w-full max-w-[1510px]">
          <h3
            className="mb-12 text-center"
            style={{
              fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
              fontSize: "64px",
              fontWeight: 800,
              color: "#2C1F13",
              lineHeight: "1",
            }}
          >
            Our <span style={{ color: "#1A5C2E" }}>Core Values</span>
          </h3>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
            {coreValues.map((value) => (
              <div
                key={value}
                className="mx-auto flex h-[200px] w-[420px] items-center rounded-[18px] border bg-[#F2EFEC] px-6 py-7"
                style={{ boxShadow: "-8px 0px 0px #1A5C2E" }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif",
                    fontSize: "34px",
                    fontWeight: 500,
                    lineHeight: "1.2",
                    color: "#2C1F13",
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto w-full max-w-[1510px]">
          <h3
            className="mb-10 text-center"
            style={{
              fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
              fontSize: "64px",
              fontWeight: 800,
              color: "#2C1F13",
              lineHeight: "1",
            }}
          >
            What We Stand For
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {standFor.map((item, index) => (
              <div key={item.title} className="mx-auto w-[350.55px]">
                <div
                  className="h-[464.48px] w-[350.55px] rounded-[22px] border border-[#254E34] p-2"
                  style={{
                    backgroundImage:
                      index % 2 === 0
                        ? "url('https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=600&q=80')"
                        : "url('https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=600&q=80')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="h-full rounded-[16px] bg-[#F5F2EE] px-5 py-6">
                    <p
                      style={{
                        fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif",
                        fontSize: "22px",
                        fontWeight: 500,
                        lineHeight: "1.45",
                        color: "#2C1F13",
                      }}
                    >
                      {item.text}
                    </p>
                  </div>
                </div>

                <div
                  className="mt-3 rounded-[999px] text-center"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(200,150,60,0.8) 0%, rgba(242,212,138,0.85) 100%)",
                    border: "1px solid #B28A3F",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif",
                      fontSize: "34px",
                      fontWeight: 600,
                      color: "#2C1F13",
                      lineHeight: "1.2",
                      padding: "8px 16px",
                    }}
                  >
                    {item.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto w-full max-w-[1420px]">
          <h3
            className="mb-10 text-center"
            style={{
              fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
              fontSize: "64px",
              fontWeight: 800,
              color: "#2C1F13",
              lineHeight: "1",
            }}
          >
            Ourth Team
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
            {team.map((member) => (
              <div
                key={member.name}
                className={member.large ? "md:row-span-2 md:w-[344px]" : "md:w-[344px]"}
              >
                <div
                  className="rounded-[18px] p-2"
                  style={{
                    background: "#4B3627",
                    boxShadow: "0px 4px 4px rgba(0,0,0,0.18)",
                    width: member.large ? "344px" : "344px",
                    height: member.large ? "470px" : "220px",
                  }}
                >
                  <div
                    className="flex items-center gap-3 rounded-[14px] p-2"
                    style={{ background: member.large ? "rgba(255,255,255,0.92)" : "transparent" }}
                  >
                    <div
                      className="relative overflow-hidden rounded-[12px]"
                      style={{
                        width: member.large ? "293px" : "180px",
                        height: member.large ? "363px" : "200px",
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                        sizes={member.large ? "293px" : "180px"}
                      />
                    </div>
                    {!member.large && (
                      <p
                        style={{
                          fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif",
                          fontSize: "28px",
                          fontWeight: 600,
                          lineHeight: "1.2",
                          color: "#F5F1EB",
                        }}
                      >
                        {member.name}
                      </p>
                    )}
                  </div>

                  {member.large && (
                    <p
                      className="pb-2 pt-3 text-center"
                      style={{
                        fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif",
                        fontSize: "36px",
                        fontWeight: 600,
                        lineHeight: "1.2",
                        color: "#F5F1EB",
                      }}
                    >
                      {member.name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
