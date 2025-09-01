import { NextResponse } from "next/server"
import crypto from "crypto"
import { appendPayment } from "../../../lib/google-sheets"

function getRazorpayCreds() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) return null
  return { keyId, keySecret }
}

export async function POST(request: Request) {
  try {
    const creds = getRazorpayCreds()
    if (!creds) {
      return NextResponse.json(
        { ok: false, error: "Missing Razorpay credentials. Add RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET." },
        { status: 500 },
      )
    }

    const body = await request.json().catch(() => ({}))
    const paymentId = body?.razorpay_payment_id as string | undefined
    const orderId = body?.razorpay_order_id as string | undefined
    const signature = body?.razorpay_signature as string | undefined

    if (!paymentId || !orderId || !signature) {
      return NextResponse.json({ ok: false, error: "Missing payment verification fields." }, { status: 400 })
    }

    // Verify signature = HMAC_SHA256(order_id + '|' + payment_id, key_secret)
    const expectedSignature = crypto
      .createHmac("sha256", creds.keySecret as string)
      .update(`${orderId}|${paymentId}`)
      .digest("hex")

    if (expectedSignature !== signature) {
      return NextResponse.json({ ok: false, error: "Invalid signature. Verification failed." }, { status: 400 })
    }

    // We accept optional metadata from the client to record details.
    const { email, name, amount, currency, country, plan } = body || {}

    let wroteToSheets = false
    try {
      if (email && amount && currency) {
        await appendPayment({
          email,
          name,
          amount: Number(amount),
          currency: String(currency),
          country: country ? String(country) : undefined,
          plan: plan ? String(plan) : undefined,
          status: "success",
          orderId,
          paymentId,
          createdAt: new Date().toISOString(),
        })
        wroteToSheets = true
      }
    } catch (e: any) {
      // Keep UX smooth but surface logs for debugging
      console.log("[v0][sheets] appendPayment error:", e?.message || e)
    }

    // TODO: persist body.name, body.email, paymentId, plan, timestamp
    return NextResponse.json({ ok: true, txId: paymentId, wroteToSheets })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 })
  }
}
