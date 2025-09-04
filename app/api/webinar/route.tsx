import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

async function sendEmails(registrationData: any) {
  try {
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
    })

    // Simple confirmation email template
    const confirmationEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a73e8;">Webinar Registration Confirmed!</h2>
        
        <p>Hi ${registrationData.name},</p>
        
        <p>Thank you for registering for our exclusive webinar on <strong>September 8, 2025</strong>.</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Webinar Details:</h3>
          <p style="margin: 5px 0;"><strong>Date:</strong> September 8, 2025</p>
          <p style="margin: 5px 0;"><strong>Time:</strong> 7:00 PM IST</p>
          <p style="margin: 5px 0;"><strong>Duration:</strong> 90 minutes</p>
        </div>
        
        <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333;">Join Our WhatsApp Community:</h3>
          <p>Connect with fellow participants and get updates:</p>
          <a href="https://chat.whatsapp.com/CABPoAysyrx4MOTr2lYG9G?mode=ems_copy_t" 
             style="display: inline-block; background: #25d366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
            Join WhatsApp Group
          </a>
        </div>
        
        <p>We'll send you the webinar link closer to the date.</p>
        
        <p>Best regards,<br>The FeedLooply Team</p>
      </div>
    `

    // Admin notification email
    const adminEmail = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a73e8;">New Webinar Registration</h2>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
          <p><strong>Name:</strong> ${registrationData.name}</p>
          <p><strong>Email:</strong> ${registrationData.email}</p>
          <p><strong>Phone:</strong> ${registrationData.phone || "Not provided"}</p>
          <p><strong>Company:</strong> ${registrationData.company || "Not provided"}</p>
          <p><strong>Experience:</strong> ${registrationData.experience || "Not provided"}</p>
          <p><strong>Expectations:</strong> ${registrationData.expectations || "Not provided"}</p>
          <p><strong>Registration Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `

    // Send confirmation email to registrant
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: registrationData.email,
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

    console.log("[Webinar] Emails sent successfully")
  } catch (error) {
    console.error("[Webinar] Email error:", error)
    // Don't throw error - registration should succeed even if emails fail
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, experience, expectations } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    // Log the registration
    console.log("[Webinar] New registration:", {
      name,
      email,
      phone,
      company,
      experience,
      expectations,
      timestamp: new Date().toISOString(),
    })

    // Send emails asynchronously (don't wait for completion)
    sendEmails({ name, email, phone, company, experience, expectations }).catch(console.error)

    return NextResponse.json({
      success: true,
      message: "Registration successful! You will receive confirmation details soon.",
    })
  } catch (error) {
    console.error("[Webinar] Registration error:", error)
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 })
  }
}
