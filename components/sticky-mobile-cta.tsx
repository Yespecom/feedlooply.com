"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { PaymentModal } from "./payment-modal"

export function StickyMobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div>
          <div className="text-sm font-medium">Lifetime Access</div>
          <div className="text-xs text-muted-foreground">₹3,999 / $47.63</div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Reserve</Button>
          </DialogTrigger>
          <PaymentModal />
        </Dialog>
      </div>
    </div>
  )
}
