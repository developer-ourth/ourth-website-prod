import Link from "next/link";
import Image from "next/image";
import websiteConfig from "../../../data/website-config.json";

export default function Footer() {
  const config = websiteConfig || {
    contactEmail: "support@healingourth.com",
    footerTagline: "for a plastic-free future."
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-r from-[#76A52E]/20 via-[#C98A2E]/20 to-[#2693D6]/20 text-[#2C1F13] border-t border-black/10 py-6">
      <div className="mx-auto max-w-[1200px] px-6 flex flex-col items-center text-center">
        
        {/* Brand Logo & Name */}
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white p-2.5 shadow-md">
            <Image 
              src="/images/logo/HOIPL_3DIndia.webp" 
              alt="Healing OURTH Logo" 
              width={48} 
              height={48} 
              className="object-contain" 
            />
          </div>
          <span className="text-2xl font-black text-[#0D3A27] tracking-tight uppercase">
            Healing OURTH
          </span>
          <p className="text-xs font-bold text-[#0D3A27]/70 max-w-md mt-1">
            sustainable leaf tableware crafted for a plastic-free future.
          </p>
        </div>

        {/* Links Navigation */}
        <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-4 border-y border-black/10 py-3 w-full max-w-2xl">
          <Link href="/" className="text-sm font-bold text-[#0D3A27]/90 hover:text-[#76A52E] transition-colors">
            Home
          </Link>
          <Link href="/know-us" className="text-sm font-bold text-[#0D3A27]/90 hover:text-[#76A52E] transition-colors">
            Know Us
          </Link>
          <Link href="/products" className="text-sm font-bold text-[#0D3A27]/90 hover:text-[#76A52E] transition-colors">
            Our Products
          </Link>
          <Link href="/contact" className="text-sm font-bold text-[#0D3A27]/90 hover:text-[#76A52E] transition-colors">
            Contact
          </Link>
          <Link href="/privacy-policy" className="text-sm font-bold text-[#0D3A27]/90 hover:text-[#76A52E] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm font-bold text-[#0D3A27]/90 hover:text-[#76A52E] transition-colors">
            Terms of Service
          </Link>
        </nav>

        {/* Social Icons & Contact */}
        <div className="flex items-center gap-4 mb-4">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2C1F13]/20 bg-white text-[#2C1F13] hover:bg-[#EBF2E4] transition-all shadow-sm"
            aria-label="Instagram"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2C1F13]/20 bg-white text-[#2C1F13] hover:bg-[#EBF2E4] transition-all shadow-sm"
            aria-label="Facebook"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
            </svg>
          </a>
          <a 
            href={`mailto:${config.contactEmail}`}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2C1F13]/20 bg-white text-[#2C1F13] hover:bg-[#EBF2E4] transition-all shadow-sm"
            aria-label="Email"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
        </div>

        {/* Bottom line */}
        <div className="text-xs font-bold text-[#0D3A27]/50 flex flex-col md:flex-row items-center gap-2 select-none">
          <span>© {new Date().getFullYear()} Healing OURTH. All rights reserved.</span>
          <span className="hidden md:inline">•</span>
          <span>crafted for a plastic-free future 💚</span>
        </div>

      </div>
    </footer>
  );
}

