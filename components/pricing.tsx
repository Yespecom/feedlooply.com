"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { PaymentModal } from "./payment-modal"

export function Pricing() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="text-balance text-2xl font-semibold md:text-3xl">Early Founder Lifetime Deal</h2>
      <p className="mt-3 text-muted-foreground">
        ₹3,999 / $47.63 one-time. Lifetime access to Phase 1 features, founder community, and roadmap votes. 60-Day
        Launch Guarantee — full refund if we don’t ship in 60 days.
      </p>

      <div className="mt-8 rounded-xl border p-6 md:p-8 lg:p-10 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 dark:from-indigo-400/10 dark:to-cyan-400/10">
        <div className="text-4xl font-semibold">
          ₹3,999 <span className="text-base font-normal text-muted-foreground">/ $47.63</span>
        </div>
        <ul className="mt-5 space-y-2.5 md:space-y-3 text-left text-sm md:text-base text-muted-foreground">
          <li>• Lifetime access to Phase 1 features</li>
          <li>• Founder community + roadmap votes</li>
          <li>• Refund within 7 days if guarantee triggers</li>
          <li>• International cards & UPI supported</li>
        </ul>

        <div className="mt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white shadow">
                Reserve Lifetime Access
              </Button>
            </DialogTrigger>
            <PaymentModal />
          </Dialog>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Future plans: Free, Starter, Growth, Pro — subscription post-launch.
        </p>
      </div>
    </div>
  )
}
