"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SubscribeButton } from "./subscribe-button"

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex items-center justify-between px-4 md:px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold">
          {/* <span className="h-6 w-6 rounded-md bg-primary" aria-hidden /> */}
          <span className="text-sm md:text-base">Feedlooply</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">
            Features
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
            Pricing
          </a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground">
            FAQ
          </a>
          {/* Blogs link */}
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
            Blogs
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <SubscribeButton />
          </div>
          {/* mobile buttons */}
          <Button asChild className="md:hidden bg-transparent" variant="outline">
            <a href="/blog" aria-label="Read our blog">
              Blogs
            </a>
          </Button>
          <Button asChild className="md:hidden bg-transparent" variant="outline">
            <a href="#pricing" aria-label="See pricing">
              Pricing
            </a>
          </Button>
        </div>
      </nav>
    </header>
  )
}
