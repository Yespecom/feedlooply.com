import type React from "react"
import Link from "next/link"

export type Blog = {
  slug: string
  title: string
  excerpt: string
  author: string
  date: string // ISO
  readingTime: string
  tags: string[]
  coverImage?: string
  content: Array<
    | { type: "h2"; text: string }
    | { type: "p"; text: string }
    | { type: "ul"; items: string[] }
    | { type: "quote"; text: string }
    | { type: "tip"; text: string }
  >
}

function renderWithLinks(text: string) {
  const parts: Array<string | { label: string; href: string }> = []
  const markdownLinkRegex = /\[([^\]]+)\]$$([^)]+)$$/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = markdownLinkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push({ label: match[1], href: match[2] })
    lastIndex = markdownLinkRegex.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  // Helper to auto-link bare "(/blog/...)" occurrences inside plain strings
  const renderAutoLinks = (s: string) => {
    const nodes: React.ReactNode[] = []
    const barePathRegex = /$$(\/[a-z0-9\-/]+)$$/gi
    let li = 0
    let m: RegExpExecArray | null
    while ((m = barePathRegex.exec(s)) !== null) {
      if (m.index > li) {
        nodes.push(<span key={`t-${nodes.length}`}>{s.slice(li, m.index)}</span>)
      }
      const path = m[1]
      nodes.push(
        <Link
          key={`l-${nodes.length}`}
          href={path}
          className="underline decoration-primary underline-offset-4 hover:opacity-90"
        >
          {path}
        </Link>,
      )
      li = barePathRegex.lastIndex
    }
    if (li < s.length) {
      nodes.push(<span key={`t-${nodes.length}`}>{s.slice(li)}</span>)
    }
    return nodes
  }

  return (
    <>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          <span key={i}>{renderAutoLinks(part)}</span>
        ) : (
          <Link key={i} href={part.href} className="underline decoration-primary underline-offset-4 hover:opacity-90">
            {part.label}
          </Link>
        ),
      )}
    </>
  )
}

function totalWordCount(blocks: Blog["content"]) {
  const getText = (b: Blog["content"][number]) => {
    if (b.type === "p" || b.type === "h2" || b.type === "quote" || b.type === "tip") return b.text
    if (b.type === "ul") return b.items.join(" ")
    return ""
  }
  return blocks.map(getText).join(" ").trim().split(/\s+/).filter(Boolean).length
}

