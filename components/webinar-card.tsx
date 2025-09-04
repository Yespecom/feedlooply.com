"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Clock, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export function WebinarCard() {
  return (
    <div className="p-8 md:p-12">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left: Content */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
              Live Event
            </div>
            <h3 className="text-2xl md:text-3xl font-normal text-gray-900 dark:text-white leading-tight">
              3x Your Startup Growth
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
              Learn the proven framework to turn feedback into sustainable growth
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4" />
              </div>
              <span className="font-medium">September 8, 2025</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4" />
              </div>
              <span className="font-medium">7:00 PM IST</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <span className="font-medium">50 spots remaining</span>
            </div>
          </div>
        </div>

        {/* Right: CTA */}
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 text-center space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                Free Registration
              </p>
              <p className="text-2xl font-normal text-gray-900 dark:text-white">Reserve Your Seat</p>
            </div>

            <Link href="/webinar">
              <Button
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                Join Free Webinar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            <p className="text-sm text-gray-500 dark:text-gray-400">32 founders already registered</p>
          </div>
        </div>
      </div>
    </div>
  )
}
