import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, role, experience, goals } = body

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Name, email, and phone are required" }, { status: 400 })
    }

    // Create transporter with error handling
    let transporter
    try {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number.parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_PORT === "465",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      })
    } catch (error) {
      console.error("SMTP configuration error:", error)
      // Continue without email if SMTP fails
      return NextResponse.json({
        success: true,
        message: "Registration successful! Confirmation email will be sent shortly.",
      })
    }

    // Google-style email template
    const confirmationEmailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Webinar Registration Confirmed</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f8f9fa;
          color: #202124;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(60, 64, 67, 0.3);
        }
        .header {
          background: linear-gradient(135deg, #4285f4 0%, #34a853 100%);
          padding: 32px 24px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 28px;
          font-weight: 400;
          letter-spacing: -0.5px;
        }
        .content {
          padding: 32px 24px;
        }
        .greeting {
          font-size: 18px;
          color: #202124;
          margin-bottom: 24px;
          font-weight: 400;
        }
        .event-card {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 24px;
          margin: 24px 0;
          border-left: 4px solid #4285f4;
        }
        .event-title {
          font-size: 20px;
          font-weight: 500;
          color: #202124;
          margin-bottom: 16px;
        }
        .event-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #5f6368;
          font-size: 14px;
        }
        .detail-icon {
          width: 20px;
          height: 20px;
          background-color: #4285f4;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
        }
        .whatsapp-section {
          background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
          border-radius: 8px;
          padding: 24px;
          margin: 24px 0;
          text-align: center;
        }
        .whatsapp-title {
          color: #ffffff;
          font-size: 18px;
          font-weight: 500;
          margin-bottom: 12px;
        }
        .whatsapp-text {
          color: #ffffff;
          font-size: 14px;
          margin-bottom: 20px;
          opacity: 0.9;
        }
        .whatsapp-button {
          display: inline-block;
          background-color: #ffffff;
          color: #25d366;
          padding: 12px 24px;
          border-radius: 24px;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        .whatsapp-button:hover {
          background-color: #f1f3f4;
          transform: translateY(-1px);
        }
        .footer {
          background-color: #f8f9fa;
          padding: 24px;
          text-align: center;
          border-top: 1px solid #e8eaed;
        }
        .footer-text {
          color: #5f6368;
          font-size: 12px;
          margin: 0;
        }
        .divider {
          height: 1px;
          background-color: #e8eaed;
          margin: 24px 0;
        }
        @media (max-width: 600px) {
          .container {
            margin: 0 16px;
          }
          .header, .content {
            padding: 24px 16px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Registration Confirmed</h1>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hi ${name},
          </div>
          
          <p>Thank you for registering for our exclusive webinar! We're excited to have you join us for this transformative session.</p>
          
          <div class="event-card">
            <div class="event-title">Building Scalable SaaS Products</div>
            <div class="event-details">
              <div class="detail-item">
                <div class="detail-icon">📅</div>
                <span><strong>Date:</strong> September 8, 2025</span>
              </div>
              <div class="detail-item">
                <div class="detail-icon">🕐</div>
                <span><strong>Time:</strong> 7:00 PM - 8:30 PM IST</span>
              </div>
              <div class="detail-item">
                <div class="detail-icon">💻</div>
                <span><strong>Platform:</strong> Zoom (Link will be shared 1 hour before)</span>
              </div>
              <div class="detail-item">
                <div class="detail-icon">🎯</div>
                <span><strong>Duration:</strong> 90 minutes + Q&A</span>
              </div>
            </div>
          </div>

          <div class="whatsapp-section">
            <div class="whatsapp-title">Join Our Community</div>
            <div class="whatsapp-text">
              Connect with fellow entrepreneurs and get exclusive updates, resources, and networking opportunities.
            </div>
            <a href="https://chat.whatsapp.com/CABPoAysyrx4MOTr2lYG9G?mode=ems_copy_t" class="whatsapp-button">
              Join WhatsApp Group
            </a>
          </div>

          <div class="divider"></div>

          <h3 style="color: #202124; font-weight: 500; margin-bottom: 16px;">What to Expect:</h3>
          <ul style="color: #5f6368; padding-left: 20px;">
            <li>Proven strategies for building scalable SaaS products</li>
            <li>Real-world case studies and success stories</li>
            <li>Interactive Q&A session with industry experts</li>
            <li>Exclusive resources and templates</li>
            <li>Networking opportunities with like-minded entrepreneurs</li>
          </ul>

          <p style="color: #5f6368; font-size: 14px; margin-top: 24px;">
            We'll send you the Zoom link and additional materials 1 hour before the webinar starts. 
            Make sure to add this event to your calendar!
          </p>
        </div>

        <div class="footer">
          <p class="footer-text">
            This email was sent to ${email}. If you have any questions, please reply to this email.
          </p>
          <p class="footer-text" style="margin-top: 8px;">
            © 2025 FeedLooply. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
    `

    // Admin notification email
    const adminEmailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Webinar Registration</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f8f9fa;
          color: #202124;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(60, 64, 67, 0.3);
        }
        .header {
          background-color: #ea4335;
          padding: 24px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 24px;
          font-weight: 400;
        }
        .content {
          padding: 24px;
        }
        .registration-card {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
          margin: 16px 0;
        }
        .field {
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e8eaed;
        }
        .field:last-child {
          border-bottom: none;
        }
        .field-label {
          font-weight: 500;
          color: #202124;
          font-size: 14px;
        }
        .field-value {
          color: #5f6368;
          font-size: 14px;
          margin-top: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎯 New Webinar Registration</h1>
        </div>
        
        <div class="content">
          <p>A new participant has registered for the webinar:</p>
          
          <div class="registration-card">
            <div class="field">
              <div class="field-label">Name</div>
              <div class="field-value">${name}</div>
            </div>
            <div class="field">
              <div class="field-label">Email</div>
              <div class="field-value">${email}</div>
            </div>
            <div class="field">
              <div class="field-label">Phone</div>
              <div class="field-value">${phone}</div>
            </div>
            ${
              company
                ? `
            <div class="field">
              <div class="field-label">Company</div>
              <div class="field-value">${company}</div>
            </div>
            `
                : ""
            }
            ${
              role
                ? `
            <div class="field">
              <div class="field-label">Role</div>
              <div class="field-value">${role}</div>
            </div>
            `
                : ""
            }
            ${
              experience
                ? `
            <div class="field">
              <div class="field-label">Experience</div>
              <div class="field-value">${experience}</div>
            </div>
            `
                : ""
            }
            ${
              goals
                ? `
            <div class="field">
              <div class="field-label">Goals</div>
              <div class="field-value">${goals}</div>
            </div>
            `
                : ""
            }
          </div>
          
          <p style="color: #5f6368; font-size: 14px;">
            Registration time: ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </body>
    </html>
    `

    // Send emails with error handling
    try {
      // Send confirmation email to registrant
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "✓ Webinar Registration Confirmed - Building Scalable SaaS Products",
        html: confirmationEmailHtml,
      })

      // Send notification to admin
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: "srinithinoffl@gmail.com",
        subject: `🎯 New Webinar Registration - ${name}`,
        html: adminEmailHtml,
      })

      console.log("Webinar registration emails sent successfully")
    } catch (emailError) {
      console.error("Email sending error:", emailError)
      // Continue processing even if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful! Check your email for confirmation details.",
    })
  } catch (error) {
    console.error("Webinar registration error:", error)
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 })
  }
}
