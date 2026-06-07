export default function NaturesAnswer() {
  const images = [
    {
      src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80",
      alt: "Traditional Indian food in leaf bowls",
      className: "col-span-2 row-span-2",
    },
    {
      src: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=300&q=80",
      alt: "Leaf packaging material",
      className: "col-span-1 row-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
      alt: "Natural leaves",
      className: "col-span-1 row-span-1",
    },
    {
      src: "https://images.unsplash.com/photo-1582560475093-ba66accbc095?w=300&q=80",
      alt: "Eco-friendly tableware",
      className: "col-span-1 row-span-1",
    },
  ];

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
          <div className="overflow-hidden rounded-[30px] flex-shrink-0" style={{ width: "44%", boxShadow: "0px 4px 4px 2px rgba(0,0,0,0.25)" }}>
            <img
              src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=700&q=80"
              alt="Traditional Indian food served in leaf bowls"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Stacked pair */}
          <div className="flex flex-col gap-4 flex-shrink-0" style={{ width: "22%" }}>
            <div className="overflow-hidden rounded-[30px] flex-1" style={{ boxShadow: "0px 4px 4px 2px rgba(0,0,0,0.25)" }}>
              <img
                src="https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400&q=80"
                alt="Plastic bottles waste"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="overflow-hidden rounded-[30px]" style={{ height: "34%", boxShadow: "0px 4px 4px 2px rgba(0,0,0,0.25)" }}>
              <img
                src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&q=80"
                alt="Plastic waste"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          {/* Col 3 */}
          <div className="overflow-hidden rounded-[30px] flex-1" style={{ boxShadow: "0px 4px 4px 2px rgba(0,0,0,0.25)" }}>
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80"
              alt="Natural leaves"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Col 4 */}
          <div className="overflow-hidden rounded-[30px] flex-1" style={{ boxShadow: "0px 4px 4px 2px rgba(0,0,0,0.25)" }}>
            <img
              src="https://images.unsplash.com/photo-1582560475093-ba66accbc095?w=300&q=80"
              alt="Eco tableware"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
