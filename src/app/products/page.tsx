import Link from "next/link";
import Navbar from "@/app/(website)/_components/Navbar";
import Footer from "@/app/(website)/_components/Footer";
import { getMarketplaceProducts, getCategories } from "@/lib/api";
import Image from "next/image";
import ProductCard from "./ProductCard";

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>
}) {
  let products: any[] = [];
  try {
    const resolvedParams = await searchParams;
    const categorySlug = resolvedParams.category;
    let categoryId: number | undefined;

    if (categorySlug) {
      const catRes = await getCategories();
      const matchedCat = catRes.data?.find(
        (c: any) => c.slug === categorySlug || c.name.toLowerCase() === categorySlug.toLowerCase()
      );
      if (matchedCat) {
        categoryId = matchedCat.id;
      }
    }

    const res = await getMarketplaceProducts({ category_id: categoryId, per_page: 50 });
    products = res.data || [];
  } catch (error) {
    console.error("Failed to load products from database in ProductsPage:", error);
  }

  return (
    <main className="min-h-screen bg-[#E8F0D8]">

      {/* Top Hero Section */}
      <section className="relative overflow-hidden pt-36 lg:pt-[140px] pb-16 bg-transparent">
        {/* Left Curved Shape Backdrop */}
        <div className="absolute w-[1162px] h-[1200px] bg-[#FBEFC9] border-[1.5px] border-black shadow-[4px_4px_0px_#000000] rounded-[300px] -top-[304px] -left-[283px] z-0" />

        <div className="relative z-10 mx-auto max-w-[1625px] px-8 lg:px-[146px] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <h1
              className="text-[#5E3A16] font-bold text-5xl sm:text-[72px] leading-[62px] sm:leading-[80px] tracking-tight"
              style={{ fontFamily: "var(--font-poppins), 'Poppins', sans-serif" }}
            >
              Tableware that<br />
              <span className="text-[#4C7A1A] italic">grows from</span><br />
              <span className="text-[#4C7A1A] italic">the ground</span>
            </h1>
            <p className="text-[#4C7A1A] text-[24px] leading-[38px] font-bold max-w-xl" style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
              Every bowl, plate and tray is pressed from natural leaves, heat-treated for strength, and certified food-safe.
            </p>

            {/* Stats Row */}
            <div className="flex gap-16 pt-6 max-w-xl">
              <div className="text-center">
                <span className="block text-[24px] font-bold text-[#5E3A16]">12+</span>
                <span className="text-[24px] text-[#4C7A1A] font-normal mt-1 block leading-[28px]">Product<br />Types</span>
              </div>
              <div className="text-center">
                <span className="block text-[24px] font-bold text-[#5E3A16]">3</span>
                <span className="text-[24px] text-[#4C7A1A] font-normal mt-1 block leading-[28px]">Leaf<br />Materials</span>
              </div>
              <div className="text-center">
                <span className="block text-[24px] font-bold text-[#5E3A16]">100%</span>
                <span className="text-[24px] text-[#4C7A1A] font-normal mt-1 block leading-[28px] whitespace-nowrap">Compostable</span>
              </div>
            </div>
          </div>

          {/* Right Column Product Stack Image */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end relative">
            <div className="relative h-[550px] w-full max-w-[780px]">
              <Image
                src="/images/decor/product_stack.webp"
                alt="Healing Ourth leafware products collection"
                fill
                className="object-contain"
                sizes="(max-w-[1024px]) 100vw, 780px"
                priority
              />
            </div>
          </div>
        </div>

        {/* Download Catalogue pill badge */}
        <div className="flex justify-center mt-36 relative z-10">
          <a
            href="#"
            className="w-[370px] h-[60px] rounded-[30px] bg-[#FAF8F3] border-[1.5px] border-black text-[#5E3A16] font-normal text-[24px] flex items-center justify-center shadow-sm hover:opacity-90 transition duration-200"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
          >
            Download Catalogue
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
    </main>
  );
}

