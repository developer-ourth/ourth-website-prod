export default function Hero() {
  return (
    <section
      className="relative flex items-start justify-center pb-0 overflow-visible"
      style={{
        minHeight: "1184px",
        width: "100%",
        backgroundImage: "url('/hero-bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        paddingTop: "142px",
      }}
    >
      {/* Floating glassmorphism card — 1580×900, radius 30 */}
      <div
        className="relative z-10 w-full mx-auto flex flex-col justify-center px-16 py-16"
        style={{
          maxWidth: "1580px",
          height: "900px",
          borderRadius: "30px",
          background: "rgba(237, 232, 220, 0.70)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          boxShadow:
            "0 12px 48px 0 rgba(44, 74, 26, 0.14), 0 2px 10px 0 rgba(44, 74, 26, 0.08)",
        }}
      >
        <div className="flex flex-col items-center gap-8 h-full justify-center md:flex-row md:items-center md:justify-between">
          {/* Left text */}
          <div className="relative z-10 max-w-[44rem] self-start md:ml-4 md:mt-[6rem]">
            <h1
              className="mb-12"
              style={{
                fontFamily: "var(--font-poppins), 'Poppins'",
                fontWeight: 800,
                fontSize: "72px",
                lineHeight: "62px",
                WebkitTextStroke: "1px #F2D48A",
              }}
            >
              <span style={{ color: "#2C1F13" }}>
                Dining
                <br />
                From the Earth,
              </span>
              <br />
              <span style={{ color: "#4A3728", fontStyle: "normal" }}>Back to Earth</span>
            </h1>

            <p
              className="mb-8"
              style={{
                fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans'",
                fontWeight: 700,
                fontSize: "24px",
                lineHeight: "38px",
                color: "#1A5C2E",
                maxWidth: "700px",
              }}
            >
              Ourth crafts bowls, plates and takeaway tableware entirely from
              natural leaves — giving vendors a beautiful, compostable
              alternative to plastic.
            </p>
          </div>

          {/* Right product visual */}
          <div className="relative flex-shrink-0">
            <div
              className="relative h-[360px] w-[320px] md:h-[560px] md:w-[640px]"
              style={{
                backgroundImage: "url('/images/hero/group-28.webp')",
                backgroundSize: "contain",
                backgroundPosition: "center 62%",
                backgroundRepeat: "no-repeat",
              }}
            >
              <img
                src="/images/hero/18-1.webp"
                alt="Leaf bowl"
                className="absolute left-[4%] top-[-15%] h-[100%] w-[100%] rounded-full object-cover"
                style={{ animation: "heroSingleImageLoop 8s ease-in-out infinite" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clouds pinned to hero bottom for reliable overlap */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 h-[200px] pointer-events-none"
        aria-hidden="true"
      >
        <img
          src="/clouds.png"
          alt=""
          className="block w-full h-auto -translate-y-[20%]"
        />
      </div>
    </section>
  );
}

