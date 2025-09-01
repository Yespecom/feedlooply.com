import nodemailer from "nodemailer"

type SendEmailInput = {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  cc?: string | string[]
  replyTo?: string | string[]
}

let transporter: nodemailer.Transporter | null = null

function getSmtpConfig() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM

  if (!host || !port || !user || !pass || !from) {
    return null
  }

  return { host, port, auth: { user, pass }, from, secure: port === 465 }
}

export async function sendEmail(input: SendEmailInput) {
  const cfg = getSmtpConfig()
  if (!cfg) {
    return {
      ok: true,
      dryRun: true,
      message: "SMTP env vars not set. Skipped sending email (dry-run). Add SMTP_* in Project Settings.",
    }
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      auth: cfg.auth,
    })
  }

  const info = await transporter.sendMail({
    from: cfg.from,
    to: input.to,
    cc: input.cc,
    replyTo: input.replyTo,
    subject: input.subject,
    text: input.text,
    html: input.html,
  })

  return { ok: true, messageId: info.messageId }
}

export const sendMail = sendEmail
