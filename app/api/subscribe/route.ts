import { NextResponse } from "next/server"
import { appendSubscriber } from "../../../lib/google-sheets"

export async function POST(request: Request) {
  try {
    const { email, name, country } = await request.json().catch(() => ({}))
    if (typeof email !== "string" || !/\S+@\S+\.\S+/.test(email)) {
      return new NextResponse("Invalid email", { status: 400 })
    }

    // Optional: forward to a webhook if provided (e.g., Zapier, Make, ConvertKit)
    const webhook = process.env.SUBSCRIBE_WEBHOOK_URL
    if (webhook) {
      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, source: "feedlooply-landing" }),
        })
      } catch {
        // Best-effort; still return success so the UX isn't blocked
      }
    } else {
      // Minimal fallback: log (non-persistent in serverless preview)
      console.log("[Feedlooply] New subscriber:", email)
    }
    ;(async () => {
      try {
        await appendSubscriber({
          email,
          name,
          country,
          source: "feedlooply-landing",
          createdAt: new Date().toISOString(),
        })
      } catch {
        // ignore errors to avoid impacting UX
      }
    })()

    return NextResponse.json({ ok: true })
  } catch {
    return new NextResponse("Something went wrong", { status: 500 })
  }
}
