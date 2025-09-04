import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, experience, goals } = body

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 })
    }

    console.log("[Webinar] New registration:", {
      name,
      email,
      phone,
      company,
      experience,
      expectations: goals,
      timestamp: new Date().toISOString(),
    })

    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
      pool: true, // use pooled connections
      maxConnections: 1, // limit concurrent connections
      rateDelta: 20000, // limit rate to 3 messages per 20 seconds
      rateLimit: 3,
      tls: {
        rejectUnauthorized: false, // Accept self-signed certificates
      },
    })

    const testConnection = async () => {
      try {
        await transporter.verify()
        console.log("[Webinar] SMTP connection verified successfully")
        return true
      } catch (error) {
        console.error("[Webinar] SMTP connection failed:", error)
        return false
      }
    }

    // Simple confirmation email template
    const confirmationEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Webinar Registration Confirmed</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="color: #1a73e8; margin: 0 0 20px 0;">Registration Confirmed! 🎉</h1>
          <p style="font-size: 16px; margin: 0;">Hi ${name},</p>
          <p style="font-size: 16px;">Thank you for registering for our exclusive webinar!</p>
        </div>
        
        <div style="background: white; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Webinar Details</h2>
          <p><strong>Date:</strong> September 8, 2025</p>
          <p><strong>Time:</strong> 7:00 PM IST</p>
          <p><strong>Duration:</strong> 60 minutes</p>
          <p><strong>Platform:</strong> Zoom (link will be shared closer to the date)</p>
        </div>

        <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #2d5a2d; margin-top: 0;">Join Our WhatsApp Community</h3>
          <p>Connect with fellow participants and get updates:</p>
          <a href="https://chat.whatsapp.com/CABPoAysyrx4MOTr2lYG9G?mode=ems_copy_t" 
             style="display: inline-block; background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Join WhatsApp Group
          </a>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            We're excited to have you join us! If you have any questions, feel free to reach out.
          </p>
        </div>
      </body>
      </html>
    `

    // Admin notification email
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Webinar Registration</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Company:</strong> ${company || "Not provided"}</p>
        <p><strong>Experience:</strong> ${experience || "Not provided"}</p>
        <p><strong>Goals:</strong> ${goals || "Not provided"}</p>
        <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
      </body>
      </html>
    `

    const sendEmails = async () => {
      const connectionOk = await testConnection()

      if (!connectionOk) {
        console.log("[Webinar] Skipping email sending due to SMTP connection issues")
        return
      }

      try {
        await Promise.all([
          // Confirmation email to registrant
          transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: email,
            subject: "Webinar Registration Confirmed - September 8, 2025",
            html: confirmationEmailHtml,
          }),
          // Admin notification
          transporter.sendMail({
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: "srinithinoffl@gmail.com",
            subject: `New Webinar Registration: ${name}`,
            html: adminEmailHtml,
          }),
        ])
        console.log("[Webinar] Emails sent successfully")
      } catch (error) {
        console.error("[Webinar] Email sending failed:", error)
      } finally {
        transporter.close()
      }
    }

    // Send emails asynchronously (don't block response)
    sendEmails()

    return NextResponse.json({
      success: true,
      message: "Registration successful! Check your email for confirmation.",
    })
  } catch (error) {
    console.error("[Webinar] Registration error:", error)
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 })
  }
}
