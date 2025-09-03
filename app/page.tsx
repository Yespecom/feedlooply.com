import { Hero } from "@/components/hero"
import { FeatureCards } from "@/components/feature-cards"
import { Pricing } from "@/components/pricing"
import { FAQ } from "@/components/faq"
import { StickyMobileCTA } from "@/components/sticky-mobile-cta"

export default function Page() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What if Feedlooply doesn’t launch in 40 days?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Full refund. Email hello@feedlooply.com with your transaction id; processed within 7 business days.",
        },
      },
      {
        "@type": "Question",
        name: "How do viewers post feedback?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hosts share a link or embed. Viewers click and can post/upvote without signup if host allows anonymous one-click feedback.",
        },
      },
      {
        "@type": "Question",
        name: "Is data private?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Boards can be public, private, or unlisted. Admins control permissions.",
        },
      },
      {
        "@type": "Question",
        name: "Can I get an invoice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — click “Request Invoice” after purchase or email hello@feedlooply.com.",
        },
      },
    ],
  }

  return (
    <main className="flex min-h-dvh flex-col" id="top">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <section id="features" className="container mx-auto px-4 md:px-6 lg:px-8 py-14 md:py-20">
        <FeatureCards />
      </section>
      <section id="pricing" className="container mx-auto px-4 md:px-6 lg:px-8 py-14 md:py-20 border-t">
        <Pricing />
      </section>
      <section id="faq" className="container mx-auto px-4 md:px-6 lg:px-8 py-14 md:py-20 border-t">
        <FAQ />
      </section>
      <StickyMobileCTA />
    </main>
  )
}
