"use client"
import { Share2, Linkedin, RedoDot as Reddit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import * as React from "react"

export function ShareButton({
  url,
  title = "Check this out",
  variant = "outline",
  showNetworks = true,
}: {
  url?: string
  title?: string
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  showNetworks?: boolean
}) {
  const { toast } = useToast()
  // resolve share URL on the client to avoid empty SSR hrefs
  const [shareUrl, setShareUrl] = React.useState<string>("")
  React.useEffect(() => {
    if (url) {
      setShareUrl(url)
    } else if (typeof window !== "undefined") {
      setShareUrl(window.location.href)
    }
  }, [url])

  async function handleShare() {
    try {
      if (navigator.share && shareUrl) {
        await navigator.share({ title, url: shareUrl })
      } else if (shareUrl) {
        // fallback: copy to clipboard
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareUrl)
          toast({ title: "Link copied to clipboard" })
        } else {
          // last resort: open a small window people can copy from
          window.open(shareUrl, "_blank", "noopener,noreferrer")
        }
      }
    } catch {
      // canceled or error — show a soft toast
      toast({ title: "Share canceled", description: "You can copy the link instead." })
    }
  }

  const encodedUrl = shareUrl ? encodeURIComponent(shareUrl) : ""
  const encodedTitle = encodeURIComponent(title)
  const linkedinHref = encodedUrl ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` : "#"
  const redditHref = encodedUrl ? `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}` : "#"

  return (
    <div className="flex items-center gap-2">
      <Button onClick={handleShare} variant={variant} size="sm" aria-label="Share this article">
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
      {showNetworks && (
        <>
          <a
            href={linkedinHref}
            target={encodedUrl ? "_blank" : undefined}
            rel={encodedUrl ? "noopener noreferrer" : undefined}
            aria-label="Share on LinkedIn"
            className="inline-flex"
          >
            <Button variant="ghost" size="icon" disabled={!encodedUrl}>
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </a>
          <a
            href={redditHref}
            target={encodedUrl ? "_blank" : undefined}
            rel={encodedUrl ? "noopener noreferrer" : undefined}
            aria-label="Share on Reddit"
            className="inline-flex"
          >
            <Button variant="ghost" size="icon" disabled={!encodedUrl}>
              <Reddit className="h-4 w-4" />
              <span className="sr-only">Reddit</span>
            </Button>
          </a>
        </>
      )}
    </div>
  )
}
