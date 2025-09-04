import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { name, email, phone, company, experience } = await request.json().catch(() => ({}))

    // Basic validation
    if (typeof email !== "string" || !/\S+@\S+\.\S+/.test(email)) {
      return new NextResponse("Invalid email", { status: 400 })
    }
    if (typeof name !== "string" || name.trim().length === 0) {
      return new NextResponse("Name is required", { status: 400 })
    }

    // Simple email configuration
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Simple confirmation email template
    const confirmationEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Webinar Registration Confirmed</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering for our webinar!</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">Webinar Details:</h3>
          <p><strong>Date:</strong> September 8, 2025</p>
          <p><strong>Time:</strong> 7:00 PM IST</p>
          <p><strong>Duration:</strong> 1 hour</p>
        </div>

        <p>Join our WhatsApp group for updates:</p>
        <a href="https://chat.whatsapp.com/CABPoAysyrx4MOTr2lYG9G?mode=ems_copy_t" 
           style="background: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Join WhatsApp Group
        </a>

        <p style="margin-top: 20px;">We'll send you the meeting link closer to the date.</p>
        <p>Best regards,<br>FeedLooply Team</p>
      </div>
    `

    // Admin notification email
    const adminEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>New Webinar Registration</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Company:</strong> ${company || "Not provided"}</p>
        <p><strong>Experience:</strong> ${experience || "Not provided"}</p>
        <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `

    // Send emails (best effort)
    try {
      // Send confirmation to user
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: "Webinar Registration Confirmed - September 8, 2025",
        html: confirmationEmail,
      })

      // Send notification to admin
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: "srinithinoffl@gmail.com",
        subject: "New Webinar Registration",
        html: adminEmail,
      })
    } catch (error) {
      // Log error but don't fail the registration
      console.log("[Webinar] Email error:", error)
    }

    // Log registration (non-persistent in serverless preview)
    console.log("[Webinar] New registration:", { name, email, company })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.log("[Webinar] Registration error:", error)
    return new NextResponse("Something went wrong", { status: 500 })
  }
}
