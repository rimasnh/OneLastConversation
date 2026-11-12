import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, BookOpen, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center — OneLastConversion" },
      { name: "description", content: "Answers about privacy, boundaries, and how OneLastConversion works." },
      { property: "og:title", content: "Help Center — OneLastConversion" },
      { property: "og:description", content: "Frequently asked questions and support resources." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Help,
});

const faqs: [string, string][] = [
  ["Is this really my loved one?", "No. OneLastConversion is a reflection tool. It never represents real communication with someone who has passed away."],
  ["Is the preview made from my photo?", "Not in this demo. The preview is a pre-made sample animation shown to everyone."],
  ["Where is my photo stored?", "In this demo, nowhere. It stays in your browser tab and disappears when you remove it or close the page."],
  ["How do boundaries work?", "You list topics the companion may discuss and topics to avoid. In the full product, those rules would guide every response."],
  ["Can I delete my data?", "Yes. Use “Remove photo” at any time. Full accounts would include one-click deletion of everything."],
  ["What if this feels overwhelming?", "Grief is personal. Please take breaks, and reach out to a grief counselor or a trusted person if you need support."],
];

function Help() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-center text-5xl">How can we help?</h1>
      <p className="mt-3 text-center text-muted-foreground">Sample help content for this demo.</p>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          { i: BookOpen, t: "Getting started", d: "Create your first preview in minutes." },
          { i: HeartHandshake, t: "Grief resources", d: "Gentle support guides and hotlines." },
          { i: Mail, t: "Contact us", d: "support@onelastconversion.example" },
        ].map(({ i: I, t, d }) => (
          <div key={t} className="rounded-2xl bg-card p-6 shadow-soft">
            <I className="size-5 text-primary" />
            <h2 className="mt-3 text-2xl">{t}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
      <h2 className="mt-16 text-3xl">Frequently asked questions</h2>
      <Accordion type="single" collapsible className="mt-4 rounded-2xl bg-card px-6 shadow-soft">
        {faqs.map(([q, a]) => (
          <AccordionItem key={q} value={q}>
            <AccordionTrigger className="text-left">{q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}
