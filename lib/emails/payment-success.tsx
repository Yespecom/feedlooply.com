import { emailLayout } from "./layout"

export function paymentSuccessEmail(params: {
  name?: string
  amount?: string
  currency?: string
  plan?: string
  transactionId?: string
  accountEmail?: string
  tempPassword?: string
}) {
  const first = params.name?.trim() || "there"
  const plan = params.plan || "Early Founder Lifetime Deal — one-time, lifetime access"
  const value = [params.currency, params.amount].filter(Boolean).join(" ")

  const txBlock = params.transactionId
    ? `<p style="margin:0 0 12px 0;">Transaction ID: <code style="background:#f6f6f6;border-radius:4px;padding:2px 6px;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">${params.transactionId}</code></p>`
    : ""

  const credsBlock =
    params.accountEmail && params.tempPassword
      ? `<div style="margin:16px 0 12px 0;padding:12px;border:1px solid #e6f0ff;border-radius:8px;background:#f6faff;">
           <p style="margin:0 0 8px 0;">
             <strong>Your account details</strong> — you can change your password later from settings:
           </p>
           <p style="margin:0 0 4px 0;">
             <strong>Email:</strong>
             <code style="background:#f6f6f6;border-radius:4px;padding:2px 6px;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
               ${params.accountEmail}
             </code>
           </p>
           <p style="margin:0;">
             <strong>Password:</strong>
             <code style="background:#f6f6f6;border-radius:4px;padding:2px 6px;font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
               ${params.tempPassword}
             </code>
           </p>
         
         </div>`
      : ""

  const body = `
    <p style="margin:0 0 12px 0;">Hi ${first},</p>
    <p style="margin:0 0 12px 0;">Your payment for <strong>${plan}</strong>${value ? ` (${value})` : ""} was successful.</p>
    ${txBlock}
    ${credsBlock}
    <p style="margin:0 0 8px 0;">You now have lifetime access to Feedlooply’s early‑founder benefits. Here’s what to expect:</p>
    <ul style="margin:0 0 12px 18px;padding:0;">
      <li>Immediate confirmation — this email is your receipt</li>
      <li>Access details sent to your inbox shortly</li>
      <li>Early feature releases and roadmap previews</li>
    </ul>
    <p style="margin:0 0 16px 0;">Need anything? Just reply to this email and we’ll help you out.</p>
    <div style="margin:16px 0 0 0;">
      <a class="button" href="https://feedlooply.com" target="_blank" rel="noopener noreferrer">View your benefits</a>
    </div>
  `
  return emailLayout(body, { title: "Payment successful — Welcome!" })
}
