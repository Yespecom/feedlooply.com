import { Hero } from "@/components/hero"
import { FeatureCards } from "@/components/feature-cards"
import { Pricing } from "@/components/pricing"
import { FAQ } from "@/components/faq"
import { StickyMobileCTA } from "@/components/sticky-mobile-cta"
import { WebinarCard } from "@/components/webinar-card"

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

      <section className="bg-white dark:bg-gray-900 py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-6">
              🎯 Exclusive Event
            </div>
            <h2 className="text-4xl md:text-5xl font-normal text-gray-900 dark:text-white mb-6 tracking-tight">
              Join Our Exclusive Webinar
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Learn how to transform user feedback into winning product features with industry experts
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <WebinarCard />
            </div>
          </div>
        </div>
      </section>

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
