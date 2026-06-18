import Navbar from "@/app/(website)/_components/Navbar";
import Footer from "@/app/(website)/_components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <main style={{ background: "#D8EFE0" }}>
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 pt-36 pb-20">
        <h1 className="mb-8 text-4xl font-bold text-[#1A5C2E]">Privacy Policy</h1>

        <div className="space-y-6 text-lg text-[#2C1F13]">
          <p className="text-base">
            <strong>Last Updated: June 2026</strong>
          </p>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">Introduction</h2>
            <p>
              OURTH ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, mobile application, and related services (collectively, the "Service").
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">1. Information We Collect</h2>
            <p className="mb-3">We may collect information about you in a variety of ways. The information we may collect on the Service includes:</p>

            <h3 className="mb-2 font-semibold text-[#2C1F13]">Personal Data:</h3>
            <ul className="mb-3 list-inside list-disc space-y-1 pl-4">
              <li>Name, email address, phone number</li>
              <li>Billing and shipping address</li>
              <li>Payment information (processed securely)</li>
              <li>User account credentials</li>
              <li>Profile information and preferences</li>
            </ul>

            <h3 className="mb-2 font-semibold text-[#2C1F13]">Usage Data:</h3>
            <ul className="list-inside list-disc space-y-1 pl-4">
              <li>Device information (IP address, browser type, operating system)</li>
              <li>Pages visited, time spent, and user interactions</li>
              <li>Search queries and purchase history</li>
              <li>Location data (with your consent)</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">2. How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="list-inside list-disc space-y-1 pl-4">
              <li>Process your orders and transactions</li>
              <li>Send transactional and promotional emails</li>
              <li>Improve our Service and user experience</li>
              <li>Respond to your inquiries and customer support requests</li>
              <li>Analyze usage trends and optimize functionality</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and enhance security</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">3. Information Sharing and Disclosure</h2>
            <p className="mb-3">We may share your information with:</p>
            <ul className="list-inside list-disc space-y-1 pl-4">
              <li><strong>Service Providers:</strong> Third parties who assist in operating our Service (payment processors, analytics providers, hosting services)</li>
              <li><strong>Business Partners:</strong> Vendors and sellers to fulfill your orders</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Aggregated Data:</strong> We may share anonymized, aggregated data for research and analytics</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">4. Data Security</h2>
            <p>
              We implement appropriate security measures, including encryption and secure server protocols, to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">5. Your Rights and Preferences</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-inside list-disc space-y-1 pl-4">
              <li>Access, update, or delete your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your data</li>
              <li>Request data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p className="mt-3">To exercise these rights, please contact us at privacy@healingourth.com</p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">6. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience, remember your preferences, and analyze usage patterns. You can control cookie settings through your browser preferences.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">7. Third-Party Links</h2>
            <p>
              Our Service may contain links to third-party websites. We are not responsible for the privacy practices of external sites. We encourage you to review their privacy policies before providing personal information.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">8. Children's Privacy</h2>
            <p>
              Our Service is not intended for children under 13 years old. We do not knowingly collect personal information from children. If we become aware of such collection, we will delete the information promptly.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">9. Policy Changes</h2>
            <p>
              We may update this Privacy Policy periodically. Changes will be effective immediately upon posting to the Service. Your continued use indicates your acceptance of the updated policy.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">10. Contact Us</h2>
            <p>
              For privacy inquiries or concerns, please contact us at:
            </p>
            <p className="mt-3">
              <strong>OURTH</strong><br />
              Email: privacy@healingourth.com<br />
              Website: www.healingourth.com
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
