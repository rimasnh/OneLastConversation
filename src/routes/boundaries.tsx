import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Heart, Camera, Ban, BookOpen, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/boundaries")({
  head: () => ({
    meta: [
      { title: "Boundary Settings — OneLastConversation" },
      { name: "description", content: "Sample boundary settings for a memorial companion: allowed topics, topics to avoid, and shared memories." },
      { property: "og:title", content: "Boundary Settings — OneLastConversation" },
      { property: "og:description", content: "Sample boundaries, guidelines, and honesty notes for the memorial companion demo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Boundaries,
});

const sampleAllowed = [
  "Family trips to the lake house",
  "His favorite recipes and Sunday cooking",
  "Stories about his cricket days",
  "Music he loved and songs he hummed",
];

const sampleAvoid = [
  "His illness and final days",
  "Finances and legal matters",
  "Family disagreements",
];

const sampleMemories = [
  "He always hummed old songs while cooking on Sundays.",
  "He never missed a morning walk, rain or shine.",
  "He called every grandchild on their birthday, without fail.",
];

function Boundaries() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-center text-5xl">Boundary settings</h1>
      <p className="mt-3 text-center text-muted-foreground">
        Sample boundaries below show how a companion profile is shaped. You set your own when creating a preview.
      </p>

      {/* Honesty note */}
      <div className="mt-12 flex gap-4 rounded-3xl bg-secondary p-6 text-secondary-foreground">
        <Heart className="mt-1 size-6 shrink-0" />
        <div>
          <h2 className="text-2xl">An AI companion — with honesty</h2>
          <p className="mt-2 text-sm leading-relaxed">
            OneLastConversation is an <strong>AI companion</strong>. It is <strong>not the person who died</strong> and
            it is <strong>not grief therapy</strong>. It is a reflection tool for remembering, and it can never
            replace professional support or real human connection.
          </p>
          <p className="mt-2 text-sm leading-relaxed">
            Memorial companions <strong>cannot be published publicly</strong> and <strong>cannot be used
            romantically</strong>. They exist for private remembrance only.
          </p>
        </div>
      </div>

      {/* Sample data */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-card p-6 shadow-soft">
          <MessageCircle className="size-5 text-primary" />
          <h3 className="mt-3 text-2xl">May discuss</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {sampleAllowed.map((t) => <li key={t}>• {t}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-soft">
          <Ban className="size-5 text-primary" />
          <h3 className="mt-3 text-2xl">Topics to avoid</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {sampleAvoid.map((t) => <li key={t}>• {t}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-soft">
          <BookOpen className="size-5 text-primary" />
          <h3 className="mt-3 text-2xl">Shared memories</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {sampleMemories.map((t) => <li key={t}>• {t}</li>)}
          </ul>
        </div>
      </div>

      {/* Photo guidelines */}
      <div className="mt-10 flex gap-4 rounded-3xl border border-gold/50 bg-accent/40 p-6">
        <Camera className="mt-1 size-6 shrink-0 text-accent-foreground" />
        <div>
          <h2 className="text-2xl">Photo guidelines</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We are <strong>strict about photo guidelines</strong>. Photos containing vulgarity, obscenity, or
            inappropriate content are not allowed. Accounts that violate these guidelines <strong>may be
            blocked</strong>. Please upload respectful photos that honor your loved one's memory.
          </p>
        </div>
      </div>

      <div className="mt-10 flex gap-3 rounded-2xl bg-card p-5 text-sm text-muted-foreground shadow-soft">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>These are sample boundaries for demonstration. In the full product, your rules would guide every response the companion gives.</p>
      </div>
    </main>
  );
}
