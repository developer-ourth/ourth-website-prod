export default function NaturesAnswer() {
  return (
    <section
      className="relative z-10 pt-16 pb-20"
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #D8EFE0 100%)",
      }}
    >
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-12 text-center">
          <h2
            className="mb-4"
            style={{
              fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans'",
              fontWeight: 700,
              fontSize: "56px",
              lineHeight: "60px",
            }}
          >
            <span style={{ color: "#2C1F13" }}>Nature&apos;s answer to</span>
            <br />
            <span style={{ color: "#1A5C2E", fontStyle: "italic" }}>single-use plastic</span>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif",
              fontWeight: 400,
              fontSize: "24px",
              lineHeight: "32px",
              color: "#2E7D44",
            }}
          >
            Ourth was born from a simple question: what if the leaves beneath our feet could feed the world without harming it?
          </p>
        </div>

        {/* Image collage — Figma layout: 1 large left + stacked pair + 2 tall columns */}
        <div className="flex gap-4" style={{ height: "400px" }}>
          {/* Large left image */}
          <div className="overflow-hidden rounded-[30px] flex-shrink-0" style={{ width: "44%" }}>
            <img
              src="/images/home/image5.png"
              alt="Traditional Indian food served in leaf bowls"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Stacked pair */}
          <div className="flex flex-col gap-4 flex-shrink-0" style={{ width: "22%" }}>
            <div className="overflow-hidden rounded-[30px] flex-1" style={{}}>
              <img
                src="/images/home/image6.png"
                alt="Plastic bottles waste"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-[30px]" style={{ height: "34%", }}>
              <img
                src="/images/home/image7.png"
                alt="Plastic waste"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          {/* Col 3 */}
          <div className="overflow-hidden rounded-[30px] flex-1" style={{}}>
            <img
              src="/images/home/image8.png"
              alt="Natural leaves"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Col 4 */}
          <div className="overflow-hidden rounded-[30px] flex-1" style={{}}>
            <img
              src="/images/home/image9.png"
              alt="Eco tableware"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
