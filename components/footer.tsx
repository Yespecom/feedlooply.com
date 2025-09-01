"use client"

import Link from "next/link"
import { Linkedin } from "lucide-react"
import { FaReddit } from "react-icons/fa"

export function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 md:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 text-center md:text-left">
          {/* Copyright */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Feedlooply. All rights reserved.
          </p>

          {/* Terms & Refund */}
          <div className="flex items-center gap-2 md:gap-4 text-sm">
            <Link href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Terms
            </Link>
            <span className="text-gray-400 dark:text-gray-500" aria-hidden="true">•</span>
            <Link href="/refund-policy" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              Refund Policy
            </Link>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 mt-2 md:mt-0 justify-center md:justify-end">
            <Link
              href="https://www.reddit.com/user/FeedLooply/"
              aria-label="Feedlooply on Reddit"
              className="text-gray-500 dark:text-gray-400 hover:text-orange-500 transition-colors"
            >
              <FaReddit className="h-5 w-5" aria-hidden />
              <span className="sr-only">Reddit</span>
            </Link>

            <Link
              href="https://www.linkedin.com/company/feedlooply"
              aria-label="Feedlooply on LinkedIn"
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Linkedin className="h-5 w-5" aria-hidden />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
