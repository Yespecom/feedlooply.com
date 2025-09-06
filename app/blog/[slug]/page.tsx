import type React from "react"
import type { Metadata, ResolvingMetadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ShareButton } from "@/components/share-button"
import { InlineSubscribe } from "@/components/inline-subscribe"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { POSTS, BLOGS_META } from "@/lib/blog-data"
import { SITE_KEYWORDS } from "@/lib/seo"

type Post = {
  title: string
  description: string
  keywords?: string[]
  content: React.ReactNode
}

function getImageUrl(meta?: { coverImage?: string }, siteUrl?: string) {
  const baseUrl =
    siteUrl || process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000"
  const img = meta?.coverImage

  if (!img) return `${baseUrl}/opengraph-image.png`
  return img.startsWith("http") ? img : `${baseUrl}${img}`
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const post = POSTS[params.slug]
  if (!post) {
    return {
      title: "Blog",
      description: "Feedlooply Blog",
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000"
  const meta = BLOGS_META.find((b) => b.slug === params.slug)
  const imageUrl = getImageUrl(meta, siteUrl)
  const mergedKeywords = Array.from(
    new Set<string>([...(post.keywords || []), ...(meta?.tags || []), ...SITE_KEYWORDS]),
  )

  return {
    title: post.title,
    description: post.description,
    keywords: mergedKeywords,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `/blog/${params.slug}`,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = POSTS[params.slug]

  if (!post) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-10 md:py-16">
        <h1 className="text-balance text-2xl md:text-3xl font-semibold tracking-tight">
          Post not found
        </h1>
        <p className="mt-2 text-muted-foreground">
          The article you’re looking for doesn’t exist yet. Explore other posts on the{" "}
          <Link
            href="/blog"
            className="underline decoration-primary underline-offset-4 hover:opacity-90"
          >
            blog
          </Link>
          .
        </p>
      </main>
    )
  }

  const related = BLOGS_META.filter((b) => b.slug !== params.slug).slice(0, 3)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000"
  const meta = BLOGS_META.find((b) => b.slug === params.slug)
  const postUrl = `${siteUrl}/blog/${params.slug}`
  const imageUrl = getImageUrl(meta, siteUrl)
  const mergedKeywords = Array.from(
    new Set<string>([...(post.keywords || []), ...(meta?.tags || []), ...SITE_KEYWORDS]),
  )

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: postUrl,
    mainEntityOfPage: postUrl,
    datePublished: meta?.date,
    dateModified: meta?.date,
    author: meta?.author ? { "@type": "Person", name: meta.author } : undefined,
    publisher: {
      "@type": "Organization",
      name: "FeedLooply",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon-32x32.png`,
      },
    },
    image: [imageUrl],
    keywords: mergedKeywords.join(", "),
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 md:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          aria-label="Back to blog"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <ShareButton title={post.title} showNetworks />
      </div>

      <header className="mb-6">
        <h1 className="text-balance text-3xl md:text-4xl font-semibold tracking-tight">
          {post.title}
        </h1>
        <p className="mt-3 text-muted-foreground">{post.description}</p>
      </header>

      {post.content}

      <section className="mt-10 rounded-lg border bg-muted/30 p-5">
        <h2 className="text-lg font-semibold">Get new posts in your inbox</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          No spam. Just practical insights on feedback, growth, and product ops.
        </p>
        <div className="mt-4">
          <InlineSubscribe source={`blog:${params.slug}`} />
        </div>
      </section>

      <div className="mt-10 rounded-lg border bg-muted/50 p-5">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="text-lg font-semibold">Ready to fix feedback?</h3>
            <p className="text-muted-foreground">
              Join Early Access and start turning customer voices into real growth.
            </p>
          </div>
          <Link
            href="/#pricing"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            🚀 Get Early Access
          </Link>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-black dark:text-white">Related blogs</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {related.map((r) => (
            <Link key={r.slug} href={`/blog/${r.slug}`} className="group">
              <Card className="h-full bg-white dark:bg-muted border transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base group-hover:underline underline-offset-4 text-black dark:text-white">
                    {r.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{r.excerpt}</p>
                  <span className="text-xs font-medium text-foreground">Read More →</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <Link
        href="/#pricing"
        className="fixed bottom-5 right-5 inline-flex items-center rounded-full bg-secondary px-5 py-3 text-sm font-medium text-secondary-foreground shadow-lg hover:opacity-90"
        aria-label="Get Early Access to Feedlooply"
      >
        🚀 Get Early Access
      </Link>
    </main>
  )
}
