import Link from "next/link"
import type { Metadata } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://feedlooply.com"

export const metadata: Metadata = {
  title: "Top 10 Canny Alternatives in 2025 (Affordable & Startup-Friendly)",
  description:
    "Looking for a Canny alternative? See the top 10 options with features, pricing, and USPs. Feedlooply offers a $47 lifetime early-access deal—perfect for startups.",
  alternates: { canonical: `${SITE_URL}/alternatives/canny-alternatives-2025` },
  openGraph: {
    title: "Top 10 Canny Alternatives in 2025 (Affordable & Startup-Friendly)",
    description:
      "Compare Canny alternatives side-by-side. See features, price, and which tools fit startups. Try Feedlooply early access for $47 lifetime.",
    url: `${SITE_URL}/alternatives/canny-alternatives-2025`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top 10 Canny Alternatives in 2025 (Affordable & Startup-Friendly)",
    description:
      "Compare Canny alternatives. Feedlooply offers an affordable $47 lifetime early-access deal—ideal for startups.",
  },
  keywords: [
    "Canny alternative",
    "Canny alternatives 2025",
    "feedback tool for startups",
    "affordable feedback board",
    "Feedlooply vs Canny",
  ],
}

function FAQJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the best affordable Canny alternative for startups?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Feedlooply provides feedback collection, triage, and product insights at a startup-friendly price, including a limited $47 lifetime early-access deal.",
        },
      },
      {
        "@type": "Question",
        name: "How does Feedlooply compare to Canny on pricing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Feedlooply is built to be cost-effective for solo founders and small teams—no enterprise overhead, transparent pricing, and a lifetime early-access option.",
        },
      },
      {
        "@type": "Question",
        name: "Can I migrate from Canny or other tools?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can import existing feedback and keep your voters and context. Our team can help with migration during early access.",
        },
      },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export default function CannyAlternativesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <FAQJsonLd />

      <header className="max-w-3xl">
        <p className="text-sm font-medium text-sky-600">Alternatives</p>
        <h1 className="mt-2 text-3xl md:text-5xl font-semibold text-pretty">
          Top 10 Canny Alternatives in 2025 (Affordable & Startup-Friendly)
        </h1>
        <p className="mt-4 text-muted-foreground">
          Startups look for alternatives when tools feel expensive or heavy. This guide lists practical options and
          helps you choose the right fit. We also explain why{" "}
          <Link className="underline text-sky-600" href="/#features">
            Feedlooply
          </Link>{" "}
          is designed for founders who want outcomes, not overhead.
        </p>
        <div className="mt-6">
          <Link
            href={{ pathname: "/", hash: "pricing" }}
            className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
          >
            Try Feedlooply Early Access — $47 Lifetime
          </Link>
        </div>
      </header>

      <section className="mt-10">
        <h2 className="text-2xl md:text-3xl font-semibold">Why Teams Look for Canny Alternatives</h2>
        <ul className="mt-4 list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Pricing grows quickly beyond early-stage budgets.</li>
          <li>Feature complexity vs. the team’s actual needs.</li>
          <li>Desire for simple triage and faster product signals.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl md:text-3xl font-semibold">Top 10 Alternatives (At-a-Glance)</h2>
        <p className="mt-3 text-muted-foreground">
          This list highlights features, price direction, and each tool’s unique edge (USP). Place your team’s needs
          first—choose what fits your stage.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border border-border text-sm">
            <thead>
              <tr className="bg-muted/40">
                <th className="p-3 text-left">Tool</th>
                <th className="p-3 text-left">Core Features</th>
                <th className="p-3 text-left">Price (typical)</th>
                <th className="p-3 text-left">USP</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "Feedlooply",
                  features: "Feedback board, triage to insights, AI signal clustering",
                  price: "$47 lifetime (early access)",
                  usp: "Built for startups; affordable and fast to insights",
                  highlight: true,
                },
                {
                  name: "Canny",
                  features: "Feedback boards, voting, roadmaps",
                  price: "$$–$$$",
                  usp: "Established ecosystem",
                },
                { name: "Upvoty", features: "Boards, changelog", price: "$–$$", usp: "Simple and lightweight" },
                { name: "Nolt", features: "Boards, voting, roadmap", price: "$–$$", usp: "Startup friendly" },
                {
                  name: "Hellonext",
                  features: "Boards, changelog, roadmaps",
                  price: "$$–$$$",
                  usp: "All-in-one suite",
                },
                {
                  name: "Productboard",
                  features: "Product discovery, prioritization",
                  price: "$$–$$$",
                  usp: "Enterprise discovery",
                },
                { name: "Rapidr", features: "Feedback + changelog", price: "$–$$", usp: "Modern UI, fair pricing" },
                {
                  name: "Sleekplan",
                  features: "Feedback + NPS + changelog",
                  price: "$–$$",
                  usp: "Suite for small teams",
                },
                { name: "Featurebase", features: "Voting, changelog", price: "$–$$", usp: "Clean and focused" },
                { name: "Pendo", features: "Analytics + guidance", price: "$$–$$$", usp: "Enterprise analytics" },
              ].map((r) => (
                <tr key={r.name} className={r.highlight ? "bg-sky-50/60 dark:bg-sky-950/20" : ""}>
                  <td className="p-3 font-medium">{r.name}</td>
                  <td className="p-3">{r.features}</td>
                  <td className="p-3">{r.price}</td>
                  <td className="p-3">{r.usp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-muted-foreground">
          Prefer a deeper comparison? See{" "}
          <Link className="underline text-sky-600" href="/blog/canny-alternative-feedlooply">
            Feedlooply — Affordable Canny Alternative for Startups
          </Link>
          .
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl md:text-3xl font-semibold">Who Should Pick Feedlooply?</h2>
        <p className="mt-3 text-muted-foreground">
          If you’re a solo founder or a small crew that wants clear signals from feedback without enterprise complexity,
          Feedlooply is a great fit. It ships with{" "}
          <Link className="underline text-sky-600" href={{ pathname: "/", hash: "features" }}>
            conversion-focused features
          </Link>{" "}
          and a clean triage workflow that moves ideas to outcomes.
        </p>
        <div className="mt-6">
          <Link
            href={{ pathname: "/", hash: "pricing" }}
            className="inline-flex items-center rounded-md bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
          >
            Get the $47 Lifetime Deal
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl md:text-3xl font-semibold">FAQs</h2>
        <div className="mt-3 space-y-4">
          <div>
            <h3 className="font-medium">Is Feedlooply a true Canny alternative?</h3>
            <p className="text-muted-foreground">
              Yes—especially for early-stage teams that need a fast feedback loop and sensible pricing.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Do I need to migrate data?</h3>
            <p className="text-muted-foreground">
              You can start fresh or import existing feedback. We’ll help during early access.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Will the lifetime deal remain?</h3>
            <p className="text-muted-foreground">It’s limited for early adopters. Lock it in before public launch.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
