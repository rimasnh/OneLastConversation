import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — OneLastConversion" },
      { name: "description", content: "Simple, transparent plans for OneLastConversion memorial companions." },
      { property: "og:title", content: "Pricing — OneLastConversion" },
      { property: "og:description", content: "Sample plans: Remember, Cherish, and Legacy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Pricing,
});

const plans = [
  { name: "Remember", price: "$0", per: "forever", desc: "Explore gently, at your own pace.", features: ["1 companion profile", "Boundary settings", "Sample previews", "Delete anytime"] },
  { name: "Cherish", price: "$12", per: "per month", desc: "For families keeping stories alive.", features: ["3 companion profiles", "Memory journal", "Share with 5 family members", "Priority support"], featured: true },
  { name: "Legacy", price: "$99", per: "per year", desc: "A lasting archive for generations.", features: ["Unlimited profiles", "Printable memory book", "Grief counselor resources", "Data export & vault"] },
];

function Pricing() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center">
        <h1 className="text-5xl">Plans made with care</h1>
        <p className="mt-3 text-muted-foreground">Sample pricing for demonstration. No payment is collected.</p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className={`flex flex-col rounded-3xl p-8 shadow-soft ${p.featured ? "bg-primary text-primary-foreground" : "bg-card"}`}>
            {p.featured && <span className="mb-3 w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">Most chosen</span>}
            <h2 className="text-3xl">{p.name}</h2>
            <p className={`mt-1 text-sm ${p.featured ? "opacity-80" : "text-muted-foreground"}`}>{p.desc}</p>
            <p className="mt-6"><span className="font-display text-5xl">{p.price}</span> <span className="text-sm opacity-75">{p.per}</span></p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {p.features.map((f) => <li key={f} className="flex gap-2"><Check className="size-4 shrink-0" />{f}</li>)}
            </ul>
            <Button className="mt-8 rounded-full" variant={p.featured ? "secondary" : "default"}>Choose {p.name}</Button>
          </div>
        ))}
      </div>
    </main>
  );
}
