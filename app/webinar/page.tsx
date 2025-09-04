"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, MapPin, Users, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function WebinarPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    experience: "",
    goals: "",
    challenges: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/webinar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } else {
        const error = await response.json()
        alert(error.error || "Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-50">
        <div className="container mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto text-center"
          >
            <div className="mb-12">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-normal text-gray-900 mb-4">Registration confirmed</h1>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                You're successfully registered for the webinar. Check your email for the webinar link and calendar
                invite.
              </p>
              <p className="text-sm text-gray-500">Redirecting to home page in 3 seconds...</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 mb-8">
              <h3 className="font-medium text-gray-900 mb-6">What's next?</h3>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Add to calendar (Google/Outlook link in your email)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Join our WhatsApp group for reminders</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Get ready to 3x your startup growth!</span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => router.push("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium"
            >
              Go to Home Page
            </Button>
          </motion.div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-50">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-normal text-gray-900 mb-8 leading-tight">
              Learn How Feedback Loops Can <span className="text-blue-600">3x Your Startup Growth</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join our free live webinar and discover how to collect, understand, and act on feedback the smart way.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Registration Form - First on mobile */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm sticky top-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-medium text-gray-900 mb-2">Save your seat</h2>
                  <p className="text-gray-600">Only 50 seats — filling fast. Already 32 founders registered.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="border-gray-300 rounded-lg h-12 px-4 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border-gray-300 rounded-lg h-12 px-4 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="border-gray-300 rounded-lg h-12 px-4 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                      Role/Title
                    </Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                      <SelectTrigger className="border-gray-300 rounded-lg h-12 px-4 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="founder">Founder</SelectItem>
                        <SelectItem value="pm">Product Manager</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                      Company/Startup Name
                    </Label>
                    <Input
                      id="company"
                      placeholder="Enter company name (optional)"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      className="border-gray-300 rounded-lg h-12 px-4 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="challenge" className="text-sm font-medium text-gray-700">
                      Biggest Challenge with Feedback?
                    </Label>
                    <Textarea
                      id="challenge"
                      placeholder="What's your main struggle with collecting or using feedback?"
                      className="min-h-[100px] border-gray-300 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
                      value={formData.challenges}
                      onChange={(e) => handleInputChange("challenges", e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-full font-medium text-base"
                  >
                    {isLoading ? "Registering..." : "Save My Seat"}
                  </Button>
                </form>
              </div>
            </motion.div>

            {/* Details & Benefits - Second on mobile */}
            <div className="space-y-8 order-2 lg:order-1">
              {/* Webinar Details */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="text-xl font-medium text-gray-900 mb-6">Webinar Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-gray-700">September 8, 2025</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-gray-700">7:00 PM IST / 8:30 AM EST</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-gray-700">Zoom (Free)</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-gray-700">Limited to 50 spots</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* What You'll Learn */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <div className="bg-white border border-gray-200 rounded-2xl p-8">
                  <h3 className="text-xl font-medium text-gray-900 mb-6">What You'll Learn</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">
                        A 3-step framework to turn feedback into growth
                      </span>
                    </div>
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">
                        Why 90% of feedback gets wasted & how to fix it
                      </span>
                    </div>
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">
                        Real-world examples of startups scaling with feedback
                      </span>
                    </div>
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">
                        Sneak peek: how I'm building Feedlooply to solve this
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Speaker Section */}
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <div className="bg-white border border-gray-200 rounded-2xl p-8">
                  <h3 className="text-xl font-medium text-gray-900 mb-6">Your Host</h3>
                  <div className="flex items-start gap-6">
                    <div className="relative h-20 w-20 rounded-2xl overflow-hidden flex-shrink-0">
                      <Image
                        src="/host-image.png"
                        alt="Srinithin - Founder of Feedlooply"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Srinithin</h4>
                      <p className="text-blue-600 mb-3">Founder of Feedlooply</p>
                      <p className="text-gray-700 leading-relaxed">
                        I'm on a mission to help startups stop building in the dark by making feedback actionable.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
