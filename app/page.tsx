import { Hero } from "@/components/hero"
import { FeatureCards } from "@/components/feature-cards"
import { Pricing } from "@/components/pricing"
import { FAQ } from "@/components/faq"
import { StickyMobileCTA } from "@/components/sticky-mobile-cta"

export default function Page() {
  return (
    <main className="flex min-h-dvh flex-col" id="top">
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
