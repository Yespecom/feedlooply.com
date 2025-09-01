import { NextResponse } from "next/server"

function getRazorpayCreds() {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) return null
  return { keyId, keySecret }
}

function inferDisplayCurrencyFromCountry(country?: string): "INR" | "USD" | "EUR" | "GBP" {
  if (!country) return "INR"
  const c = country.toUpperCase()
  if (c === "IN") return "INR"
  if (c === "US") return "USD"
  if (c === "GB" || c === "UK") return "GBP"
  // basic EUR zone mapping (not exhaustive)
  const eur = new Set([
    "DE",
    "FR",
    "ES",
    "IT",
    "NL",
    "IE",
    "PT",
    "BE",
    "AT",
    "FI",
    "GR",
    "LV",
    "LT",
    "EE",
    "CY",
    "LU",
    "MT",
    "SI",
    "SK",
  ])
  if (eur.has(c)) return "EUR"
  // fallback
  return "INR"
}

export async function POST(req: Request) {
  try {
    const creds = getRazorpayCreds()
    if (!creds) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing Razorpay credentials. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in Project Settings.",
        },
        { status: 500 },
      )
    }

    const body = await req.json().catch(() => ({}) as any)

    const explicitCountry = typeof body?.country === "string" ? body.country : undefined
    const country =
      (explicitCountry ||
        req.headers.get("x-vercel-ip-country") ||
        req.headers.get("x-country-code") ||
        req.headers.get("cf-ipcountry") ||
        undefined) ??
      undefined

    const knownCountry = country?.toUpperCase()
    const isOutsideIndia = !!knownCountry && knownCountry !== "IN"

    const PRICE_INR_PAISE = 399_900// ₹3,999.00 in paise
    const PRICE_USD_CENTS = 4_763 // $47.63 in cents

    const currency: "INR" | "USD" =
      body?.currency === "INR" || body?.currency === "USD" ? body.currency : isOutsideIndia ? "USD" : "INR"

    const amount: number =
      typeof body?.amount === "number" && body.amount > 0
        ? body.amount
        : currency === "INR"
          ? PRICE_INR_PAISE
          : PRICE_USD_CENTS

    const receipt = (body?.receipt as string | undefined) || `rcpt_${Date.now()}`
    const payload = { amount, currency, receipt }

    const auth = Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString("base64")

    async function createOrder(p: typeof payload) {
      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${auth}`,
        },
        body: JSON.stringify(p),
      })
      const data = await res.json()
      return { ok: res.ok, status: res.status, data }
    }

    // First attempt with chosen currency
    const orderAttempt = await createOrder(payload)

    // If USD fails (e.g., account not enabled), transparently fall back to INR but display USD
    if (!orderAttempt.ok && currency === "USD") {
      const fallbackPayload = { amount: PRICE_INR_PAISE, currency: "INR" as const, receipt }
      const fallback = await createOrder(fallbackPayload)
      if (fallback.ok) {
        return NextResponse.json({
          ok: true,
          order: fallback.data,
          keyId: creds.keyId,
          displayCurrency: "USD", // show USD while charging INR
        })
      }
      return NextResponse.json(
        { ok: false, error: orderAttempt.data?.error?.description || "Razorpay error", data: orderAttempt.data },
        { status: orderAttempt.status || 500 },
      )
    }

    if (!orderAttempt.ok) {
      return NextResponse.json(
        { ok: false, error: orderAttempt.data?.error?.description || "Razorpay error", data: orderAttempt.data },
        { status: orderAttempt.status || 500 },
      )
    }

    return NextResponse.json({
      ok: true,
      order: orderAttempt.data,
      keyId: creds.keyId,
      displayCurrency: currency, // usually same as charge currency
    })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "Unknown error" }, { status: 500 })
  }
}
