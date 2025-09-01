"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { MobileConfirmation } from "@/components/mobile-confirmation"

export function SubscribeButton({ variant = "default" as const }) {
  const [email, setEmail] = useState("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCongrats, setShowCongrats] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const isMobile = useIsMobile()

  async function onSubmit() {
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({ title: "Enter a valid email", description: "Please check your email format and try again." })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        try {
          await fetch("/api/notify", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email, type: "subscribe" }),
          })
        } catch {}
        toast({ title: "Subscribed", description: "We’ll keep you posted with updates." })
        setOpen(false)
        setEmail("")
        setShowCongrats(true)
        if (isMobile) setConfirmOpen(true)
        setTimeout(() => setShowCongrats(false), 4000)
      } else {
        const msg = await res.text()
        toast({ title: "Subscription failed", description: msg || "Please try again later." })
      }
    } catch {
      toast({ title: "Network error", description: "Please try again later." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!isMobile && showCongrats && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-50 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          Congratulations — you’re subscribed!
        </div>
      )}

      <MobileConfirmation
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Subscribed"
        message="You're all set! Check your email for confirmation and next steps."
        ctaLabel="Okay"
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={variant === "default" ? "default" : "outline"} className="whitespace-nowrap">
            Subscribe
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Subscribe to updates</DialogTitle>
            <DialogDescription>Get progress, launch updates, and early invites to Feedlooply.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <Label htmlFor="subscribe-email" className="sr-only">
              Email
            </Label>
            <Input
              id="subscribe-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button onClick={onSubmit} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
