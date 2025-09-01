import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Suspense } from "react"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000"),
  title: {
    default: "FeedLooply",
    template: "%s | FeedLooply",
  },
  description:
    "Feedlooply helps businesses streamline feedback, boost engagement, and build stronger customer relationships with smart, easy-to-use tools",

  applicationName: "FeedLooply",
  keywords: ["startup", "saas", "ai", "productivity", "founder"],
  openGraph: {
    type: "website",
    url: "/",
    title: "FeedLooply",
    description:
      "Feedlooply helps businesses streamline feedback, boost engagement, and build stronger customer relationships with smart, easy-to-use tools",
    siteName: "FeedLooply",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "FeedLooply",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FeedLooply",
    description:
      "Feedlooply helps businesses streamline feedback, boost engagement, and build stronger customer relationships with smart, easy-to-use tools",
    images: ["/twitter-image.png"],
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0ea5e9",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
          {children}
          <Footer />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
