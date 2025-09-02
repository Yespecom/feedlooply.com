"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { PaymentModal } from "./payment-modal"
import { cn } from "@/lib/utils"
import { SubscribeButton } from "./subscribe-button"
import { MessageSquare, Brain, Kanban } from "lucide-react"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <header className="relative overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-indigo-500/10 to-transparent dark:from-indigo-400/15 dark:to-transparent"
        aria-hidden
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="mx-auto max-w-6xl h-full opacity-10" aria-hidden />
      </div>

      <div className="container mx-auto px-4 md:px-6 pt-20 pb-12 md:pt-28 md:pb-20">
        <div className="grid items-center gap-8 md:gap-12 md:grid-cols-2">
          {/* Left: Copy */}
          <div className="space-y-7">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-xs uppercase tracking-wide text-muted-foreground"
            >
              Simple feedback. Clear roadmap.
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className={cn("text-pretty text-3xl font-semibold tracking-tight md:text-5xl")}
            >
              Collect feedback. See patterns. Build what matters.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-pretty text-muted-foreground md:text-lg"
            >
              Feedlooply helps you collect feedback, group similar ideas with AI, and turn them into a clear roadmap.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground"
            >
              Early Founder Lifetime Deal — one-time, lifetime access
            </motion.div>
            <motion.p
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.14 }}
  className="text-xs text-muted-foreground"
>
  Join 20+ early users
</motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto h-9 px-3 text-xs md:h-11 md:px-6 md:text-base bg-indigo-600 hover:bg-indigo-700 text-white shadow transition-transform hover:scale-[1.02]">
                    Get Lifetime Deal — ₹3,999 / $47.63
                  </Button>
                </DialogTrigger>
                <PaymentModal />
              </Dialog>

              <SubscribeButton variant="outline" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-xs text-muted-foreground"
            >
              Payments via Razorpay (global cards & UPI). Monthly plans coming soon.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="mt-4 flex flex-wrap items-center gap-4"
              aria-label="Trust badges"
            >
              <span className="text-xs text-muted-foreground">Secure checkout via Razorpay</span>
              <span className="text-xs text-muted-foreground">40-Day Launch Guarantee</span>
            </motion.div>
          </div>

          {/* Right: Simple feedback-flow artwork */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-xl border bg-card p-5 md:p-6">
              <div className="grid gap-5">
                <motion.div
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="rounded-lg border bg-background p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <MessageSquare className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <div className="text-sm font-medium">Collect</div>
                      <div className="text-xs text-muted-foreground">Widget, links — YouTube, Meet, Slack</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="rounded-lg border bg-background p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                      <Brain className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <div className="text-sm font-medium">Understand</div>
                      <div className="text-xs text-muted-foreground">AI clusters, sentiment, dedupe</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="rounded-lg border bg-background p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                      <Kanban className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <div className="text-sm font-medium">Decide</div>
                      <div className="text-xs text-muted-foreground">Roadmap & changelog automation</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
