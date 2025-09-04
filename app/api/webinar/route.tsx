import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, role, experience, goals, challenges } = body

    // Validation
    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 })
    }

    // Send confirmation email to registrant
    const confirmationEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Webinar Registration Confirmed!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering for our webinar: <strong>"From Feedback to Features: Building Products Users Actually Want"</strong></p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #334155;">Event Details:</h3>
          <p><strong>Date:</strong> January 25, 2025</p>
          <p><strong>Time:</strong> 2:00 PM - 3:30 PM IST</p>
          <p><strong>Format:</strong> Live Online Session</p>
        </div>
        
        <p>We'll send you the webinar link 24 hours before the event. Get ready to learn how to transform user feedback into winning product features!</p>
        
        <p>Best regards,<br>The Feedlooply Team</p>
      </div>
    `

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Webinar Registration Confirmed - Feedlooply",
      html: confirmationEmailHtml,
    })

    // Send registration details to admin
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">New Webinar Registration</h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
          <h3 style="margin-top: 0;">Registrant Details:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Company:</strong> ${company || "Not provided"}</p>
          <p><strong>Role:</strong> ${role || "Not provided"}</p>
          <p><strong>Experience:</strong> ${experience || "Not provided"}</p>
          <p><strong>Goals:</strong> ${goals || "Not provided"}</p>
          <p><strong>Challenges:</strong> ${challenges || "Not provided"}</p>
        </div>
        
        <p>Registration time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
      </div>
    `

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: "srinithinoffl@gmail.com",
      subject: "New Webinar Registration - Feedlooply",
      html: adminEmailHtml,
    })

    return NextResponse.json({ success: true, message: "Registration successful" })
  } catch (error) {
    console.error("Webinar registration error:", error)
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 })
  }
}
