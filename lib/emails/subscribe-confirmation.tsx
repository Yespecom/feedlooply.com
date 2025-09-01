import { emailLayout } from "./layout"

export function subscribeConfirmationEmail(params: { name?: string }) {
  const first = params.name?.trim() || "there"
  const body = `
    <p style="margin:0 0 12px 0;">Hi ${first},</p>
    <p style="margin:0 0 12px 0;">Thanks for subscribing to Feedlooply. You’ll get early access invites, product updates, and news about our <strong>Early Founder Lifetime Deal — one-time, lifetime access</strong>.</p>
    <p style="margin:0 0 8px 0;">What’s next:</p>
    <ul style="margin:0 0 12px 18px;padding:0;">
      <li>Occasional emails — only when it’s truly useful</li>
      <li>Early-feature announcements and changelogs</li>
      <li>Ways to collect better feedback with Feedlooply</li>
    </ul>
    <div style="margin:16px 0 0 0;">
      <a class="button" href="https://feedlooply.com" target="_blank" rel="noopener noreferrer">See the lifetime deal</a>
    </div>
  `
  return emailLayout(body, { title: "Thanks for subscribing" })
}
