import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — OneLastConversation" },
      { name: "description", content: "Sample pricing plans for the OneLastConversation memorial companion demo." },
      { property: "og:title", content: "Pricing — OneLastConversation" },
      { property: "og:description", content: "Sample pricing plans for the OneLastConversation memorial companion demo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Remember",
    price: "$0",
    period: "forever",
    blurb: "A gentle way to try the companion preview.",
    features: ["1 companion preview", "Sample demo animation", "Basic boundary settings", "Photos removed on request"],
    featured: false,
  },
  {
    name: "Cherish",
    price: "$12",
    period: "per month",
    blurb: "For families who want an ongoing space to remember.",
    features: ["Unlimited previews", "Multiple photo uploads", "Full boundary controls", "Private memory library", "Priority support"],
    featured: true,
  },
  {
    name: "Legacy",
    price: "$99",
    period: "per year",
    blurb: "A lasting memorial space for the whole family.",
    features: ["Everything in Cherish", "Family sharing", "Annual memory compilation", "Dedicated support"],
    featured: false,
  },
];

function PricingPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl text-primary sm:text-5xl">Simple, respectful pricing</h1>
        <p className="mt-4 text-muted-foreground">
          Sample plans for demonstration purposes only — no payments are collected on this demo site.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`shadow-soft ${plan.featured ? "border-primary ring-1 ring-primary/40" : ""}`}
          >
            <CardHeader>
              {plan.featured && (
                <span className="mb-2 inline-block w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Most popular
                </span>
              )}
              <CardTitle className="font-display text-2xl">{plan.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{plan.blurb}</p>
              <p className="pt-2">
                <span className="font-display text-4xl text-primary">{plan.price}</span>{" "}
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full rounded-full" variant={plan.featured ? "default" : "outline"}>
                Choose {plan.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
        OneLastConversation is an AI companion, not the person who died and not grief therapy. Memorial companions
        cannot be published or used romantically.
      </p>
    </main>
  );
}