const EXTENDED_APPENDIX_PARAS: string[] = [
  "In practice, making feedback actionable requires a consistent operating rhythm. Most teams collect fragments in different places and never consolidate them into decisions. A weekly loop—collect, triage, aggregate, decide, and close the loop—turns raw input into compounding product value. If you’re new to this cadence, start with a single 30–45 minute session and refine from there. We expand this approach in [Why Startups Fail at Feedback](/blog/why-startups-fail-at-feedback) and demonstrate how 'evidence buckets' replace ad‑hoc opinions. The goal isn’t a perfect taxonomy—it’s repeatable choices made visible to the team and, when appropriate, your users.",
  "Treat support as a continuous PMF survey rather than a cost center. When you tag by intent (bug, friction, capability, trust), segment, and lifecycle, patterns emerge quickly. Within 6–8 weeks you can plot severity by frequency and spot jobs‑to‑be‑done hidden in plain sight. That’s why we call support a near real‑time PMF barometer in [Finding PMF Signals from Support](/blog/pmf-signals-from-support). Leaders often overweight a single loud anecdote; proper tagging counters that bias with structured evidence.",
  "Closing the loop is where trust compounds. Even a 'not now' communicates respect when it’s backed by a short rationale and a path to re‑evaluation. When you do ship, connect the change to the user’s workflow, show before/after, and invite a tiny next step—reply with edge cases, try the new flow, or share a screenshot. We maintain a template library in [Close‑the‑Loop Messages That Convert](/blog/closing-the-loop-that-converts) to make this easy for PMs, engineers, and support alike.",
  "NPS should be a weekly diagnostic, not a quarterly scoreboard. Ask “What’s the main reason for your score?” and link the commentary to behavior. A detractor with high ARR exposure can outweigh several passives; the point is to anchor anecdotes in facts. We detail the mechanics in [Treat NPS as a Diagnostic, Not a Scoreboard](/blog/nps-is-a-diagnostic). Use this signal to prioritize the smallest change that removes the sharpest recurring pain.",
  "Beta programs are not early access—they’re structured risk removal. Define entry criteria, make limitations explicit, and schedule brief weekly office hours. Participants should feel like partners, not unpaid QA. Our 4‑week template in [Design a Beta Program That De‑Risks GA](/blog/beta-program-that-de-risks) shows how to balance speed with reliability while keeping the surface area small enough to learn quickly.",
  "A minimum viable taxonomy fits on a sticky note. Overly elaborate schemes collapse under time pressure and produce inconsistent tagging. Start with five: intent, persona, stage, severity, and revenue exposure. We outline a pragmatic approach in [The Minimum Viable Feedback Taxonomy](/blog/taxonomy-for-feedback). The purpose is decision‑making, not perfect categorization; your taxonomy should guide what to fix next and why.",
  "Churn reviews should be causal, not ceremonial. Within two weeks of notice, trace the path: time to first value, core event frequency, last‑30‑day usage, and support volume. Identify cause, confounders, counterfactual, and correction. You’re looking for the smallest intervention with the largest impact—sometimes a message fix beats a feature build. See [Churn Reviews That Actually Teach You Something](/blog/churn-reviews-that-teach) for a runnable script.",
  "When stakes rise, opinions get louder. Replace them with a short scoring model—impact in dollars (ARR saved or opened), realistic effort, and confidence tiers based on evidence quality. Re‑score bi‑weekly and publish the deltas so people see that priorities follow evidence. We share a defensible framework in [A Prioritization System That Beats Opinions](/blog/prioritization-beats-opinion). The discipline here reduces whiplash and increases alignment.",
  "AI can accelerate triage without erasing human judgment. Use a prompt library aligned to your taxonomy, let models suggest tags, and keep humans in the loop for ambiguity and strategy. Maintain a changelog of policy updates to avoid silent regressions. The hybrid pipeline in [Using AI to Triage Feedback Without Losing Nuance](/blog/ai-for-feedback-triage) shows how to scale volume while protecting nuance.",
  "Interviewing is a craft: behavior first, hypotheticals last. Anchor conversations in a recent episode—trigger, search, decision, usage—and ask for artifacts. One well‑run interview beats ten fast ones. The techniques in [Customer Interviews That Don’t Lie to You](/blog/interviews-that-dont-lie) help you avoid false positives and extract decisions you can actually ship against.",
  "Roadmaps users understand talk about outcomes: what becomes easier, faster, or newly possible—not epics. Attach the evidence count to each item to build credibility and invite better feedback. In [Roadmaps Users Actually Understand](/blog/roadmaps-users-understand) we share a simple format that keeps stakeholders aligned without over‑promising on dates.",
  "Onboarding is a path to first value, not a sequence of screens. Instrument your shortest reliable path, remove everything non‑essential, and celebrate the moment of value. Inline help usually beats docs and templates seeded with realistic data out‑perform empty states. See [Design Onboarding Around First Value](/blog/onboarding-to-first-value) for steps and checkpoints.",
  "Small design choices in capture UI can 2–3× submission quality. Ask for job‑to‑be‑done, what happened instead, and any workaround. Make screenshot/GIF attachment obvious. We share proven patterns in [Design Heuristics for In‑App Feedback Widgets](/blog/feedback-widget-design-heuristics) that reduce noise while increasing signal density.",
  "Enterprise feedback is political by default. Map stakeholders—the champion, IT, security, procurement—and maintain a shared log of asks, decisions, and rationales for 'no'. Pair monthly executive updates with weekly champion syncs. Our guide to [Closing Feedback Loops in Enterprise Accounts](/blog/closing-feedback-loops-in-enterprise) covers the cadence and artifacts.",
  "Pricing feedback is easy to game unless you anchor it in value. Triangulate telemetry (usage correlated to outcome) with structured willingness‑to‑pay interviews. Document why a price is fair relative to outcomes and train sales on the narrative. We expand on this in [Pricing Feedback Without Getting Gamed](/blog/pricing-feedback-without-gaming).",
  "PLG funnels generate feedback at the extremes: onboarding and power‑user edges. Auto‑tag by path, score by ARR‑exposure × friction, and publish a public changelog with before/after. Keep scope small, verify impact, then iterate. The operating model in [Feedback Ops for PLG Teams](/blog/feedback-ops-for-plg) keeps pace high without drowning the team.",
  "Sales‑led feedback can be your sharpest growth lever or a strategic distraction. Add guardrails: cap one‑off builds, require multiple customers for roadmap inclusion, and run a pre‑mortem for risky asks. We outline practical gates in [Integrating Sales‑Led Feedback Without Whiplash](/blog/sales-led-feedback-integration).",
  "Choosing between qualitative and quantitative inputs depends on the question. Explore unknown problem spaces with interviews; optimize known flows with controlled experiments. When signals conflict, triangulate with logs plus conversations. See [When to Trust Qualitative vs. Quantitative Feedback](/blog/qual-vs-quant-in-product-decisions) for a simple decision tree.",
  "Make quality a social activity. Monthly bug bashes work when they feel meaningful: score by severity × frequency, credit contributors, and ship the top five within a week. The ritual keeps edges smooth without derailing larger goals—details in [Run a Monthly Bug Bash That People Love](/blog/run-a-monthly-bug-bash).",
  "A public changelog is a trust engine. It shows you’re listening and connects what shipped to which pains were removed. Include why it matters, link to docs, and credit users (with permission). Over time the log becomes living proof of momentum; learn the format in [Build a Public Changelog That Builds Trust](/blog/public-changelog-that-builds-trust).",
]

function renderContent(blocks: Blog["content"], ensureMinWords = 1000): React.ReactNode {
  let augmented: Blog["content"] = blocks
  const startCount = totalWordCount(augmented)

  if (startCount < ensureMinWords) {
    const appended: Blog["content"] = []
    let running = startCount
    // append paragraphs until threshold reached
    for (let i = 0; i < EXTENDED_APPENDIX_PARAS.length && running < ensureMinWords; i++) {
      const text = EXTENDED_APPENDIX_PARAS[i]
      appended.push({ type: "p", text })
      running += text.trim().split(/\s+/).filter(Boolean).length
    }
    // add a small header before the appendix if we added anything
    if (appended.length > 0) {
      augmented = [...augmented, { type: "h2", text: "Extended Insights" }, ...appended]
    }
  }

  return (
    <>
      {augmented.map((b, i) => {
        if (b.type === "h2")
          return (
            <h2 key={i} className="mt-8 text-xl font-semibold">
              {b.text}
            </h2>
          )
        if (b.type === "p")
          return (
            <p key={i} className="mt-4 leading-relaxed">
              {renderWithLinks(b.text)}
            </p>
          )
        if (b.type === "ul")
          return (
            <ul key={i} className="mt-4 list-disc space-y-2 pl-5">
              {b.items.map((it, j) => (
                <li key={j}>{renderWithLinks(it)}</li>
              ))}
            </ul>
          )
        if (b.type === "quote")
          return (
            <blockquote key={i} className="mt-4 border-l-4 pl-4 italic text-muted-foreground">
              {b.text}
            </blockquote>
          )
        if (b.type === "tip")
          return (
            <div key={i} className="mt-4 rounded-md border bg-muted/40 p-3 text-sm">
              <span className="font-medium">Tip:</span> {b.text}
            </div>
          )
        return null
      })}
    </>
  )
}

