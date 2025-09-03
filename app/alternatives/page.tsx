import Link from "next/link"

export const metadata = {
  title: "Feedlooply Alternatives Hub – Compare Feedback Tools",
  description:
    "Explore Canny alternatives and other feedback tools for startups. Compare features, pricing, and choose an affordable solution. Try Feedlooply early access.",
  alternates: { canonical: "/alternatives" },
}

export default function AlternativesIndexPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl md:text-4xl font-semibold text-pretty">Alternatives Hub: Find the Right Feedback Tool</h1>
      <p className="mt-4 text-muted-foreground">
        Evaluating feedback tools? Start here. We compare popular platforms and explain where Feedlooply shines for
        startups and indie teams.
      </p>

      <ul className="mt-8 list-disc pl-6 space-y-3">
        <li>
          <Link className="text-sky-600 underline" href="/alternatives/canny-alternatives-2025">
            Top 10 Canny Alternatives in 2025 (Affordable & Startup-Friendly)
          </Link>
        </li>
        {/* You can add more comparison pages here later */}
      </ul>
    </main>
  )
}
