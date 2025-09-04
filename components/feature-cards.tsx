"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Sparkles, CheckCircle2 } from "lucide-react" // simple illustrative icons

const features = [
  {
    title: "Collect",
    desc: "Embeddable widget + host links for YouTube / Meet / Slack / Notion. Viewers drop feedback without signups.",
    icon: MessageSquare,
  },
  {
    title: "Understand",
    desc: "AI clusters, sentiment, monthly summaries, and duplicate detection.",
    icon: Sparkles,
  },
  {
    title: "Decide",
    desc: "Minimal roadmap (Planned → In Progress → Done) and automatic changelog announcements.",
    icon: CheckCircle2,
  },
]

export function FeatureCards() {
  return (
    <section
      id="features"
      // subtle section gradient; stays accessible in light/dark
      className="rounded-2xl border p-6 md:p-8 lg:p-10 bg-gradient-to-br from-indigo-500/5 to-cyan-500/5 dark:from-indigo-400/10 dark:to-cyan-400/10"
      aria-label="Collect, Understand, Decide features"
    >
      <div className="grid gap-6 md:gap-8 sm:grid-cols-2 md:grid-cols-3">
        {features.map((f) => {
          const Icon = f.icon
          return (
            <Card
              key={f.title}
              className="group relative overflow-hidden border bg-white dark:bg-card backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary/40 via-teal-400/40 to-primary/40"
              />
              <CardHeader className="flex flex-row items-center gap-3 p-5 pb-2">
                <div className="rounded-md p-2 ring-1 ring-border bg-gradient-to-br from-primary/15 to-teal-400/15">
                  <Icon className="h-4 w-4 text-primary" aria-hidden />
                </div>
                <CardTitle className="text-base text-slate-900">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 text-sm md:text-base leading-relaxed text-muted-foreground">
                {f.desc}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
