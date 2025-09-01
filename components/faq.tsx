"use client"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

const faqs = [
  {
    q: "What if Feedlooply doesn’t launch in 60 days?",
    a: "Full refund. Email hello@feedlooply.com with your transaction id; processed within 7 business days.",
  },
  {
    q: "How do viewers post feedback?",
    a: "Hosts share a link or embed. Viewers click and can post/upvote without signup if host allows anonymous one-click feedback.",
  },
  {
    q: "Is data private?",
    a: "Boards can be public, private, or unlisted. Admins control permissions.",
  },
  {
    q: "Can I get an invoice?",
    a: "Yes — click “Request Invoice” after purchase or email hello@feedlooply.com.",
  },
]

export function FAQ() {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-balance text-2xl font-semibold md:text-3xl text-center">FAQs</h2>
      <Accordion type="single" collapsible className="mt-6">
        {faqs.map((f) => (
          <AccordionItem key={f.q} value={f.q}>
            <AccordionTrigger>{f.q}</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
