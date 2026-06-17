import Link from "next/link";

const products = [
  {
    id: "sal-leaf-bowl",
    name: "Classic Sal Leaf Bowl",
    description: "Deep, sturdy bowls ideal for curries, dal and rice. Heat-resistant up to 90°C.",
    img: "https://images.unsplash.com/photo-1606914469633-bd07b15e8f33?w=900&q=80",
  },
  {
    id: "lemon-leaf-plate",
    name: "Lemon Leaf Plate",
    description: "Lightweight and compostable plates designed for everyday meals and gatherings.",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&q=80",
    reverse: true,
  },
  {
    id: "tiffin-box",
    name: "Natural Leaf Tiffin Box",
    description: "Secure, eco-friendly packaging for lunch delivery and sustainable meal prep.",
    img: "https://images.unsplash.com/photo-1514361892636-2f51b1e5d86f?w=900&q=80",
  },
  {
    id: "dessert-bowl",
    name: "Eco Dessert Bowl",
    description: "Perfect for chilled desserts, snacks or side servings with an elegant natural texture.",
    img: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=900&q=80",
    reverse: true,
  },
];

export default function ProductsPage() {
  return (
    <main style={{ background: "#F4F7EF" }}>
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(72,134,94,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.95),_transparent_30%)]" />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#3C6A3F]">Products</p>
              <h1 className="mt-4 text-5xl font-bold leading-[1.05] text-[#142C16] sm:text-6xl">
                Tableware that grows from the ground.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#40563E]">
                Every bowl, plate and tray is pressed from natural leaves, heat-treated for strength, and certified food-safe.
                Designed to be compostable, beautiful, and ready for everyday use.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="rounded-full bg-[#1A5C2E] px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_-18px_rgba(26,91,46,0.9)] transition hover:bg-[#164f27]"
                >
                  Get in touch
                </Link>
                <Link
                  href="/#products"
                  className="rounded-full border border-[#2C4A1A] bg-white px-7 py-3 text-sm font-semibold text-[#2C4A1A] transition hover:bg-[#f5f8f0]"
                >
                  View catalogue
                </Link>
              </div>
            </div>
            <div className="rounded-[38px] border border-[#D2E5CE] bg-white/80 p-6 shadow-[0_24px_58px_-30px_rgba(0,0,0,0.4)] backdrop-blur-xl">
              <div className="rounded-[32px] bg-[#E6F3E2] p-8">
                <h2 className="text-xl font-semibold text-[#26421D]">Why choose leafware?</h2>
                <ul className="mt-6 space-y-4 text-sm leading-7 text-[#4F6648]">
                  <li>• 100% compostable natural material</li>
                  <li>• Heat resistant up to 90°C</li>
                  <li>• Sturdy enough for sauces and hot meals</li>
                  <li>• Ideal for events, catering, and wholesale</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#3C6A3F]">Our collection</p>
            <h2 className="mt-3 text-4xl font-bold leading-tight text-[#152A18] sm:text-5xl">
              Sustainable products made with care.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-[#546B54] sm:text-base">
            Browse our range of biodegradable leafware, perfect for home kitchens, restaurants, and eco-conscious events.
          </p>
        </div>

        <div className="mt-14 space-y-16">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`grid gap-8 rounded-[40px] border border-[#DCE9D4] bg-white p-8 shadow-[0_30px_65px_-40px_rgba(15,46,22,0.2)] lg:grid-cols-2 ${product.reverse ? "lg:grid-flow-dense lg:grid-cols-[1fr_0.9fr]" : ""}`}
            >
              <div className={`${product.reverse ? "lg:col-start-2" : ""} flex items-center justify-center`}>
                <img
                  src={product.img}
                  alt={product.name}
                  className="h-[380px] w-full max-w-[520px] rounded-[32px] object-cover shadow-[0_24px_54px_-34px_rgba(0,0,0,0.2)]"
                />
              </div>

              <div className="flex flex-col justify-center gap-6">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-[0.35em] text-[#4B6A42]">{product.name}</span>
                  <h3 className="mt-4 text-3xl font-bold leading-tight text-[#152A18]">{product.name}</h3>
                </div>
                <p className="max-w-lg text-base leading-8 text-[#4F5F48]">{product.description}</p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/products/${product.id}`}
                    className="rounded-full border border-[#2C4A1A] px-6 py-3 text-sm font-semibold text-[#2C4A1A] transition hover:bg-[#F4F7EF]"
                  >
                    View details
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-full bg-[#1A5C2E] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#164f27]"
                  >
                    Enquire now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
