"use client"
import { CheckCircle2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

type MobileConfirmationProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  message?: string
  ctaLabel?: string
}

export function MobileConfirmation({
  open,
  onOpenChange,
  title = "Success",
  message = "You're all set. Check your email for details.",
  ctaLabel = "Okay",
}: MobileConfirmationProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="md:hidden p-6">
        <SheetHeader className="items-center">
          <CheckCircle2 className="h-10 w-10 text-green-600" aria-hidden="true" />
          <SheetTitle className="mt-2 text-center">{title}</SheetTitle>
        </SheetHeader>

        <div className="mt-3 text-center text-sm text-muted-foreground">{message}</div>

        <div className="mt-6 flex justify-center">
          <Button onClick={() => onOpenChange(false)} aria-label={ctaLabel}>
            {ctaLabel}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
