// NOTE: This file runs on the server (route handlers). We avoid external deps and use Web Crypto.
// It signs a Google OAuth JWT assertion (RS256) and appends rows via the Sheets REST API.

type ServiceAccount = {
    email: string
    privateKey: string
  }
  
  function getServiceAccount(): ServiceAccount {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
    if (!email || !rawKey) {
      throw new Error(
        "Missing Google Sheets credentials: GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
      )
    }
    // Private keys are often stored with \n escaped in env vars
    const privateKey = rawKey.replace(/\\n/g, "\n")
    return { email, privateKey }
  }
  
  // Base64url helpers
  function base64ToArrayBuffer(b64: string): ArrayBuffer {
    // Prefer Node Buffer when available (route handlers run on server)
    if (typeof Buffer !== "undefined") {
      return new Uint8Array(Buffer.from(b64, "base64")).buffer
    }
    if (typeof atob === "function") {
      const binary = atob(b64)
      const len = binary.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i)
      return bytes.buffer
    }
    throw new Error("No base64 decoder available in this runtime")
  }
  
  function toBase64Url(input: ArrayBuffer | Uint8Array | string): string {
    let bytes: Uint8Array
    if (typeof input === "string") {
      bytes = new TextEncoder().encode(input)
    } else if (input instanceof Uint8Array) {
      bytes = input
    } else {
      bytes = new Uint8Array(input)
    }
    // Use Buffer if available for consistency
    const b64 =
      typeof Buffer !== "undefined"
        ? Buffer.from(bytes).toString("base64")
        : btoa(String.fromCharCode(...Array.from(bytes)))
    return b64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
  }
  
  function pemToPkcs8(pem: string): ArrayBuffer {
    // Remove surrounding quotes if env var was pasted with them
    const trimmed = pem.trim().replace(/^"+|"+$/g, "")
    const cleaned = trimmed
      .replace(/\\r\\n/g, "\n") // handle escaped CRLF
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/-----BEGIN PRIVATE KEY-----/g, "")
      .replace(/-----END PRIVATE KEY-----/g, "")
      .replace(/\n/g, "")
      .replace(/\s+/g, "")
      .trim()
  
    // Add base64 padding if missing
    const padLen = cleaned.length % 4
    const padded = padLen === 0 ? cleaned : cleaned + "=".repeat(4 - padLen)
  
    return base64ToArrayBuffer(padded)
  }
  
  async function importPrivateKeyRS256(pem: string): Promise<CryptoKey> {
    const keyData = pemToPkcs8(pem)
    return await crypto.subtle.importKey("pkcs8", keyData, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, [
      "sign",
    ])
  }
  
  async function signJwtRS256(payload: Record<string, any>, privateKeyPem: string): Promise<string> {
    const header = { alg: "RS256", typ: "JWT" }
    const headerB64 = toBase64Url(JSON.stringify(header))
    const payloadB64 = toBase64Url(JSON.stringify(payload))
    const unsigned = `${headerB64}.${payloadB64}`
  
    const key = await importPrivateKeyRS256(privateKeyPem)
    const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned))
    const sigB64 = toBase64Url(sig)
    return `${unsigned}.${sigB64}`
  }
  
  // Token cache to avoid requesting a new token on every call
  let cachedAccessToken: { token: string; exp: number; fingerprint: string } | null = null
  
  async function getAccessToken(): Promise<string> {
    const { email, privateKey } = getServiceAccount()
    const fingerprint = `${email}:${privateKey.length}`
  
    const now = Math.floor(Date.now() / 1000)
    if (cachedAccessToken && cachedAccessToken.fingerprint === fingerprint && cachedAccessToken.exp - 60 > now) {
      return cachedAccessToken.token
    }
  
    const aud = "https://oauth2.googleapis.com/token"
    const iat = now
    const exp = iat + 3600 // 1 hour
  
    // Build OAuth 2.0 JWT assertion (service account)
    const assertion = await signJwtRS256(
      {
        iss: email,
        scope: "https://www.googleapis.com/auth/spreadsheets",
        aud,
        iat,
        exp,
      },
      privateKey,
    )
  
    const form = new URLSearchParams()
    form.set("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer")
    form.set("assertion", assertion)
  
    const resp = await fetch(aud, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    })
  
    if (!resp.ok) {
      const text = await resp.text().catch(() => "")
      throw new Error(`Google OAuth token error: ${resp.status} ${text}`)
    }
  
    const json = (await resp.json()) as { access_token: string; expires_in: number }
    cachedAccessToken = {
      token: json.access_token,
      exp: now + (json.expires_in || 3600),
      fingerprint,
    }
    return json.access_token
  }
  
  async function appendRows({
    spreadsheetId,
    sheetName,
    values,
  }: {
    spreadsheetId: string
    sheetName: string
    values: any[][]
  }) {
    const token = await getAccessToken()
    const range = encodeURIComponent(`${sheetName}!A1`)
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`
  
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ values }),
    })
  
    if (!resp.ok) {
      const text = await resp.text().catch(() => "")
      // Throwing here allows callers to catch and ignore to avoid UX impact
      throw new Error(`Google Sheets append error: ${resp.status} ${text}`)
    }
  
    return resp.json().catch(() => ({}))
  }
  
  export type SubscriberRow = {
    email: string
    name?: string
    country?: string
    source?: string
    createdAt?: string
  }
  
  export type PaymentRow = {
    email: string
    name?: string
    amount: number
    currency: string
    country?: string
    plan?: string
    status?: string
    orderId?: string
    paymentId?: string
    createdAt?: string
  }
  
  export async function appendSubscriber(row: SubscriberRow) {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SUBSCRIBERS_ID
    const sheetName = process.env.GOOGLE_SHEETS_SUBSCRIBERS_SHEET || "Subscribers"
    if (!spreadsheetId) throw new Error("Missing GOOGLE_SHEETS_SUBSCRIBERS_ID")
  
    const values = [
      [row.createdAt || new Date().toISOString(), row.email, row.name ?? "", row.country ?? "", row.source ?? ""],
    ]
  
    return appendRows({ spreadsheetId, sheetName, values })
  }
  
  export async function appendPayment(row: PaymentRow) {
    const spreadsheetId = process.env.GOOGLE_SHEETS_PAYMENTS_ID
    const sheetName = process.env.GOOGLE_SHEETS_PAYMENTS_SHEET || "Payments"
    if (!spreadsheetId) throw new Error("Missing GOOGLE_SHEETS_PAYMENTS_ID")
  
    const values = [
      [
        row.createdAt || new Date().toISOString(),
        row.email,
        row.name ?? "",
        row.amount,
        row.currency,
        row.country ?? "",
        row.plan ?? "",
        row.status ?? "success",
        row.orderId ?? "",
        row.paymentId ?? "",
      ],
    ]
  
    return appendRows({ spreadsheetId, sheetName, values })
  }
  
  export const appendSubscriberRow = appendSubscriber
  export const appendPaymentRow = appendPayment
