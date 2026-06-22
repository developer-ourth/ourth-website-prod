import Navbar from "@/app/(website)/_components/Navbar";
import Hero from "@/app/(website)/_components/Hero";
import NaturesAnswer from "@/app/(website)/_components/NaturesAnswer";
import BuiltForVendors from "@/app/(website)/_components/BuiltForVendors";
import Products from "@/app/(website)/_components/Products";
import BrandsAndTestimonials from "@/app/(website)/_components/BrandsAndTestimonials";
import Footer from "@/app/(website)/_components/Footer";
import fs from "fs";
import path from "path";

export default function LandingPage() {
  // Read config dynamically at request time
  let config = {
    backgroundColor: "#D8EFE0",
    showNaturesAnswer: true,
    showBuiltForVendors: true,
    showProducts: true
  };
  try {
    const configPath = path.join(process.cwd(), "src/data/website-config.json");
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (e) {
    console.error("Failed to read dynamic website config in LandingPage", e);
  }

  return (
    <main className="relative min-h-screen" style={{ background: config.backgroundColor }}>
      <Hero />
      {config.showNaturesAnswer && <NaturesAnswer />}
      {config.showProducts && <Products />}
      <BrandsAndTestimonials />
      {config.showBuiltForVendors && <BuiltForVendors />}
    </main>
  );
}

