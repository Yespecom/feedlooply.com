"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SubscribeButton } from "./subscribe-button"
import { usePathname } from "next/navigation"

type NavHashLinkProps = {
  id: string
  className?: string
  children: React.ReactNode
}

function NavHashLink({ id, className, children }: NavHashLinkProps) {
  const pathname = usePathname()

  if (pathname === "/") {
    // Already on homepage: smooth-scroll without full navigation
    return (
      <a
        href={`/#${id}`}
        className={className}
        onClick={(e) => {
          e.preventDefault()
          const el = document.getElementById(id)
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        }}
      >
        {children}
      </a>
    )
  }

  // On another page (e.g., blog): navigate to home then scroll
  return (
    <Link href={{ pathname: "/", hash: id }} className={className}>
      {children}
    </Link>
  )
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex items-center justify-between px-4 md:px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2 font-semibold">
          {/* <span className="h-6 w-6 rounded-md bg-primary" aria-hidden /> */}
          <span className="text-sm md:text-base">Feedlooply</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <NavHashLink id="features" className="text-sm text-muted-foreground hover:text-foreground">
            Features
          </NavHashLink>
          <NavHashLink id="pricing" className="text-sm text-muted-foreground hover:text-foreground">
            Pricing
          </NavHashLink>
          <NavHashLink id="faq" className="text-sm text-muted-foreground hover:text-foreground">
            FAQ
          </NavHashLink>
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
            <Link href="/blog" aria-label="Read our blog">
              Blogs
            </Link>
          </Button>
          <Button asChild className="md:hidden bg-transparent" variant="outline">
            {/*
              When already on "/", render an anchor that smooth-scrolls.
              Otherwise, navigate to "/#pricing" and the page will scroll on load.
            */}
            {(() => {
              const pathname = typeof window !== "undefined" ? window.location.pathname : undefined
              if (pathname === "/") {
                return (
                  <a
                    href="/#pricing"
                    aria-label="See pricing"
                    onClick={(e) => {
                      e.preventDefault()
                      const el = document.getElementById("pricing")
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
                    }}
                  >
                    Pricing
                  </a>
                )
              }
              return (
                <Link href={{ pathname: "/", hash: "pricing" }} aria-label="See pricing">
                  Pricing
                </Link>
              )
            })()}
          </Button>
        </div>
      </nav>
    </header>
  )
}
