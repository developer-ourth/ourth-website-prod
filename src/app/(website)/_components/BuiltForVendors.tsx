const features = [
  {
    title: "Completely Plastic-Free",
    desc: "From raw leaf to finished tableware—no plastic enters our process.",
  },
  {
    title: "Food-Safe, Heat-Resistant",
    desc: "Holds hot curries, biryanis and gravies. Trusted at weddings, dhabas and events.",
  },
  {
    title: "Vendor-First Logistics",
    desc: "Order in bulk, timely delivery anywhere in India.",
  },
];

const tags = ["Zero Plastic", "Premium", "Bulk Supply"];

export default function BuiltForVendors() {
  return (
    <section className="py-20" style={{ background: "#D8EFE0" }}>
      <div className="mx-auto max-w-[1580px] px-6">
        {/* Card */}
        <div
          className="mx-auto flex w-full max-w-[1371px] flex-col gap-10 overflow-hidden rounded-[30px] md:h-[900px] md:flex-row md:items-stretch"
          style={{
            background: "rgba(185, 197, 255, 0.2)",
            boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {/* Left — stacked product images */}
          <div className="flex flex-col gap-4 p-8 md:w-[38%] flex-shrink-0">
            <div
              className="w-full overflow-hidden rounded-[30px] flex-shrink-0 md:w-[489px]"
              style={{ height: "308px" }}
            >
              <img
                src="/images/home/image1.png"
                alt="Food served in leaf bowl"
                className="h-full w-full object-cover"
              />
            </div>
            <div
              className="w-full overflow-hidden rounded-[30px] flex-shrink-0 md:w-[489px]"
              style={{ height: "441px" }}
            >
              <img
                src="/images/home/image2.png"
                alt="Stack of leaf plates"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Right — content */}
          <div className="flex flex-col justify-center p-8 md:p-12 flex-1">
            <h2
              className="mb-6"
              style={{
                fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans'",
                fontWeight: 700,
                fontSize: "56px",
                lineHeight: "60px",
              }}
            >
              <span style={{ color: "#2C1F13" }}>Built for vendors</span>
              <br />
              <span style={{ color: "#1A5C2E", fontStyle: "italic" }}>who care</span>
            </h2>

            <div className="flex flex-col">
              {features.map((f, i) => (
                <div key={f.title}>
                  <div className="py-4">
                    <p
                      style={{
                        fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans'",
                        fontWeight: 500,
                        fontSize: "40px",
                        lineHeight: "60px",
                        color: "#2C1F13",
                      }}
                    >
                      {f.title}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: "32px",
                        lineHeight: "34px",
                        color: "#1A5C2E",
                      }}
                    >
                      {f.desc}
                    </p>
                  </div>
                  {i < features.length - 1 && (
                    <div style={{ height: "1px", background: "#000000", color: "#1A5C2E" }} />
                  )}
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center justify-center"
                  style={{
                    background: "rgba(138, 239, 242, 0.4)",
                    boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
                    borderRadius: "30px",
                    minWidth: "270px",
                    height: "54px",
                    fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: "32px",
                    lineHeight: "34px",
                    color: "#00013F",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