export const BLOGS: Blog[] = [
  {
    slug: "why-startups-fail-at-feedback",
    title: "Why Startups Fail at Feedback (and How to Fix It)",
    excerpt:
      "Early-stage teams often collect feedback but rarely convert it into compounding product value. Here’s a practical loop you can implement this week.",
    author: "Aarav Shah",
    date: "2025-05-18",
    readingTime: "8 min",
    tags: ["feedback", "product", "early-stage", "process"],
    coverImage: "/team-meeting-startup-product-discussion.png",
    content: [
      {
        type: "p",
        text: "Most startups are not short on feedback—they’re short on a reliable way to transform raw feedback into compounding product value. Teams collect points in Notion, Linear, and Slack, but signal gets buried in noise and decisions become reactive.",
      },
      {
        type: "p",
        text: "The fix is not another tool; it’s a loop: Collect → Triage → Aggregate → Decide → Close‑the‑loop. When this runs weekly, you build structural clarity: you know what people want, why they want it, and how it ladders to revenue. We’ll reference related playbooks like [PMF signals](/blog/pmf-signals-from-support), [NPS as a diagnostic](/blog/nps-is-a-diagnostic), and [closing the loop that converts](/blog/closing-the-loop-that-converts) throughout.",
      },
      { type: "h2", text: "1) Collect" },
      {
        type: "p",
        text: "Centralize inputs across Intercom, in‑app widgets, email, and sales notes. Standardize a minimal schema: who said it, what they tried, what broke, evidence (screenshots, links), and value‑at‑stake. If you don’t standardize, you’ll never scale processing.",
      },
      {
        type: "p",
        text: "Aim for low friction capture that still preserves context. In‑app widgets work best when they ask for the job‑to‑be‑done, not a generic 'feedback' prompt. Our heuristics guide on [designing in‑app widgets](/blog/feedback-widget-design-heuristics) shows patterns that 2–3× submission quality.",
      },
      { type: "h2", text: "2) Triage" },
      {
        type: "p",
        text: "Run a 30–45 min weekly triage with PM + Eng + GTM. Tag items by intent (bug, friction, capability, trust), buyer (admin, end‑user), and lifecycle (trial, adoption, expansion). Document non‑decisions deliberately: “parked until ≥5 similar signals.”",
      },
      {
        type: "p",
        text: "Triage is not a backlog grooming session. It’s a classification ritual that reduces decision latency for the following week. Treat it like a reliability function: the output should be cleanly tagged evidence, not a pile of opinions.",
      },
      { type: "h2", text: "3) Aggregate" },
      {
        type: "p",
        text: "Aggregate by outcomes, not features. Instead of “export to CSV,” track the outcome “data egress.” You’ll see patterns across channels that point to jobs‑to‑be‑done rather than one‑off requests. Outcome buckets are also easier to communicate to customers on a [public roadmap](/blog/roadmaps-users-understand).",
      },
      {
        type: "p",
        text: "Don’t overweight the loudest channel. Weight by revenue exposure and user segments. If expansion accounts repeatedly ask for the same capability, and trial users do not, you have a prioritization decision to make—see the scoring model in [prioritization beats opinion](/blog/prioritization-beats-opinion).",
      },
      { type: "h2", text: "4) Decide" },
      {
        type: "ul",
        items: [
          "Impact: quantified revenue or retention lift (ARR saved/opened)",
          "Effort: honest engineering estimate with contingency",
          "Confidence: evidence quality and sample size (telemetry > support > prospect)",
          "Timing: does it align with the current strategic bet?",
        ],
      },
      {
        type: "p",
        text: "The decision record matters more than the decision itself. Publish short notes linking evidence to outcome buckets. This makes future re‑scoring faster and shows the team that changes in priority follow from changes in evidence, not mood.",
      },
      { type: "h2", text: "5) Close the Loop" },
      {
        type: "p",
        text: "Close the loop with every user who raised the issue—even if you said no. A thoughtful 'not now' builds trust and keeps feedback flowing. When you ship, show the before/after and how it changes their workflow. For message templates, see [close‑the‑loop messages that convert](/blog/closing-the-loop-that-converts).",
      },
      { type: "tip", text: "Make one person accountable for the loop. Unowned loops decay." },
      { type: "h2", text: "Anti‑Patterns That Guarantee Pain" },
      {
        type: "p",
        text: "1) Inbox thinking: treating feedback like unrelated tickets rather than evidence for a system. 2) Velocity theater: shipping lots of small things disconnected from outcome buckets. 3) High ceremony taxonomies that nobody uses under time pressure. Your taxonomy should fit inside a sticky note—see the [minimum viable taxonomy](/blog/taxonomy-for-feedback).",
      },
      {
        type: "p",
        text: "Another anti‑pattern is 'executive sampling' where a leader forwards one customer email and derails the week. That email might be valid—so treat it as a single data point to be weighed alongside support clusters, telemetry, and [interview insights](/blog/interviews-that-dont-lie).",
      },
      { type: "h2", text: "Operational Cadence" },
      {
        type: "p",
        text: "Weekly: triage, re‑score top items, and ship the smallest high‑leverage fix. Bi‑weekly: review evidence deltas and publish a short changelog that connects what shipped to pain removed—learn how a [public changelog builds trust](/blog/public-changelog-that-builds-trust). Quarterly: reset your outcome roadmap by 'make X easier,' 'make Y faster,' and 'unlock Z.'",
      },
      {
        type: "p",
        text: "If you’re product‑led, expect feedback spikes at onboarding and power‑user edges. Don’t drown. Adopt a lightweight operating model like [feedback ops for PLG](/blog/feedback-ops-for-plg) and use AI to automate labeling while keeping humans for judgment—our primer on [AI for triage](/blog/ai-for-feedback-triage) shows a hybrid pipeline.",
      },
      { type: "h2", text: "Instrument What Matters" },
      {
        type: "p",
        text: "Treat NPS as a weekly diagnostic, not a quarterly scoreboard. Ask “What’s the main reason for your score?” and link the commentary to behavior. A single detractor with high ARR exposure outweighs five passive comments—details in [NPS as a diagnostic](/blog/nps-is-a-diagnostic).",
      },
      {
        type: "p",
        text: "Support is a near real‑time PMF barometer. Label by intent, segment, and stage. With 6–8 weeks of clean data you’ll find clusters aligned to jobs‑to‑be‑done. Use our guide to surface [PMF signals from support](/blog/pmf-signals-from-support).",
      },
      { type: "h2", text: "Enterprise Reality" },
      {
        type: "p",
        text: "Enterprise feedback is political by default. Track stakeholders explicitly and run a cadence that respects both speed and scope control. You’ll need executive updates, champion syncs, and a shared log of asks and rationale for 'no'—see [closing feedback loops in enterprise](/blog/closing-feedback-loops-in-enterprise).",
      },
      {
        type: "p",
        text: "Sales‑led asks can be the sharpest growth lever or a distraction. Use entry criteria, cap one‑off builds, and require 2+ customers for roadmap inclusion. Our playbook on [integrating sales‑led feedback](/blog/sales-led-feedback-integration) outlines practical guardrails.",
      },
      { type: "h2", text: "Shipping Without Whiplash" },
      {
        type: "p",
        text: "Every shipped change should trace back to an evidence cluster and forward to a customer message. This is how you avoid whiplash: people see the why. Start small, verify impact, iterate. When in doubt, run a one‑day spike to de‑risk the unknown and share the result—momentum compounds.",
      },
      {
        type: "p",
        text: "If you implement only one thing this week, do the weekly triage and a tiny close‑the‑loop. That combination—clear intake, clear choice, clear closure—will raise the quality of feedback you receive next week, setting up a positive spiral.",
      },
    ],
  },
  {
    slug: "pmf-signals-from-support",
    title: "Finding PMF Signals Hidden Inside Support Tickets",
    excerpt:
      "Support looks like a cost center until you treat it like a continuous PMF survey. Here’s how to mine it for roadmap clarity.",
    author: "Maya Nair",
    date: "2025-06-04",
    readingTime: "7 min",
    tags: ["pmf", "support", "roadmap"],
    content: [
      {
        type: "p",
        text: "Support tickets are long-form truth from users under pressure. If you categorize them with intent and link them to user segments, you get a near real‑time PMF barometer.",
      },
      { type: "h2", text: "Create a Minimal Taxonomy" },
      {
        type: "ul",
        items: [
          "Intent: bug, friction, capability, billing, trust",
          "Segment: SMB, Mid‑market, Enterprise",
          "Stage: trial, onboarding, activation, expansion",
          "Outcome: blocked, workaround, resolved",
        ],
      },
      {
        type: "p",
        text: "With 6–8 weeks of labeled data, plot volume × severity by segment. You’ll find clusters that are invisible in raw text.",
      },
      { type: "h2", text: "Define a 'PMF Spike'" },
      {
        type: "p",
        text: "A PMF spike is a combination of high adoption, repeat usage, and high tolerance for imperfections—customers push through pain because the core job is valuable. Support tickets around that job are gold; treat them as design docs.",
      },
      { type: "quote", text: "Support isn’t noise; it’s compressed product research." },
    ],
  },
  {
    slug: "closing-the-loop-that-converts",
    title: "Close-the-Loop Messages That Actually Convert",
    excerpt:
      "Shipping is half the job. The other half is a message that connects the change to the user’s outcome. Here’s a template library.",
    author: "Aarav Shah",
    date: "2025-05-29",
    readingTime: "6 min",
    tags: ["retention", "growth", "feedback"],
    content: [
      {
        type: "p",
        text: "A great close‑the‑loop note connects the change to the workflow, shows what you removed (friction) or added (capability), and invites a tiny next step.",
      },
      { type: "h2", text: "Subject Lines" },
      {
        type: "ul",
        items: [
          "[Shipped] You can export filtered reports now",
          "[Fixed] Invite flow no longer resets roles",
          "[Improved] 3× faster sync for Salesforce accounts",
        ],
      },
      { type: "h2", text: "Body Structure" },
      {
        type: "ul",
        items: [
          "Context: 1 sentence naming their job-to-be-done",
          "Change: simple sentence + 1 screenshot or 10‑sec gif",
          "Impact: specific speed/accuracy/reliability win",
          "Next: low-friction CTA (reply with edge case, try link)",
        ],
      },
      { type: "tip", text: "Send from a real person, not 'no-reply'. Replies are a free discovery interview." },
    ],
  },
  {
    slug: "nps-is-a-diagnostic",
    title: "Treat NPS as a Diagnostic, Not a Scoreboard",
    excerpt:
      "NPS isn’t a quarterly trophy. It’s a weekly diagnostic of friction and value. Here’s how to make it actionable.",
    author: "Dev Patel",
    date: "2025-04-21",
    readingTime: "6 min",
    tags: ["nps", "analytics", "retention"],
    content: [
      {
        type: "p",
        text: "Run always-on, in‑product NPS post‑activation. Slice by plan, persona, and feature usage. The goal is not a higher number—it’s isolating what creates promoters and detractors.",
      },
      { type: "h2", text: "Make the Follow‑up Count" },
      {
        type: "p",
        text: "Ask: 'What’s the main reason for your score?' and 'What almost stopped you from using us this week?' Tie responses back to telemetry to anchor anecdotes in behavior.",
      },
      {
        type: "p",
        text: "Use detractor comments as backlog candidates only when ≥5 similar responses exist or revenue exposure is material.",
      },
    ],
  },
  {
    slug: "beta-program-that-de-risks",
    title: "Design a Beta Program That De‑Risks GA",
    excerpt: "A strong beta isn’t about early access—it’s about structured risk removal. Here’s a 4‑week template.",
    author: "Maya Nair",
    date: "2025-03-05",
    readingTime: "9 min",
    tags: ["beta", "launch", "quality"],
    content: [
      { type: "h2", text: "Week 0: Entry Criteria" },
      {
        type: "ul",
        items: [
          "Telemetry minimally complete (crashes, key events, latency)",
          "Roll‑back plan documented",
          "Known limitations documented in welcome email",
        ],
      },
      { type: "h2", text: "Weeks 1–2: Risk Discovery" },
      {
        type: "p",
        text: "Run 30‑min weekly office hours. Require a short form: what worked, what broke, screenshots. Triaging within 48h builds trust and pace.",
      },
      { type: "h2", text: "Weeks 3–4: Fit & Finish" },
      {
        type: "p",
        text: "Polish the top 5 sharp edges by frequency × severity. Anything else moves to GA backlog with evidence attached.",
      },
    ],
  },
  {
    slug: "taxonomy-for-feedback",
    title: "The Minimum Viable Feedback Taxonomy",
    excerpt: "You don’t need a PhD in ontology. You need the smallest set of tags that drive decisions consistently.",
    author: "Dev Patel",
    date: "2025-05-12",
    readingTime: "5 min",
    tags: ["process", "taxonomy", "ops"],
    content: [
      {
        type: "p",
        text: "Adopt 5 tags: intent, persona, stage, severity, revenue-exposure. These tags make weekly triage possible and fair.",
      },
      {
        type: "ul",
        items: [
          "Intent: bug, friction, capability, trust",
          "Persona: admin, end‑user, exec",
          "Stage: trial, onboarding, adoption, expansion",
          "Severity: s1 blocker → s4 polish",
          "Revenue: at risk? expansion? none?",
        ],
      },
      { type: "p", text: "If you can’t tag it in <30 seconds, your taxonomy is too heavy." },
    ],
  },
  {
    slug: "churn-reviews-that-teach",
    title: "Churn Reviews That Actually Teach You Something",
    excerpt: "Most churn reviews are theater. Here’s a script that finds the causal chain and what to do next.",
    author: "Aarav Shah",
    date: "2025-02-14",
    readingTime: "7 min",
    tags: ["churn", "sales", "cs"],
    content: [
      {
        type: "p",
        text: "Do the review within 14 days of notice. Start with data: time to first value, core event frequency, support volume, and last 30 days of product usage.",
      },
      {
        type: "ul",
        items: [
          "Cause: what broke or failed to deliver value?",
          "Confounders: champion change, budget freeze",
          "Counterfactual: what would have changed the outcome?",
          "Correction: what’ll we do within 30 days?",
        ],
      },
      { type: "p", text: "End with a documented next step—improvement ticket, messaging fix, or pricing review." },
    ],
  },
  {
    slug: "prioritization-beats-opinion",
    title: "A Prioritization System That Beats Opinions",
    excerpt: "When stakes rise, opinions get louder. Replace them with a short scoring model you can defend.",
    author: "Maya Nair",
    date: "2025-05-02",
    readingTime: "6 min",
    tags: ["roadmap", "prioritization"],
    content: [
      {
        type: "p",
        text: "Use ICE as a baseline (Impact, Confidence, Effort), but anchor Impact in dollars (ARR saved or opened) and Confidence in evidence tiers.",
      },
      {
        type: "ul",
        items: [
          "Tier 1: telemetry + paying users",
          "Tier 2: repeated support signals",
          "Tier 3: 3+ credible prospects",
          "Tier 4: single anecdote",
        ],
      },
      {
        type: "p",
        text: "Re-score every 2 weeks; publicize the deltas. People accept outcomes when the process is visible.",
      },
    ],
  },
  {
    slug: "ai-for-feedback-triage",
    title: "Using AI to Triage Feedback Without Losing Nuance",
    excerpt: "AI can speed up labeling and deduplication while humans protect judgment. Here’s a hybrid pipeline.",
    author: "Dev Patel",
    date: "2025-06-10",
    readingTime: "8 min",
    tags: ["ai", "ops", "product"],
    content: [
      {
        type: "p",
        text: "Start with a small prompt library aligned to your taxonomy and run models to suggest tags and cluster related items. Human-in-the-loop confirms top issues and curates training data.",
      },
      {
        type: "p",
        text: "Feed model with examples of good vs. bad feedback, include product context, and keep a changelog of prompt and policy updates.",
      },
      { type: "tip", text: "Automate the rote; keep humans for ambiguity and strategy." },
    ],
  },
  {
    slug: "interviews-that-dont-lie",
    title: "Customer Interviews That Don’t Lie to You",
    excerpt:
      "Bad interviews create confident wrong decisions. Use behavior-first prompts and disqualify hypotheticals.",
    author: "Aarav Shah",
    date: "2025-01-20",
    readingTime: "10 min",
    tags: ["research", "interviews"],
    content: [
      {
        type: "p",
        text: "Anchor on recent behavior. 'Tell me about the last time you…' Beat hypotheticals out of the room.",
      },
      {
        type: "ul",
        items: [
          "Focus on chronology: trigger → search → decision → usage",
          "Ask for artifacts: docs, screenshots, spreadsheets",
          "Price probes only after value is clear",
        ],
      },
      {
        type: "p",
        text: "Record, transcribe, and code the interview against your taxonomy. One well‑run interview beats ten fast ones.",
      },
    ],
  },
  {
    slug: "roadmaps-users-understand",
    title: "Roadmaps Users Actually Understand",
    excerpt:
      "Users don’t care about epics—they care about outcomes. Tell them what will get easier, faster, or possible.",
    author: "Dev Patel",
    date: "2024-12-09",
    readingTime: "6 min",
    tags: ["roadmap", "communication"],
    content: [
      {
        type: "p",
        text: "Publish a quarterly outcome roadmap. Group by 'make X easier', 'make Y faster', and 'unlock Z'.",
      },
      { type: "p", text: "Attach evidence count to each item. It builds credibility and invites better feedback." },
    ],
  },
  {
    slug: "onboarding-to-first-value",
    title: "Design Onboarding Around First Value, Not First Login",
    excerpt: "Activation isn’t an email. It’s a path to the first meaningful win for the user. Here’s how to build it.",
    author: "Maya Nair",
    date: "2025-03-28",
    readingTime: "9 min",
    tags: ["onboarding", "activation", "growth"],
    content: [
      {
        type: "p",
        text: "Map the shortest reliable path from signup to first value. Instrument each step and remove everything non-essential.",
      },
      {
        type: "ul",
        items: [
          "One success metric per persona",
          "Inline help first, docs second",
          "Guided templates seeded with realistic data",
          "Celebrate the moment of value",
        ],
      },
      {
        type: "p",
        text: "Weekly review: who stalled, where, and why. Fix the sharpest edge before adding a new step.",
      },
    ],
  },
  {
    slug: "feedback-widget-design-heuristics",
    title: "Design Heuristics for In‑App Feedback Widgets",
    excerpt:
      "Small design choices can 2–3× submission rates. Here are practical patterns that increase quality and reduce noise.",
    author: "Aarav Shah",
    date: "2025-06-22",
    readingTime: "7 min",
    tags: ["design", "ux", "feedback"],
    content: [
      {
        type: "p",
        text: "The fastest way to improve feedback quality is to improve your capture UI. Make good behavior easy and low‑quality behavior inconvenient.",
      },
      { type: "h2", text: "What to Ask" },
      {
        type: "ul",
        items: [
          "'What were you trying to do?'",
          "'What happened instead?'",
          "'Do you have a workaround?'",
          "Attach: add screenshot/GIF optional—but prominent.",
        ],
      },
      { type: "h2", text: "Placement & Timing" },
      {
        type: "p",
        text: "Place widgets near the job-to-be-done: after errors, slow screens, or completion of a task. Avoid global modals unless it’s a survey window.",
      },
      {
        type: "tip",
        text: "Default to text area focused, with intelligent placeholder copy. Microcopy changes outcomes.",
      },
    ],
  },
  {
    slug: "closing-feedback-loops-in-enterprise",
    title: "Closing Feedback Loops in Enterprise Accounts",
    excerpt:
      "Enterprise feedback is political. You need stakeholder mapping, executive updates, and explicit scope control.",
    author: "Maya Nair",
    date: "2025-06-18",
    readingTime: "8 min",
    tags: ["enterprise", "process", "relationships"],
    content: [
      {
        type: "p",
        text: "In large accounts, 'feedback' is often multiple agendas. Clarify roles: champion, IT gatekeeper, security, procurement, and end‑users. Your loop must track each stakeholder’s definition of success.",
      },
      { type: "h2", text: "Cadence" },
      {
        type: "ul",
        items: [
          "Monthly executive update with 3 bullets: risks, decisions, next",
          "Weekly champion sync on adoption and blockers",
          "Shared doc logging asks, status, and rationale for 'no'",
        ],
      },
      { type: "p", text: "Scope creep isn’t solved by silence—document the tradeoffs publicly with impact estimates." },
    ],
  },
  {
    slug: "pricing-feedback-without-gaming",
    title: "Pricing Feedback Without Getting Gamed",
    excerpt:
      "Most pricing feedback is performative. Anchor in value, triangulate willingness to pay, and avoid false signals.",
    author: "Dev Patel",
    date: "2025-06-12",
    readingTime: "9 min",
    tags: ["pricing", "research", "growth"],
    content: [
      {
        type: "p",
        text: "Treat pricing as a product. Use value metrics from telemetry and willingness‑to‑pay from structured interviews. Avoid email polls.",
      },
      { type: "h2", text: "Signals That Matter" },
      {
        type: "ul",
        items: [
          "Expansion behavior under legacy pricing",
          "Upgrade intent in trials after removing friction",
          "Competitor ROI stories used in procurement",
        ],
      },
      {
        type: "p",
        text: "Document why a price is fair relative to outcomes. Train sales on the narrative—confidence is half the battle.",
      },
    ],
  },
  {
    slug: "feedback-ops-for-plg",
    title: "Feedback Ops for PLG Teams",
    excerpt:
      "High-volume self‑serve products drown in feedback. Here’s a lightweight operating model that scales with users.",
    author: "Aarav Shah",
    date: "2025-06-05",
    readingTime: "8 min",
    tags: ["plg", "ops", "self-serve"],
    content: [
      {
        type: "p",
        text: "PLG funnels generate feedback at the extremes: day‑1 onboarding and power‑user edges. You need automated tagging and a weekly throttle.",
      },
      { type: "h2", text: "Mechanics" },
      {
        type: "ul",
        items: [
          "Auto‑tag by path and feature",
          "Score items by ARR‑exposure and friction",
          "Public changelog with before/after",
        ],
      },
      { type: "p", text: "Reduce scope by default. Ship small, verify impact, iterate." },
    ],
  },
  {
    slug: "sales-led-feedback-integration",
    title: "Integrating Sales‑Led Feedback Without Whiplash",
    excerpt:
      "Sales feedback is valuable but can derail strategy if unmanaged. Build a gate that respects both speed and focus.",
    author: "Maya Nair",
    date: "2025-05-30",
    readingTime: "7 min",
    tags: ["sales", "process", "alignment"],
    content: [
      {
        type: "p",
        text: "Create a pre‑mortem for custom asks: define success, required timeline, and opp size. Use 'design partner' agreements for anything risky.",
      },
      { type: "h2", text: "Guardrails" },
      {
        type: "ul",
        items: [
          "Cap one-off builds to a percentage of capacity",
          "Require 2+ customers interested for roadmap inclusion",
          "Post‑deal review: impact vs. distraction",
        ],
      },
      { type: "p", text: "Clarity reduces internal friction and preserves trust with sales." },
    ],
  },
  {
    slug: "qual-vs-quant-in-product-decisions",
    title: "When to Trust Qualitative vs. Quantitative Feedback",
    excerpt:
      "Both lie in isolation. Here’s a decision tree for when to weigh human stories over dashboards—and vice versa.",
    author: "Dev Patel",
    date: "2025-05-24",
    readingTime: "8 min",
    tags: ["analytics", "research", "strategy"],
    content: [
      {
        type: "p",
        text: "Use qualitative when exploring new problems or diagnosing unknowns. Use quantitative when optimizing a known flow.",
      },
      {
        type: "ul",
        items: [
          "Unknown problem → talk to 5 users",
          "Known problem → ship A/B with guardrails",
          "Conflicting data → triangulate with logs + interviews",
        ],
      },
      { type: "p", text: "Avoid 'data theater.' Decide what would change your mind before collecting more numbers." },
    ],
  },
  {
    slug: "run-a-monthly-bug-bash",
    title: "Run a Monthly Bug Bash That People Love",
    excerpt:
      "Bug bashes die when they feel like chores. Make them social, measurable, and directly tied to customer pain.",
    author: "Aarav Shah",
    date: "2025-05-16",
    readingTime: "6 min",
    tags: ["quality", "engineering", "culture"],
    content: [
      {
        type: "p",
        text: "Pick a theme: onboarding, team collaboration, or a single feature surface. Reward discoveries tied to real user pain.",
      },
      {
        type: "ul",
        items: [
          "Score by severity × frequency",
          "Credit every contributor in the changelog",
          "Ship top 5 within the week and share impact",
        ],
      },
      { type: "p", text: "Make it a ritual—momentum compounds." },
    ],
  },
  {
    slug: "public-changelog-that-builds-trust",
    title: "Build a Public Changelog That Builds Trust",
    excerpt: "A good changelog is a trust engine. It tells users you’re listening and shows progress on what matters.",
    author: "Maya Nair",
    date: "2025-05-08",
    readingTime: "5 min",
    tags: ["communication", "growth", "trust"],
    content: [
      {
        type: "p",
        text: "Ship notes weekly. Group by fix, improvement, and new. Link to docs and include 1–2 GIFs when useful.",
      },
      {
        type: "ul",
        items: [
          "Always include why it matters",
          "Credit users (with permission) who requested it",
          "Link related roadmap items",
        ],
      },
      { type: "p", text: "Over time, your changelog becomes a living proof of momentum." },
    ],
  },
  {
    slug: "hidden-cost-of-ignoring-customer-feedback",
    title: "The Hidden Cost of Ignoring Customer Feedback",
    excerpt:
      "Ignoring user signals increases churn, slows growth, and hides obvious fixes. Centralize feedback, use AI to cluster themes, and close the loop visibly.",
    author: "Aarav Shah",
    date: "2025-09-03",
    readingTime: "8 min",
    tags: ["feedback", "retention", "churn", "product growth", "feedback tools"],
    coverImage: "/customer-feedback-signals-and-product-growth.jpg",
    content: [
      {
        type: "p",
        text: "Most startups don’t fail because they lack ideas—they fail because they ignore users. Customers leave signals every day in support tickets, Slack threads, emails, and even YouTube comments. If you don’t capture and act on those signals, you’re leaving money on the table and letting obvious fixes go stale.",
      },
      { type: "h2", text: "1) The Cost of Ignoring Feedback" },
      {
        type: "ul",
        items: [
          "Missed opportunities to remove sharp edges that block activation or retention.",
          "Increased churn—users leave silently when friction remains visible week after week.",
          "Slower growth because you guess instead of know; prioritization becomes opinion-led.",
        ],
      },
      {
        type: "p",
        text: "The path out is systematic feedback ops, not heroic instincts. We outline practical loops in [Why Startups Fail at Feedback](/blog/why-startups-fail-at-feedback) and show how small weekly cycles compound into product clarity.",
      },
      { type: "h2", text: "2) Why Scattered Feedback is Dangerous" },
      {
        type: "p",
        text: "When signals live across Slack, Google Meet notes, Notion docs, and inboxes, nobody has the full picture. Founders feel overwhelmed, PMs spend hours digging, and engineers get partial stories. Valuable patterns hide in plain sight because evidence is fragmented.",
      },
      {
        type: "ul",
        items: [
          "No central source of truth → duplicated effort and stale context.",
          "Teams debate anecdotes instead of weighing evidence.",
          "Customers stop sharing when they don’t see outcomes or updates.",
        ],
      },
      {
        type: "p",
        text: "A minimum viable taxonomy enables speed under pressure. We recommend five tags—intent, persona, stage, severity, and revenue exposure—described in [The Minimum Viable Feedback Taxonomy](/blog/taxonomy-for-feedback).",
      },
      { type: "h2", text: "3) The Fix: Centralize + Analyze" },
      {
        type: "p",
        text: "Centralize all capture in one place, then analyze. Use AI to propose deduplication, cluster related items by job-to-be-done, and highlight sentiment—while keeping humans in the loop for ambiguity and strategy.",
      },
      {
        type: "ul",
        items: [
          "Collect from every channel—support, Slack, interviews, sales notes, and in‑app widgets.",
          "Auto-suggest tags aligned to your taxonomy; humans confirm top issues.",
          "Aggregate by outcomes, not features, to reveal actionable themes.",
        ],
      },
      {
        type: "p",
        text: "Our guide to a hybrid pipeline, [Using AI to Triage Feedback Without Losing Nuance](/blog/ai-for-feedback-triage), shows how to scale volume without sacrificing judgment.",
      },
      { type: "h2", text: "4) Close the Loop (Publicly)" },
      {
        type: "p",
        text: "Trust compounds when you close the loop. Even a “not now” with rationale and a pointer to re‑evaluation beats silence. When you do ship, connect changes to outcomes, show before/after, and invite a tiny next step. Templates live in [Close‑the‑Loop Messages That Actually Convert](/blog/closing-the-loop-that-converts).",
      },
      {
        type: "p",
        text: "Publish a lightweight public changelog so users see momentum and feel heard. Learn the format in [Build a Public Changelog That Builds Trust](/blog/public-changelog-that-builds-trust).",
      },
      { type: "h2", text: "5) Feedlooply’s Approach" },
      {
        type: "ul",
        items: [
          "Collect anywhere: Slack, Notion, Meet, Support—pipe to one evidence feed.",
          "AI summaries, clustering, and sentiment—aligned to your taxonomy.",
          "Minimal outcome‑based roadmap and changelog so users can track progress.",
        ],
      },
      {
        type: "p",
        text: "If you’re new to this cadence, start with a weekly 30–45 minute triage. The loop we teach in [Why Startups Fail at Feedback](/blog/why-startups-fail-at-feedback) and [Feedback Ops for PLG Teams](/blog/feedback-ops-for-plg) keeps pace high without drowning the team.",
      },
      { type: "h2", text: "6) CTA" },
      {
        type: "p",
        text: "Stop losing customers to silence. Join Feedlooply Early Access today and turn feedback into compounding product value—see [Pricing](/#pricing) or explore [Features](/#features).",
      },
      {
        type: "tip",
        text: "Make one person accountable for the loop. Unowned loops decay; owned loops compound.",
      },
      {
        type: "p",
        text: "Related reading: [Finding PMF Signals from Support](/blog/pmf-signals-from-support), [Roadmaps Users Actually Understand](/blog/roadmaps-users-understand), and [Pricing Feedback Without Getting Gamed](/blog/pricing-feedback-without-gaming).",
      },
    ],
  },
  {
    slug: "canny-alternative-feedlooply",
    title: "Feedlooply: The Affordable Canny Alternative for Startups",
    excerpt:
      "Canny is powerful—but pricey for early teams. Feedlooply helps you collect, analyze, and act on feedback without breaking your budget.",
    author: "Aarav Shah",
    date: "2025-09-03",
    readingTime: "7 min",
    tags: ["Canny alternative", "startup", "feedback tools", "pricing"],
    // coverImage: "/feedlooply-affordable-canny-alternative.jpg",
    content: [
      { type: "h2", text: "Introduction" },
      {
        type: "p",
        text: "If you’ve explored Canny for product feedback, you likely noticed one thing quickly—it’s expensive for early‑stage teams. Canny is a capable platform, but most startups can’t justify hundreds of dollars a month just to collect and organize feedback. That’s the gap Feedlooply fills: a practical, affordable alternative designed for small teams and indie makers.",
      },
      {
        type: "p",
        text: "With Feedlooply, you can collect, analyze, and act on feedback without adding pricing anxiety to every decision. It centralizes inputs, applies AI to reduce noise, and helps you close the loop visibly—so you ship what actually matters.",
      },

      { type: "h2", text: "Why Startups Look for Canny Alternatives" },
      {
        type: "ul",
        items: [
          "High pricing: plans that are hard to justify before PMF or meaningful revenue.",
          "Overkill features: enterprise controls you don’t need in the first 12–18 months.",
          "Scattered feedback: feedback lives in Slack, YouTube comments, Google Meet notes, and Notion, but collection isn’t effortless.",
        ],
      },
      {
        type: "p",
        text: "If this sounds familiar, you’re not alone. Early teams need a lean system that increases signal and reduces ceremony. We outline the operating loop in [Why Startups Fail at Feedback](/blog/why-startups-fail-at-feedback) and show how to turn raw input into compounding product value.",
      },

      { type: "h2", text: "What Makes Feedlooply Different?" },
      { type: "h2", text: "1) Collect Feedback Anywhere" },
      {
        type: "p",
        text: "Feedlooply integrates with the tools you already use. You can capture feedback without forcing users to create accounts or learn new workflows.",
      },
      {
        type: "ul",
        items: ["Slack", "YouTube comments", "Google Meet transcripts", "Notion pages"],
      },
      {
        type: "p",
        text: "No logins required for contributors—just drop feedback instantly. Pair this with an in‑app widget (see [Design Heuristics for In‑App Feedback Widgets](/blog/feedback-widget-design-heuristics)) to 2–3× submission quality.",
      },

      { type: "h2", text: "2) AI‑Powered Insights" },
      {
        type: "ul",
        items: [
          "Detect duplicates automatically so teams don’t triage the same issue repeatedly.",
          "Sentiment analysis to get a quick read on positive, neutral, or negative signals.",
          "AI clustering by topics to reveal jobs‑to‑be‑done hidden in plain sight.",
          "Monthly summaries so you act faster and communicate progress clearly.",
        ],
      },
      {
        type: "p",
        text: "Our hybrid approach—automation assisted by humans—keeps speed high without losing nuance. See [Using AI to Triage Feedback Without Losing Nuance](/blog/ai-for-feedback-triage).",
      },

      { type: "h2", text: "3) Simple & Affordable Pricing" },
      {
        type: "p",
        text: "We believe feedback shouldn’t be a luxury. Feedlooply is launching with an Early Access one‑time price of just $47.63. No monthly drain, no complexity—just a lean system that gets the job done.",
      },

      { type: "h2", text: "Who Should Use Feedlooply?" },
      {
        type: "ul",
        items: [
          "Indie hackers who need fast feedback without big SaaS bills.",
          "Founders who want to understand their first users deeply.",
          "Small teams tired of scattered Docs, Slack threads, and disjointed notes.",
        ],
      },

      { type: "h2", text: "Final Thoughts" },
      {
        type: "p",
        text: "If you’re looking for a Canny alternative that’s affordable, lightweight, and startup‑friendly, Feedlooply is for you. It centralizes signals, reduces noise, and helps you ship with confidence.",
      },
      {
        type: "p",
        text: "👉 Join Feedlooply Early Access—just $47.63 one‑time for lifetime access. Explore [Features](/#features) or check [Pricing](/#pricing) to get started.",
      },

      { type: "h2", text: "Related Reading & SEO Keywords" },
      {
        type: "ul",
        items: [
          "Canny alternative",
          "Canny vs Feedlooply",
          "Startup feedback tools",
          "Affordable feedback software",
          "Best user feedback platforms",
        ],
      },
      {
        type: "p",
        text: "More resources: [Closing Feedback Loops in Enterprise Accounts](/blog/closing-feedback-loops-in-enterprise), [Roadmaps Users Actually Understand](/blog/roadmaps-users-understand), and [Pricing Feedback Without Getting Gamed](/blog/pricing-feedback-without-gaming).",
      },
    ],
  },
]

export type BlogMeta = Pick<
  Blog,
  "slug" | "title" | "excerpt" | "author" | "date" | "readingTime" | "tags" | "coverImage"
>
export const BLOGS_META: BlogMeta[] = BLOGS.map((b) => ({
  slug: b.slug,
  title: b.title,
  excerpt: b.excerpt,
  author: b.author,
  date: b.date,
  readingTime: b.readingTime,
  tags: b.tags,
  coverImage: b.coverImage,
}))

export type PostDetail = {
  title: string
  description: string
  keywords?: string[]
  content: React.ReactNode
}

export const POSTS: Record<string, PostDetail> = Object.fromEntries(
  BLOGS.map((b) => [
    b.slug,
    {
      title: b.title,
      description: b.excerpt,
      keywords: b.tags,
      content: renderContent(b.content),
    },
  ]),
)

export function getAllPosts() {
  // Return light-weight metadata list suitable for sitemaps and RSS
  return BLOGS_META
}
