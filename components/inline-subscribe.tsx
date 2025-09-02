"use client"
import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function InlineSubscribe({ source }: { source?: string }) {
  const { toast } = useToast()
  const [email, setEmail] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({ title: "Enter a valid email" })
      return
    }
    setLoading(true)
    try {
      // Send to main subscribe API
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, source }),
      })

      if (!res.ok) {
        const msg = await res.text().catch(() => "")
        toast({ title: "Subscription failed", description: msg || "Please try again later." })
        setLoading(false)
        return
      }

      // Fire-and-forget notify for emails/admin + sheets
      try {
        await fetch("/api/notify", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            type: "subscribe",
            email,
            meta: { source: source || "inline-subscribe" },
          }),
        })
      } catch {
        // non-blocking
      }

      toast({ title: "Subscribed!", description: "Thanks for joining the list." })
      setEmail("")
    } catch {
      toast({ title: "Network error", description: "Please try again later." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-3 md:flex-row md:items-center" aria-live="polite">
      <label htmlFor="inline-subscribe-email" className="sr-only">
        Email address
      </label>
      <Input
        id="inline-subscribe-email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        type="email"
        className="h-11"
        aria-label="Email address"
        aria-invalid={email.length > 0 && !/^\S+@\S+\.\S+$/.test(email)}
        disabled={loading}
      />
      <Button type="submit" className="h-11" disabled={loading} aria-disabled={loading}>
        {loading ? "Subscribing..." : "Subscribe"}
      </Button>
      {source && <input type="hidden" name="source" value={source} />}
    </form>
  )
}
