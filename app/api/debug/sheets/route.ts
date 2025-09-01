import { NextResponse } from "next/server"
import { appendSubscriberRow, appendPaymentRow } from "@/lib/google-sheets"

export async function GET() {
  try {
    const ts = new Date().toISOString()
    await appendSubscriberRow({
      email: `debug+${Math.random().toString(36).slice(2)}@example.com`,
      name: "Debug Subscriber",
      source: "debug-route",
    })
    await appendPaymentRow({
      email: `debug+pay@example.com`,
      name: "Debug Payer",
      amount: 1,
      currency: "USD",
      plan: "debug",
      status: "paid",
      orderId: `ord_${ts}`,
      paymentId: `pay_${ts}`,
    })
    return NextResponse.json({ ok: true, message: "Wrote test rows (check your sheets). See server logs for details." })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 })
  }
}
