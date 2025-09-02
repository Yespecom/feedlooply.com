import { NextResponse } from "next/server"
import { getAllPosts } from "@/lib/blog-data"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

function escape(str: string) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

export async function GET() {
  const posts = getAllPosts?.() || []
  const items = posts
    .map((p: any) => {
      const link = `${SITE_URL}/blog/${p.slug}`
      return `
        <item>
          <title>${escape(p.title)}</title>
          <link>${link}</link>
          <guid>${link}</guid>
          <pubDate>${new Date(p.updatedAt || Date.now()).toUTCString()}</pubDate>
          <description>${escape(p.excerpt || p.description || "")}</description>
        </item>
      `.trim()
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>Blog RSS</title>
      <link>${SITE_URL}</link>
      <description>Latest posts</description>
      ${items}
    </channel>
  </rss>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=600, stale-while-revalidate",
    },
  })
}
