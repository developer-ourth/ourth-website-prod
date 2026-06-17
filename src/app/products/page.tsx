import Link from "next/link";
import Navbar from "@/app/(website)/_components/Navbar";
import Footer from "@/app/(website)/_components/Footer";
import { getMarketplaceProducts } from "@/lib/api";
import Image from "next/image";

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
        <div className="absolute top-0 left-0 h-full w-full lg:w-[45%] bg-[#E2EFE0] rounded-br-[120px] lg:rounded-br-[200px] z-0" />

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

        {/* Partner Catalogue pill badge */}
        <div className="flex justify-center mt-12 relative z-10">
          <span className="rounded-full bg-[#E2EFE0] border border-[#0D3A27]/20 px-8 py-2.5 text-sm font-bold text-[#0D3A27] shadow-sm">
            Partner Catalogue
          </span>
        </div>
      </section>

      {/* Product List Section */}
      <section
        className="relative py-16 px-4 sm:px-8 space-y-16 overflow-hidden">
        {products.length === 0 ? (
          <div className="mx-auto max-w-[1280px] text-center p-16 bg-white/70 rounded-3xl border border-[#DCE9D4]">
            <p className="text-lg font-medium text-[#0D3A27]">No products available in the database catalogue at the moment.</p>
          </div>
        ) : (
          products.map((product: any, index: number) => {
            const isEvenRow = index % 2 === 1; // 0-indexed: index 0 is first row (odd), index 1 is second row (even)

            return (
              <div
                key={product.id}
                className="relative max-w-[1440px] mx-auto px-4 sm:px-8 py-8"
              >
                {/* Flanking Palm/Monstera Leaves Overlay for alternating (even index-1) rows */}
                {isEvenRow && (
                  <>
                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 h-[480px] w-[320px] pointer-events-none z-10 select-none">
                      <Image
                        src="/images/decor/leaf_left.webp"
                        alt=""
                        fill
                        className="object-contain opacity-90"
                      />
                    </div>
                    <div className="absolute -right-12 top-1/2 -translate-y-1/2 h-[480px] w-[320px] pointer-events-none z-10 select-none">
                      <Image
                        src="/images/decor/leaf_right.webp"
                        alt=""
                        fill
                        className="object-contain opacity-90"
                      />
                    </div>
                  </>
                )}

                {/* Product Card Container */}
                <div
                  className={`flex flex-col lg:flex-row items-center justify-between gap-12 rounded-[50px] border border-white/40 p-12 md:p-16 lg:p-20 shadow-[0_24px_70px_rgba(44,74,26,0.08)] overflow-hidden relative z-20 ${isEvenRow ? "lg:flex-row-reverse" : ""
                    }`}
                  style={
                    isEvenRow
                      ? {
                        background: "rgba(226, 239, 220, 0.45)",
                        backdropFilter: "blur(16px)",
                        WebkitBackdropFilter: "blur(16px)",
                      }
                      : {
                        backgroundImage: "url('/images/decor/background.webp')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backdropFilter: "blur(4px)",
                        WebkitBackdropFilter: "blur(4px)",
                      }
                  }
                >
                  {/* Left Column Content card */}
                  <div className="w-full lg:w-[45%] flex justify-center z-10">
                    <div className="w-full max-w-[440px] bg-[#FAF7F2] rounded-[36px] p-10 sm:p-12 lg:p-14 shadow-[0_15px_35px_rgba(44,74,26,0.06)] space-y-6 flex flex-col justify-center min-h-[380px]">
                      <h2 className="text-4xl sm:text-5xl font-black text-[#2C1F13] tracking-tight">
                        {product.category?.name || "Bowls"}
                      </h2>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#2C1F13] opacity-90">
                        {product.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-[#2C1F13]/75 max-w-sm">
                        {product.description || "Every bowl, plate and tray is pressed from natural leaves, heat-treated for strength, and certified food-safe."}
                      </p>
                    </div>
                  </div>

                  {/* Right Column Product Image */}
                  <div className="w-full lg:w-[50%] flex justify-center z-10">
                    <div className="relative h-[360px] w-full max-w-[560px] sm:h-[440px] lg:h-[500px]">
                      <img
                        src={product.primary_image_url || "/images/decor/product_stack.webp"}
                        alt={product.name}
                        className="h-full w-full object-contain transform hover:scale-105 transition duration-500"
                        style={{ filter: "drop-shadow(0px 16px 32px rgba(44, 74, 26, 0.12))" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </section>

      <Footer />
    </main>
  );
}
