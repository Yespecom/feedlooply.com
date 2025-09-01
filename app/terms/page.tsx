export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
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
        <h2 className="text-xl font-medium text-foreground">2. 60-Day Launch Guarantee</h2>
        <p>We guarantee to ship the Phase 1 version within 60 days of your purchase.</p>
        <p>If Feedlooply fails to launch Phase 1 within 60 days, you are eligible for a full refund.</p>
      </section>

      <section className="mt-8 space-y-4 text-muted-foreground leading-relaxed text-pretty">
        <h2 className="text-xl font-medium text-foreground">3. Refund Policy</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-foreground">Full Refund:</span> If Phase 1 is not launched within 60 days,
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
