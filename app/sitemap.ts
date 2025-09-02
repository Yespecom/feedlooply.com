import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/blog-data"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts?.() || []
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now },
    { url: `${SITE_URL}/blog`, lastModified: now },
  ]

  const blogRoutes: MetadataRoute.Sitemap = posts.map((p: any) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
  }))

  return [...staticRoutes, ...blogRoutes]
}
