import Navbar from "@/app/(website)/_components/Navbar";
import Footer from "@/app/(website)/_components/Footer";

export default function RefundPolicyPage() {
  return (
    <main style={{ background: "#D8EFE0" }}>
      <Navbar />
      
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="mb-8 text-4xl font-bold text-[#1A5C2E]">Refund Policy</h1>
        
        <div className="space-y-6 text-lg text-[#2C1F13]">
          <p className="text-base">
            <strong>Last Updated: June 2024</strong>
          </p>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">Overview</h2>
            <p>
              OURTH is committed to customer satisfaction. This Refund Policy outlines the conditions and procedures for returns and refunds of products purchased through our Service.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">1. Return Window</h2>
            <p>
              Customers may initiate a return or request a refund within <strong>7 days</strong> from the date of delivery. Returns requested after this period will not be accepted except in cases of defective or damaged products.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">2. Eligible Products for Return</h2>
            <p className="mb-3">Products are eligible for return if they meet the following criteria:</p>
            <ul className="list-inside list-disc space-y-1 pl-4">
              <li>Product is unused and in original, unopened packaging</li>
              <li>Product has all original tags and components intact</li>
              <li>Product is not hygiene-sensitive or consumable (where applicable)</li>
              <li>Product shows no signs of use or wear</li>
              <li>All supporting materials and documentation are included</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">3. Non-Eligible Products</h2>
            <p className="mb-3">The following products are <strong>NOT eligible</strong> for return:</p>
            <ul className="list-inside list-disc space-y-1 pl-4">
              <li>Consumable or hygiene-sensitive items once opened</li>
              <li>Custom or personalized orders</li>
              <li>Products damaged due to misuse or neglect by the customer</li>
              <li>Items purchased with promotional discounts exceeding 50%</li>
              <li>Digital or downloadable products</li>
              <li>Products returned without original packaging</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">4. Defective or Damaged Products</h2>
            <p>
              If you receive a defective or damaged product, please contact us within <strong>48 hours</strong> of delivery with photos of the damage. We will:
            </p>
            <ul className="list-inside list-disc space-y-2 pl-4">
              <li>Provide a full refund, or</li>
              <li>Send a replacement product at no cost</li>
            </ul>
            <p className="mt-3">
              No return shipping is required for defective or damaged items—we will arrange pickup at no cost to you.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">5. How to Initiate a Return</h2>
            <p className="mb-3">To request a return or refund:</p>
            <ol className="list-inside list-decimal space-y-2 pl-4">
              <li>Log into your OURTH account</li>
              <li>Navigate to "Order History" or "My Orders"</li>
              <li>Select the order containing the item you wish to return</li>
              <li>Click "Request Return" and provide a reason</li>
              <li>Follow the instructions to print a return label (if applicable)</li>
              <li>Pack the product securely in its original packaging</li>
              <li>Use the provided label to ship the item back to us</li>
            </ol>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">6. Return Shipping</h2>
            <p className="mb-3">
              For standard returns (non-defective items):
            </p>
            <ul className="list-inside list-disc space-y-1 pl-4">
              <li>Customers cover the cost of return shipping</li>
              <li>Free return labels are available for orders over ₹500</li>
              <li>Shipping costs may be deducted from refunds if return shipping is not prepaid</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">7. Refund Processing</h2>
            <p className="mb-3">
              Once we receive and inspect your return:
            </p>
            <ul className="list-inside list-disc space-y-1 pl-4">
              <li>We will verify the product condition within 5-7 business days</li>
              <li>If approved, the refund will be processed to your original payment method</li>
              <li>Refund processing may take 7-14 business days depending on your financial institution</li>
              <li>You will receive an email confirmation once the refund is processed</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">8. Refund Amount</h2>
            <p className="mb-3">
              The refund amount will be calculated as follows:
            </p>
            <ul className="list-inside list-disc space-y-1 pl-4">
              <li><strong>Full refund:</strong> Product price minus applicable shipping costs and return shipping (where applicable)</li>
              <li><strong>Promotional discounts:</strong> Refund is based on the discounted price, not the original price</li>
              <li><strong>Taxes:</strong> Applicable taxes will be included in the refund if charged at purchase</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">9. Exchanges</h2>
            <p>
              Instead of a return and refund, you may request an exchange for a different size, color, or product. Exchanges are processed within 7-10 business days. Additional shipping charges may apply for exchanges.
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">10. Special Circumstances</h2>
            <p className="mb-3">
              OURTH reserves the right to deny returns in cases of:
            </p>
            <ul className="list-inside list-disc space-y-1 pl-4">
              <li>Fraudulent or suspicious return patterns</li>
              <li>Misuse or intentional damage of products</li>
              <li>Missing proof of purchase or order details</li>
              <li>Return attempts outside the specified timeframe without valid justification</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">11. Contact Us</h2>
            <p>
              For return or refund inquiries, please contact our customer support team:
            </p>
            <p className="mt-3">
              <strong>OURTH Customer Support</strong><br/>
              Email: support@healingourth.com<br/>
              Website: www.healingourth.com<br/>
              Response time: 24-48 hours
            </p>
          </div>

          <div>
            <h2 className="mb-3 text-2xl font-semibold text-[#1A5C2E]">12. Policy Changes</h2>
            <p>
              OURTH reserves the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting. Continued use of the Service after policy changes indicates your acceptance of the updated policy.
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
