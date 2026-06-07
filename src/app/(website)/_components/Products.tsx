import Link from "next/link";

const products = [
  {
    id: "chutney-1",
    name: "Chutney Bowl",
    img: "https://images.unsplash.com/photo-1606914469633-bd07b15e8f33?w=700&q=80",
  },
  {
    id: "maggi-1",
    name: "Maggi Bowl",
    img: "https://images.unsplash.com/photo-1606914469633-bd07b15e8f33?w=700&q=80",
  },
  {
    id: "chatney-1",
    name: "Chatney Bowl",
    img: "https://images.unsplash.com/photo-1606914469633-bd07b15e8f33?w=700&q=80",
  },
  {
    id: "maggi-2",
    name: "Maggi Bowl",
    img: "https://images.unsplash.com/photo-1606914469633-bd07b15e8f33?w=700&q=80",
  },
];

export default function Products() {
  return (
    <section className="pt-10 pb-16" style={{ background: "#D8EFE0" }}>
      <div className="mx-auto max-w-[1580px] px-6">
        {/* Header */}
        <div className="mb-9 flex items-center justify-between">
          <h2
            style={{
              fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif",
              fontWeight: 700,
              fontSize: "56px",
              lineHeight: "60px",
            }}
          >
            <span style={{ color: "#2C1F13" }}>Leaf-made,</span>{" "}
            <span style={{ color: "#1A5C2E", fontStyle: "italic" }}>earth-approved</span>
          </h2>
          <Link
            href="/products"
            className="hidden md:flex items-center justify-center hover:opacity-90 transition-opacity"
            style={{
              background: "rgba(242, 212, 138, 0.4)",
              boxShadow: "0px 3px 4px rgba(0,0,0,0.25)",
              borderRadius: "30px",
              minWidth: "280px",
              height: "56px",
              fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif",
              fontWeight: 500,
              fontSize: "32px",
              lineHeight: "34px",
              color: "#746148",
            }}
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="mx-auto flex w-[270px] flex-col items-center overflow-hidden"
              style={{
                boxShadow: "0px 4px 4px rgba(0,0,0,0.2)",
                borderRadius: "30px",
                height: "430px",
                padding: "1px",
                border: "2px solid #2C1F13",

              }}
            >
              <div className="flex h-full w-full flex-col rounded-[29px] bg-[#CFDAC9] px-[11px] pt-[11px] pb-0">
                <div
                  className="w-full overflow-hidden rounded-[27px] flex-shrink-0"
                  style={{
                    height: "320px",
                    background: "#EDE8DC",
                  }}
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    className="h-full w-full object-contain p-8"
                  />
                </div>

                <div
                  className="relative mt-auto flex w-[calc(100%+22px)] items-center justify-center -mx-[11px]"
                  style={{
                    borderRadius: "20px 20px 29px 29px",
                    height: "80px",
                    flexShrink: 0,
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(180deg, #8AEFF2 0%, #B8DEC4 50%)",
                      borderRadius: "20px 20px 29px 29px",
                      opacity: 0.4,
                    }}
                  />
                  <span
                    className="relative z-10"
                    style={{
                      fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif",
                      fontWeight: 500,
                      fontSize: "24px",
                      lineHeight: "34px",
                      color: "#020A4A",
                      opacity: 1,
                    }}
                  >
                    {p.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-8 text-center md:hidden">
          <Link href="/products" className="rounded-full border border-[#2C4A1A] px-6 py-2.5 text-sm font-medium text-[#2C4A1A]">
            View all products →
          </Link>
        </div>
      </div>
    </section>
  );
}
