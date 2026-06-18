import Navbar from "@/app/(website)/_components/Navbar";
import Footer from "@/app/(website)/_components/Footer";

export default function TermsPage() {
  return (
    <main style={{ background: "#D8EFE0" }}>
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 pt-36 pb-20">
        <h1 className="mb-8 text-4xl font-bold text-[#1A5C2E]">Terms of Service</h1>

        <div className="space-y-6 text-lg text-[#2C1F13]">
          <p className="text-base">
            <strong>Last Updated: June 2026</strong>
          </p>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the OURTH website, mobile application, and services (collectively, the "Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the foregoing, please do not use this Service.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">2. Use License</h2>
            <p className="mb-3">Permission is granted to temporarily download one copy of the materials (information or software) on OURTH for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul className="list-inside list-disc space-y-1 pl-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              <li>Violate any laws or regulations applicable to the Service</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">3. Disclaimer</h2>
            <p>
              The materials on the OURTH website are provided on an "as is" basis. OURTH makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">4. Limitations</h2>
            <p>
              In no event shall OURTH or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on OURTH's Service, even if OURTH or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">5. Accuracy of Materials</h2>
            <p>
              The materials appearing on OURTH could include technical, typographical, or photographic errors. OURTH does not warrant that any of the materials on its website are accurate, complete, or current. OURTH may make changes to the materials contained on its website at any time without notice.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">6. Links</h2>
            <p>
              OURTH has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by OURTH of the site. Use of any such linked website is at the user's own risk.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">7. Modifications</h2>
            <p>
              OURTH may revise these Terms of Service for its Service at any time without notice. By using this Service, you are agreeing to be bound by the then current version of these Terms of Service.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">8. Governing Law</h2>
            <p>
              These conditions and terms are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts located in India.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">9. User Responsibilities</h2>
            <p className="mb-3">Users agree to:</p>
            <ul className="list-inside list-disc space-y-1 pl-4">
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use the Service in compliance with all applicable laws and regulations</li>
              <li>Not engage in unlawful or fraudulent activities</li>
              <li>Not harass, threaten, or defame others through the Service</li>
              <li>Respect intellectual property rights of OURTH and third parties</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">10. Product Information and Pricing</h2>
            <p className="mb-3">
              OURTH strives to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions, pricing, or other content is accurate, complete, or error-free. We reserve the right to:
            </p>
            <ul className="list-inside list-disc space-y-1 pl-4">
              <li>Correct any errors or omissions</li>
              <li>Change or update product information at any time</li>
              <li>Refuse or cancel any order at our discretion</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">11. Payment and Order Acceptance</h2>
            <p>
              All orders are subject to acceptance and confirmation by OURTH. We reserve the right to refuse or cancel any order. Payment must be received and verified before order processing. By submitting an order, you warrant that you are at least 18 years old and have the legal authority to enter into binding contracts.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">12. Contact Information</h2>
            <p>
              For questions regarding these Terms of Service, please contact us at:
            </p>
            <p className="mt-3">
              <strong>OURTH</strong><br />
              Email: support@healingourth.com<br />
              Website: www.healingourth.com
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
