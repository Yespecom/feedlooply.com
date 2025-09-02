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
  // Parse [label](href) and render as <Link>
  const parts: Array<string | { label: string; href: string }> = []
  const regex = /\[([^\]]+)\]$$([^)]+)$$/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push({ label: match[1], href: match[2] })
    lastIndex = regex.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return (
    <>
      {parts.map((part, i) =>
        typeof part === "string" ? (
          <span key={i}>{part}</span>
        ) : (
          <Link key={i} href={part.href} className="underline decoration-primary underline-offset-4 hover:opacity-90">
            {part.label}
          </Link>
        ),
      )}
    </>
  )
}

function renderContent(blocks: Blog["content"]): React.ReactNode {
  return (
    <>
      {blocks.map((b, i) => {
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
