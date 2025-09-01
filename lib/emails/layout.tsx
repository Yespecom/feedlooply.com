const BRAND = {
  name: "Feedlooply",
  primary: "#2563EB", // blue (replaces indigo/purple)
  text: "#111827", // gray-900
  muted: "#6B7280", // gray-500
  surface: "#FFFFFF", // white
  background: "#F3F4F6", // gray-100
}

export function emailLayout(children: string, opts?: { title?: string }) {
  const title = opts?.title || "Feedlooply"
  return `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charSet="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${title}</title>
    <style>
      /* mobile readability tweaks and link styles */
      @media (max-width: 480px) {
        .container { width: 100% !important; border-radius: 10px !important; }
        .pad { padding: 16px !important; }
        h1 { font-size: 18px !important; line-height: 24px !important; }
        p, li { font-size: 14px !important; line-height: 22px !important; }
      }

      a { color: ${BRAND.primary}; text-decoration: underline; }
      .button {
        display:inline-block; padding:10px 16px; border-radius:8px;
        background:${BRAND.primary}; color:#fff !important; text-decoration:none; font-weight:600;
      }
      .divider { height:4px; background:${BRAND.primary}; }
      .card { max-width:640px; background:${BRAND.surface}; border-radius:12px; overflow:hidden; border:1px solid #E5E7EB; }
      .muted { color:${BRAND.muted}; font-size:12px; line-height:18px; }
      .body { color:${BRAND.text}; font-size:15px; line-height:24px; }
    </style>
  </head>
  <body style="margin:0;padding:0;background:${BRAND.background};">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${BRAND.background};">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" class="container card">
            <tr><td style="padding:0;"><div class="divider"></div></td></tr>
            <tr>
              <td class="pad" style="padding:24px 24px 8px 24px;">
                <h1 style="margin:0;font-size:20px;line-height:28px;color:${BRAND.text};font-weight:700;">${title}</h1>
                <p class="muted" style="margin:6px 0 0 0;">${BRAND.name}</p>
              </td>
            </tr>
            <tr>
              <td class="pad body" style="padding:8px 24px 24px 24px;">
                ${children}
              </td>
            </tr>
            <tr>
              <td class="pad muted" style="padding:16px 24px 24px 24px;background:${BRAND.background};">
                <p style="margin:0;">You’re receiving this because you interacted with ${BRAND.name}.</p>
                <p style="margin:4px 0 0 0;">If this wasn’t you, please ignore this email.</p>
              </td>
            </tr>
          </table>
          <div class="muted" style="padding:12px 0 0 0;">© ${new Date().getFullYear()} ${BRAND.name}</div>
        </td>
      </tr>
    </table>
  </body>
  </html>`
}
