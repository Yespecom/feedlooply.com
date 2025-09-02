// implement a working client-side search with light cards and a gradient title bar
"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type BlogMeta = {
  slug: string
  title: string
  excerpt: string
  tags: string[]
}

type Props = {
  posts: BlogMeta[]
  className?: string
}

export function BlogSearchGrid({ posts, className }: Props) {
  const [q, setQ] = React.useState("")
  const filtered = React.useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return posts
    return posts.filter((p) => {
      const inTitle = p.title.toLowerCase().includes(query)
      const inExcerpt = p.excerpt.toLowerCase().includes(query)
      const inTags = p.tags.join(" ").toLowerCase().includes(query)
      return inTitle || inExcerpt || inTags
    })
  }, [q, posts])

  return (
    <section className={cn("mx-auto mt-8 max-w-5xl", className)}>
      <div className="mb-6">
        <label htmlFor="blog-search" className="sr-only">
          Search blog posts
        </label>
        <Input
          id="blog-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search topics, e.g. AI, retention, Slack…"
          className="h-11"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
            <Card className="relative h-full overflow-hidden border bg-white transition-shadow hover:shadow-md dark:bg-muted">
              {/* Side color strip */}
              <div className="absolute left-0 top-0 h-full w-1 bg-primary" aria-hidden="true" />
              {/* Wavy gradient shade overlay */}
              <div className="pointer-events-none absolute inset-0 opacity-10" aria-hidden="true">
                <div className="wavy-shade absolute inset-0" />
              </div>

              <CardContent className="relative space-y-3 pt-5">
                <h3 className="text-lg font-semibold text-black underline-offset-4 group-hover:underline dark:text-white">
                  {post.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "inline-flex items-center rounded-md border px-2 py-1 text-xs",
                        "bg-muted/50 text-muted-foreground",
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">Read More →</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-6 text-center text-sm text-muted-foreground">No posts found. Try a different search.</p>
      )}
    </section>
  )
}
