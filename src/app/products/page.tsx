import Link from "next/link";
import Navbar from "@/app/(website)/_components/Navbar";
import Footer from "@/app/(website)/_components/Footer";
import { getMarketplaceProducts } from "@/lib/api";
import Image from "next/image";
import ProductCard from "./ProductCard";

export default async function ProductsPage() {
  let products: any[] = [];
  try {
    const res = await getMarketplaceProducts({ per_page: 50 });
    products = res.data || [];
  } catch (error) {
    console.error("Failed to load products from database in ProductsPage:", error);
  }

  return (
    <main className="min-h-screen bg-[#F5F8F3]">
      <Navbar />

      {/* Top Hero Section */}
      <section className="relative overflow-hidden pt-36 pb-16 bg-[#F5F8F3]">
        {/* Left Curved Shape Backdrop */}
        <div className="absolute top-0 left-0 h-[85%] w-full lg:w-[45%] bg-[#E2EFE0] rounded-br-[120px] lg:rounded-br-[200px] z-0" />

        <div className="relative z-10 mx-auto max-w-[1580px] px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text Content */}
          <div className="lg:col-span-5 space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0D3A27]">
              Ourth Tableware
            </p>
            <h1
              className="text-[#0D3A27] font-extrabold text-5xl sm:text-6xl leading-[1.1]"
              style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
            >
              Tableware that <br />
              <span className="italic font-serif font-light text-emerald-800">grows from</span> <br />
              the ground
            </h1>
            <p className="text-[#2C1F13]/85 text-base leading-relaxed max-w-md">
              Every bowl, plate and tray is pressed from natural leaves, heat-treated for strength, and certified food-safe.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#0D3A27]/10 max-w-md">
              <div>
                <span className="block text-3xl font-extrabold text-[#0D3A27]">10+</span>
                <span className="text-xs text-[#2C1F13]/70 font-semibold mt-1 block">Product Types</span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold text-[#0D3A27]">1</span>
                <span className="text-xs text-[#2C1F13]/70 font-semibold mt-1 block">Leaf Sourced</span>
              </div>
              <div>
                <span className="block text-3xl font-extrabold text-[#0D3A27]">100%</span>
                <span className="text-xs text-[#2C1F13]/70 font-semibold mt-1 block">Compostable</span>
              </div>
            </div>
          </div>

          {/* Right Column Product Stack Image */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end relative">
            <div className="relative h-[340px] w-full max-w-[620px] sm:h-[460px] lg:h-[560px]">
              <Image
                src="/images/decor/product_stack.webp"
                alt="Healing Ourth leafware products collection"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Downlaod Catalogue pill badge */}
        <div className="flex justify-center mt-12 relative z-10">
          <a
            href="#"
            className="rounded-full bg-[#E2EFE0] border border-[#0D3A27]/20 px-8 py-2.5 text-sm font-bold text-[#0D3A27] shadow-sm hover:bg-[#d0e6cf] focus:outline-none focus:ring-2 focus:ring-[#0D3A27] transition duration-200"
          >
            Downlaod Catalogue
          </a>
        </div>
      </section>

      {/* Product List Section */}
      <section
        className="relative py-16 px-8 lg:px-16 space-y-16 overflow-hidden">
        {products.length === 0 ? (
          <div className="mx-auto max-w-[1280px] text-center p-16 bg-white/70 rounded-3xl border border-[#DCE9D4]">
            <p className="text-lg font-medium text-[#0D3A27]">No products available in the database catalogue at the moment.</p>
          </div>
        ) : (
          products.map((product: any, index: number) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))
        )}
      </section>

      <Footer />
    </main>
  );
}
