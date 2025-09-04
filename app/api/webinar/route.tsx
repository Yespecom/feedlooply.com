import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, role, experience, goals, challenges } = body

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 })
    }

    // Create transporter with timeout and error handling
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000, // 10 seconds
      socketTimeout: 10000, // 10 seconds
    })

    // Email templates
    const confirmationEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a73e8;">Registration Confirmed! 🎉</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering for our exclusive webinar on <strong>Building Better Products with Customer Feedback</strong>!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1a73e8;">Webinar Details:</h3>
          <p><strong>📅 Date:</strong> September 8, 2025</p>
          <p><strong>⏰ Time:</strong> 2:00 PM - 3:30 PM IST</p>
          <p><strong>🎯 Topic:</strong> Building Better Products with Customer Feedback</p>
        </div>

        <p>We'll send you the webinar link closer to the date. Get ready to learn how to:</p>
        <ul>
          <li>Collect meaningful customer feedback</li>
          <li>Turn insights into actionable product improvements</li>
          <li>Build products your customers actually want</li>
        </ul>

        <p>Looking forward to seeing you there!</p>
        <p>Best regards,<br>The FeedLooply Team</p>
      </div>
    `

    const adminNotificationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a73e8;">New Webinar Registration</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Company:</strong> ${company || "Not provided"}</p>
          <p><strong>Role:</strong> ${role || "Not provided"}</p>
          <p><strong>Experience:</strong> ${experience || "Not provided"}</p>
          <p><strong>Goals:</strong> ${goals || "Not provided"}</p>
          <p><strong>Challenges:</strong> ${challenges || "Not provided"}</p>
        </div>
        <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `

    // Try to send emails with error handling
    let emailSuccess = false
    try {
      // Send confirmation email to registrant
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "Webinar Registration Confirmed - Building Better Products with Customer Feedback",
        html: confirmationEmailHtml,
      })

      // Send notification to admin
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: "srinithinoffl@gmail.com",
        subject: "New Webinar Registration",
        html: adminNotificationHtml,
      })

      emailSuccess = true
      console.log("[v0] Emails sent successfully")
    } catch (emailError) {
      console.error("[v0] Email sending failed:", emailError)
      // Continue with registration even if email fails
    }

    // Log registration data (you can also save to database here)
    console.log("[v0] Webinar registration:", { name, email, phone, company, role })

    return NextResponse.json({
      success: true,
      message: "Registration successful!",
      emailSent: emailSuccess,
    })
  } catch (error) {
    console.error("[v0] Webinar registration error:", error)
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 })
  }
}
