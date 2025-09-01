import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"
import { subscribeConfirmationEmail } from "@/lib/emails/subscribe-confirmation"
import { paymentSuccessEmail } from "@/lib/emails/payment-success"
import { adminNotifyEmail } from "@/lib/emails/admin-notify"
import { appendSubscriberRow, appendPaymentRow } from "@/lib/google-sheets"

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATIONS_EMAIL || process.env.ADMIN_EMAIL || "srinithinoffl@gmail.com"
const FROM = process.env.SMTP_FROM || "Feedlooply <no-reply@feedlooply.com>"

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const { type, email, name, amount, currency, plan } = payload || {}
    const meta = (payload?.meta as any) || {}
    const txId = payload?.txId || meta?.txId
    const accountEmail = payload?.accountEmail || email
    const tempPassword = payload?.tempPassword

    const country =
      (payload?.country as string | undefined) ||
      (meta?.country as string | undefined) ||
      (payload?.geo?.country as string | undefined)
    let wroteToSheets = false

    if (!type || !email) {
      return NextResponse.json({ error: "Missing type or email" }, { status: 400 })
    }

    if (type === "subscribe") {
      await sendEmail({
        to: email,
        subject: "Feedlooply — Thanks for subscribing",
        html: subscribeConfirmationEmail({ name }),
      })
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: "Feedlooply — New Subscriber",
        html: adminNotifyEmail({ type: "subscribe", email, name, meta }),
      })

      try {
        await appendSubscriberRow({
          email,
          name,
          country,
          source: meta?.source || "notify",
        })
        wroteToSheets = true
      } catch (e) {
        console.error("[notify] sheets subscribe append error:", (e as Error)?.message)
      }
    } else if (type === "paid") {
      await sendEmail({
        to: email,
        subject: "Feedlooply — Payment successful (Lifetime Deal)",
        html: paymentSuccessEmail({
          name,
          amount,
          currency,
          plan,
          transactionId: txId,
          accountEmail,
          tempPassword,
        }),
      })
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: "Feedlooply — New Paid Customer",
        html: adminNotifyEmail({ type: "paid", email, name, meta: { ...meta, txId } }),
      })

      try {
        await appendPaymentRow({
          email,
          name,
          amount: typeof amount === "number" ? amount : Number(amount || 0),
          currency: currency || "INR",
          country,
          plan: plan || "Lifetime",
          status: meta?.status || "success",
          orderId: meta?.order_id || meta?.orderId || meta?.order || "",
          paymentId: txId || meta?.payment_id || meta?.paymentId || "",
        })
        wroteToSheets = true
      } catch (e) {
        console.error("[notify] sheets payment append error:", (e as Error)?.message)
      }
    } else {
      return NextResponse.json({ error: "Unknown type" }, { status: 400 })
    }

    return NextResponse.json({ ok: true, wroteToSheets })
  } catch (err: any) {
    console.error("[notify] error", err?.message)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
