import { emailLayout } from "./layout"

export function adminNotifyEmail(params: {
  type: "subscribe" | "paid"
  email: string
  name?: string
  meta?: Record<string, any>
}) {
  const title = params.type === "paid" ? "New Paid Customer" : "New Subscriber"
  const body = `
    <p style="margin:0 0 12px 0;"><strong>${title}</strong></p>
    <p style="margin:0 0 4px 0;">Name: ${params.name || "-"}</p>
    <p style="margin:0 0 12px 0;">Email: <a href="mailto:${params.email}">${params.email}</a></p>
    ${
      params.meta
        ? `<pre style="margin:0;padding:12px;background:#F3F4F6;border:1px solid #E5E7EB;border-radius:8px;font-size:12px;line-height:18px;white-space:pre-wrap;overflow:auto;">${JSON.stringify(
            params.meta,
            null,
            2,
          )}</pre>`
        : ""
    }
  `
  return emailLayout(body, { title })
}
