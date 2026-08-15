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
      <div className="mx-auto max-w-[1200px] px-6">
        
        {/* Top Row: Brand, Nav, Socials */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center">
              <Image 
                src="/images/logo/HOIPL_3DIndia.webp" 
                alt="Healing OURTH Logo" 
                width={32} 
                height={32} 
                className="object-contain drop-shadow-sm" 
              />
            </div>
            <span className="text-lg font-black text-[#0D3A27] tracking-tight uppercase">
              Healing OURTH
            </span>
          </div>

          {/* Links Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-5 sm:gap-8">
            <Link href="/" className="text-[13px] font-bold text-[#0D3A27]/80 hover:text-[#0D3A27] transition-colors">Home</Link>
            <Link href="/know-us" className="text-[13px] font-bold text-[#0D3A27]/80 hover:text-[#0D3A27] transition-colors">Know Us</Link>
            <Link href="/products" className="text-[13px] font-bold text-[#0D3A27]/80 hover:text-[#0D3A27] transition-colors">Products</Link>
            <Link href="/contact" className="text-[13px] font-bold text-[#0D3A27]/80 hover:text-[#0D3A27] transition-colors">Contact</Link>
          </nav>

          {/* Right side: Social Icons */}
          <div className="flex items-center gap-3">
            <a 
              href="https://www.instagram.com/healingourth/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0D3A27] hover:bg-[#0D3A27] hover:text-white transition-all shadow-sm border border-black/5"
              aria-label="Instagram"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0D3A27] hover:bg-[#0D3A27] hover:text-white transition-all shadow-sm border border-black/5"
              aria-label="Facebook"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
            <a 
              href={`mailto:${config.contactEmail}`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0D3A27] hover:bg-[#0D3A27] hover:text-white transition-all shadow-sm border border-black/5"
              aria-label="Email"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Row: Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-black/10">
          <div className="text-[11px] font-bold text-[#0D3A27]/60">
            © {new Date().getFullYear()} Healing OURTH. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px] font-bold text-[#0D3A27]/60">
            <Link href="/privacy-policy" className="hover:text-[#0D3A27] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#0D3A27] transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

