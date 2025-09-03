import type { Metadata } from "next"
import { SITE_KEYWORDS } from "@/lib/seo"

export const metadata: Metadata = {
  title: "Terms & Refund Policy – Early Founder Lifetime Deal",
  description:
    "Details of Feedlooply’s Early Founder Lifetime Deal, the 40-day launch guarantee, refunds, and payment terms.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms & Refund Policy – Early Founder Lifetime Deal",
    description:
      "Learn about the Early Founder Lifetime Deal, our 40-day launch guarantee, refund policy, and payment terms.",
    url: "/terms",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "Terms & Refund Policy – Early Founder Lifetime Deal",
    description: "Early Founder Lifetime Deal details, 40-day launch guarantee, refunds, and payment terms.",
  },
  keywords: SITE_KEYWORDS,
}

export default function TermsPage() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://feedlooply.com"
  const offerJsonLd = {
    "@context": "https://schema.org",
    "@type": "Offer",
    name: "Feedlooply – Early Founder Lifetime Deal",
    url: `${siteUrl}/#pricing`,
    priceCurrency: "USD",
    price: "47.63",
    availability: "https://schema.org/InStock",
    category: "https://schema.org/BusinessFunction",
    eligibleCustomerType: "https://schema.org/BusinessCustomer",
    seller: {
      "@type": "Organization",
      name: "Feedlooply",
      url: siteUrl,
    },
    offers: [
      {
        "@type": "Offer",
        priceCurrency: "INR",
        price: "3999",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/#pricing`,
      },
    ],
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offerJsonLd) }} />
      <h1 className="text-balance text-3xl font-semibold tracking-tight">
        Terms & Refund Policy – Feedlooply Early Access
      </h1>

      <section className="mt-6 space-y-4 text-muted-foreground leading-relaxed text-pretty">
        <h2 className="text-xl font-medium text-foreground">1. Early Founder Lifetime Deal</h2>
        <p>
          By purchasing the Early Founder Lifetime Deal (₹3,999 / $47.63 one-time), you receive lifetime access to Phase
          1 features, entry into the Founder Community, and the ability to participate in roadmap votes.
        </p>
        <p>This deal is a limited-time offer available only during the early access phase.</p>
      </section>

      <section className="mt-8 space-y-4 text-muted-foreground leading-relaxed text-pretty">
        <h2 className="text-xl font-medium text-foreground">2. 40-Day Launch Guarantee</h2>
        <p>We guarantee to ship the Phase 1 version within 40 days of your purchase.</p>
        <p>If Feedlooply fails to launch Phase 1 within 40 days, you are eligible for a full refund.</p>
      </section>

      <section className="mt-8 space-y-4 text-muted-foreground leading-relaxed text-pretty">
        <h2 className="text-xl font-medium text-foreground">3. Refund Policy</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-foreground">Full Refund:</span> If Phase 1 is not launched within 40 days,
            we will refund 100% of your payment.
          </li>
          <li>
            <span className="font-medium text-foreground">Change of Mind:</span> Since this is a special early founder
            offer, refunds are not available for change-of-mind purchases once Phase 1 has launched.
          </li>
          <li>
            <span className="font-medium text-foreground">Technical Issues:</span> If you experience a critical
            technical issue preventing you from accessing the platform, and it cannot be resolved within 14 business
            days, a partial or full refund may be considered.
          </li>
        </ul>
      </section>

      <section className="mt-8 space-y-4 text-muted-foreground leading-relaxed text-pretty">
        <h2 className="text-xl font-medium text-foreground">4. Payment & Security</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Payments are processed securely via our payment partners.</li>
          <li>Your information is encrypted and never shared with third parties.</li>
        </ul>
      </section>

      <section className="mt-8 space-y-3 text-muted-foreground leading-relaxed text-pretty">
        <h2 className="text-xl font-medium text-foreground">5. Contact Us</h2>
        <p>
          If you have any questions about your purchase, refunds, or technical issues, please contact us at{" "}
          <a
            href="mailto:hello@feedlooply.com"
            className="text-foreground underline decoration-primary underline-offset-4 hover:opacity-90"
          >
            hello@feedlooply.com
          </a>
          .
        </p>
      </section>
    </main>
  )
}
