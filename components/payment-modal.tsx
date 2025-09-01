"use client"

import { useState, useCallback } from "react"
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileConfirmation } from "@/components/mobile-confirmation"

declare global {
  interface Window {
    Razorpay?: any
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export function PaymentModal() {
  const [step, setStep] = useState<"signup" | "pay" | "success">("signup")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [txnId, setTxnId] = useState<string | null>(null)
  const [showCongrats, setShowCongrats] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const isMobile = useIsMobile()

  const validEmail = (e: string) => /\S+@\S+\.\S+/.test(e)
  const valid = name.trim() && validEmail(email) && password.length >= 8 && agree

  const handleContinue = () => {
    if (!valid) return
    setStep("pay")
  }

  const handlePay = useCallback(async () => {
    setLoading(true)

    const ok = await loadRazorpayScript()
    if (!ok) {
      setLoading(false)
      toast({ title: "Payment unavailable", description: "Failed to load payment SDK. Please try again." })
      return
    }

    let clientCountry: string | undefined
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""
      const lang = (navigator.languages && navigator.languages[0]) || navigator.language || ""
      if (tz === "Asia/Kolkata" || /-IN$/i.test(lang) || /\bIN\b/i.test(lang)) {
        clientCountry = "IN"
      }
    } catch {
      // ignore
    }

    let amount: number | undefined
    let orderId: string | undefined
    let publicKey: string | undefined
    let orderCurrency: string | undefined
    let displayCurrency: string | undefined

    try {
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          country: clientCountry, // "IN" if detected (timezone/lang); undefined otherwise
        }),
      })

      if (!orderRes.ok) {
        const finalErr = await orderRes.json().catch(() => ({}))
        toast({
          title: "Could not start payment",
          description: finalErr?.error || "Order creation failed. Please try again.",
        })
        setLoading(false)
        return
      }

      const json = (await orderRes.json()) as any
      const { order, keyId, displayCurrency: serverDisplayCurrency } = json
      orderId = order?.id
      publicKey = keyId
      orderCurrency = order?.currency
      amount = order?.amount
      displayCurrency = serverDisplayCurrency

      if (!orderId || !publicKey || !orderCurrency || !amount) {
        toast({ title: "Order error", description: "Missing order details. Please try again." })
        setLoading(false)
        return
      }
    } catch {
      toast({ title: "Network error", description: "Could not create order. Please try again." })
      setLoading(false)
      return
    }

    const options: any = {
      key: publicKey,
      order_id: orderId,
      amount,
      currency: orderCurrency,
      name: "Feedlooply",
      description: "Lifetime Access - Early Founder",
      prefill: { name, email },
      theme: { color: "#4F46E5" },
      handler: async (response: any) => {
        try {
          const res = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              name,
              email,
              plan: "LTD",
            }),
          })

          if (res.ok) {
            const data = await res.json().catch(() => ({}))
            const txId = data?.txId ?? response.razorpay_payment_id
            setTxnId(txId)

            try {
              const emailAmount = typeof amount === "number" ? (amount / 100).toFixed(2) : undefined

              await fetch("/api/notify", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  type: "paid",
                  email,
                  name,
                  txId,
                  amount: emailAmount,
                  currency: orderCurrency,
                  plan: "Early Founder Lifetime Deal — one-time, lifetime access",
                  accountEmail: email,
                  tempPassword: password,
                }),
              })
            } catch {}

            setStep("success")
            setShowCongrats(true)
            if (isMobile) setConfirmOpen(true)
          } else {
            const err = await res.json().catch(() => ({}))
            toast({
              title: "Verification failed",
              description: err?.error || "We could not verify the payment. Please contact support.",
            })
          }
        } catch {
          toast({ title: "Network error", description: "Please try again or contact support." })
        } finally {
          setLoading(false)
        }
      },
      modal: {
        ondismiss: () => {
          setLoading(false)
        },
      },
    }

    if (displayCurrency && displayCurrency !== orderCurrency) {
      options.display_currency = displayCurrency
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }, [name, email, password, isMobile])

  return (
    <DialogContent className="sm:max-w-lg">
      <MobileConfirmation
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="You're in!"
        message="Payment received. Check your email for your receipt and next steps."
        ctaLabel="Great"
      />

      {step === "signup" && (
        <>
          <DialogHeader>
            <DialogTitle>Join Early Access</DialogTitle>
            <DialogDescription>
              Create your account to reserve lifetime access. Your payment is protected by our 60-day launch guarantee.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Founder" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="agree" checked={agree} onCheckedChange={(c) => setAgree(Boolean(c))} />
              <Label htmlFor="agree" className="text-sm text-muted-foreground">
                I agree to the Terms & Refund Policy.
              </Label>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between gap-2">
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleContinue}
              disabled={!valid}
              aria-disabled={!valid}
            >
              Continue to Payment
            </Button>
          </DialogFooter>
        </>
      )}

      {step === "pay" && (
        <>
          <DialogHeader>
            <DialogTitle>Secure Payment</DialogTitle>
            <DialogDescription>Razorpay supports international cards and UPI.</DialogDescription>
          </DialogHeader>
          <div className="py-2 text-sm text-muted-foreground">
            Name: {name || "—"} <br />
            Email: {email || "—"}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStep("signup")}>
              Back
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handlePay} disabled={loading}>
              {loading ? "Processing..." : "Pay with Razorpay"}
            </Button>
          </DialogFooter>
        </>
      )}

      {step === "success" && (
        <>
          {!isMobile && showCongrats && (
            <div
              role="status"
              aria-live="polite"
              className="mb-3 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
            >
              Congratulations — your lifetime access is active!
            </div>
          )}
          <DialogHeader>
            <DialogTitle>🎉 You’re in!</DialogTitle>
            <DialogDescription>We’ve received your payment. Welcome to Feedlooply Early Access.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div>
              Transaction: <span className="font-mono">{txnId ?? "—"}</span>
            </div>
            <div>Next steps: You’ll get an email with your receipt and a Slack/Discord invite shortly.</div>
          </div>
          <DialogFooter className="flex items-center justify-between gap-2">
           
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Go to Dashboard (coming soon)</Button>
          </DialogFooter>
        </>
      )}
    </DialogContent>
  )
}
