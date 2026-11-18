import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — OneLastConversation" },
      { name: "description", content: "Sign in to OneLastConversation to manage your memorial companion previews." },
      { property: "og:title", content: "Sign in — OneLastConversation" },
      { property: "og:description", content: "Sample sign-in options for the OneLastConversation demo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SignIn,
});

const providers = ["Continue with Google", "Continue with Apple", "Continue with Microsoft"];

function SignIn() {
  const [note, setNote] = useState("");
  const demo = () => setNote("This is a sample sign-in screen. Accounts are not active in this demo.");
  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-center text-5xl">Welcome back</h1>
      <p className="mt-3 text-center text-muted-foreground">Sign in to manage your companion previews.</p>
      <div className="mt-10 rounded-2xl border border-border bg-card p-8 shadow-soft">
        <div className="space-y-3">
          {providers.map((p) => (
            <Button key={p} variant="outline" className="w-full rounded-full" onClick={demo}>{p}</Button>
          ))}
        </div>
        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" />
        </div>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); demo(); }}>
          <label className="block text-sm">Email
            <input type="email" required placeholder="you@example.com" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2" />
          </label>
          <label className="block text-sm">Password
            <input type="password" required placeholder="••••••••" className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2" />
          </label>
          <Button type="submit" className="w-full rounded-full">Sign in</Button>
        </form>
        {note && <p role="status" className="mt-4 text-center text-sm text-muted-foreground">{note}</p>}
        <p className="mt-6 text-center text-xs text-muted-foreground">Sample demo only — no account is created and nothing is stored.</p>
      </div>
    </main>
  );
}
