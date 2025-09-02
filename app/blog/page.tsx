import type { Metadata } from "next"
import { BlogSearchGrid, type BlogMeta as BlogMetaType } from "@/components/blog-search-grid"
import { BLOGS_META } from "@/lib/blog-data"

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights on feedback and growth. Tips, case studies, and lessons on building with customer feedback.",
  alternates: { canonical: "/blog" },
}

// Use all posts; adjust ordering as needed (latest first)
const posts: BlogMetaType[] = BLOGS_META

export default function BlogIndexPage() {
  return (
    <main className="container mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-16">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-balance text-3xl md:text-4xl font-semibold tracking-tight">
          Insights on Feedback & Growth
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed text-pretty">
          Tips, case studies, and lessons on building with customer feedback.
        </p>
      </header>

      <BlogSearchGrid posts={posts} />
    </main>
  )
}
