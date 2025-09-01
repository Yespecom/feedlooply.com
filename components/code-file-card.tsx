import Link from "next/link"

export function CodeFileCard() {
  const plan = "Early Founder Lifetime Deal"
  const pricing = "one-time, lifetime access"

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Window chrome */}
      <div
        className="rounded-lg border bg-muted/60 backdrop-blur supports-[backdrop-filter]:bg-muted/50"
        role="group"
        aria-label="Early Founder Lifetime Deal - code card"
      >
        <div className="flex items-center justify-between border-b px-4 py-2">
          <div className="flex items-center gap-2">
            {/* Use neutral dots to stay within the color system */}
            <span className="h-2 w-2 rounded-full bg-border" aria-hidden="true" />
            <span className="h-2 w-2 rounded-full bg-border" aria-hidden="true" />
            <span className="h-2 w-2 rounded-full bg-border" aria-hidden="true" />
          </div>
          <div className="text-xs text-muted-foreground font-mono" aria-hidden="true">
            early-founder.ts
          </div>
        </div>

        {/* "Code" body */}
        <div className="px-4 py-4">
          <pre className="font-mono text-sm leading-6 text-pretty">
            <code>
              <span className="text-muted-foreground">{"// Claim lifetime access once, enjoy forever"}</span>
              {"\n"}
              <span className="text-foreground">const</span> plan <span className="text-foreground">=</span>{" "}
              <span className="text-primary">{'"Early Founder Lifetime Deal"'}</span>
              {"\n"}
              <span className="text-foreground">const</span> pricing <span className="text-foreground">=</span>{" "}
              <span className="text-primary">{'"one-time, lifetime access"'};</span>
              {"\n\n"}
              <span className="text-muted-foreground">
                {"// No subscriptions. No renewals. All features included."}
              </span>
              {"\n"}
              <span className="text-foreground">function</span> <span className="text-primary">unlock</span>
              <span className="text-foreground">()</span> {"{"}
              {"\n  "}
              <span className="text-foreground">return</span>{" "}
              <span className="text-primary">
                "`${plan} → ${pricing}`"
              </span>
              ;{"\n"}
              {"}"}
            </code>
          </pre>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono">
              {/* Decorative line to mimic status bar */}
              {"// Click run to continue"}
            </span>
            <Link
              href="#pricing"
              className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
              aria-label="Jump to pricing to claim the Early Founder Lifetime Deal"
            >
              run
              <span className="ml-1 text-primary">()</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
