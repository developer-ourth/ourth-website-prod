import Navbar from "@/app/(website)/_components/Navbar";
import Hero from "@/app/(website)/_components/Hero";
import NaturesAnswer from "@/app/(website)/_components/NaturesAnswer";
import BuiltForVendors from "@/app/(website)/_components/BuiltForVendors";
import Products from "@/app/(website)/_components/Products";
import Footer from "@/app/(website)/_components/Footer";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen" style={{ background: "#D8EFE0" }}>
      <Navbar />
      <Hero />
      <NaturesAnswer />
      <BuiltForVendors />
      <Products />
      <Footer />
    </main>
  );
}
