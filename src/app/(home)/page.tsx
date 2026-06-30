import Hero from "@/app/(website)/_components/Hero";
import Journey from "@/app/(website)/_components/Journey";
import ProductsSection from "@/app/(website)/_components/ProductsSection";
import TornBanner from "@/app/(website)/_components/TornBanner";

export default function LandingPage() {

  return (
    <main className="relative min-h-screen bg-[#FAF8F3]">
      <Hero />
      <Journey />
      <TornBanner />
      <ProductsSection />
    </main>
  );
}
