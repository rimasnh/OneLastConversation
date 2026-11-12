import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Upload, X, Mic, Video, ShieldCheck, Info, Heart, Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/ai_handshake.jpg.asset.json";
import sample from "@/assets/sample_companion.mp4.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OneLastConversion — A respectful AI memorial companion" },
      { name: "description", content: "Honor a loved one's memory with a gentle, boundary-respecting AI companion. Try the sample preview." },
      { property: "og:title", content: "OneLastConversion — A respectful AI memorial companion" },
      { property: "og:description", content: "Upload a photo, set boundaries, and view a sample demo preview." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const field = "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function Index() {
  const [photos, setPhotos] = useState<string[]>([]);
  const photo = photos.length > 0;
  const [allowed, setAllowed] = useState("");
  const [avoid, setAvoid] = useState("");
  const [memories, setMemories] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const photosRef = useRef<string[]>([]);
  photosRef.current = photos;
  useEffect(() => () => photosRef.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const onFiles = (list?: FileList | null) => {
    if (!list) return;
    const urls = Array.from(list).filter((f) => f.type.startsWith("image/")).map((f) => URL.createObjectURL(f));
    if (urls.length) setPhotos((p) => [...p, ...urls]);
    if (inputRef.current) inputRef.current.value = "";
  };
  const removePhoto = (url: string) => {
    URL.revokeObjectURL(url);
    setPhotos((p) => {
      const next = p.filter((u) => u !== url);
      if (!next.length) setShowPreview(false);
      return next;
    });
  };
  const removeAll = () => {
    photos.forEach((u) => URL.revokeObjectURL(u));
    setPhotos([]);
    setShowPreview(false);
  };
  const create = () => {
    setShowPreview(true);
    setTimeout(() => previewRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <main>
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
            <Heart className="size-3" /> Remembrance, with care
          </p>
          <h1 className="text-5xl leading-[1.05] text-foreground md:text-6xl">
            Keep their stories close, <em className="text-primary">gently.</em>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            OneLastConversion helps you reflect on cherished memories through a companion you shape — with boundaries you set, and privacy you control.
          </p>
          <div className="mt-8 flex gap-3">
            <Button size="lg" className="rounded-full" asChild><a href="#create">Try the demo</a></Button>
            <Button size="lg" variant="outline" className="rounded-full bg-transparent" asChild><Link to="/boundaries">See boundary settings</Link></Button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-accent/60 rotate-2" />
          <img src={hero.url} alt="A human hand and a robotic hand reaching toward each other" className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-soft" />
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
        {[
          { icon: ShieldCheck, t: "You set the boundaries", d: "Decide what may be discussed and what is off-limits." },
          { icon: Lock, t: "Private by design", d: "Your photo stays in your browser in this demo." },
          { icon: Sparkles, t: "Honest about AI", d: "Always clear it's a reflection tool, never the person." },
        ].map(({ icon: I, t, d }) => (
          <div key={t} className="rounded-2xl bg-card p-6 shadow-soft">
            <I className="size-5 text-primary" />
            <h3 className="mt-3 text-2xl">{t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>

      {/* Create */}
      <section id="create" className="mx-auto max-w-3xl scroll-mt-24 px-6 pt-24">
        <h2 className="text-center text-4xl">Create a preview</h2>
        <p className="mt-2 text-center text-muted-foreground">A few gentle steps. Nothing is sent anywhere.</p>

        <div className="mt-10 space-y-8 rounded-3xl bg-card p-6 shadow-soft md:p-10">
          <div>
            <h3 className="text-2xl">1. Upload photos</h3>
            <p className="mt-1 text-sm text-muted-foreground">Add one or more photos. One is enough to continue.</p>
            {photo && (
              <div className="mt-4 flex flex-wrap gap-3">
                {photos.map((u, i) => (
                  <div key={u} className="relative">
                    <img src={u} alt={`Uploaded photo ${i + 1}`} className="size-24 rounded-2xl object-cover" />
                    <button type="button" onClick={() => removePhoto(u)} aria-label={`Remove photo ${i + 1}`} className="absolute -right-2 -top-2 rounded-full bg-foreground p-1 text-background shadow-soft"><X className="size-3" /></button>
                  </div>
                ))}
              </div>
            )}
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
              className="mt-4 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/50 p-8 text-center text-sm text-muted-foreground hover:bg-muted"
            >
              <Upload className="size-6 text-primary" />
              {photo ? "Add more photos" : "Click or drop images here"}
              <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} />
            </label>
            {photo && <Button variant="outline" className="mt-3" onClick={removeAll}><X /> Remove all photos</Button>}
          </div>

          {[
            { icon: Mic, t: "2. Upload a voice recording" },
            { icon: Video, t: "3. Upload a video recording" },
          ].map(({ icon: I, t }) => (
            <div key={t} aria-disabled className="opacity-70">
              <h3 className="flex flex-wrap items-center gap-3 text-2xl">{t}
                <span className="rounded-full bg-accent px-3 py-0.5 font-sans text-xs text-accent-foreground">Upcoming</span>
              </h3>
              <div className="mt-4 flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/30 p-8 text-center text-sm text-muted-foreground">
                <I className="size-6" /> Coming soon — not available in this demo
              </div>
            </div>
          ))}

          <div className="space-y-4">
            <h3 className="text-2xl">4. Set boundaries</h3>
            <label className="block text-sm font-medium">What the companion may discuss
              <textarea className={`${field} mt-2`} rows={2} value={allowed} onChange={(e) => setAllowed(e.target.value)} placeholder="Family trips, favorite recipes, his love of cricket…" />
            </label>
            <label className="block text-sm font-medium">Topics to avoid
              <textarea className={`${field} mt-2`} rows={2} value={avoid} onChange={(e) => setAvoid(e.target.value)} placeholder="His illness, finances…" />
            </label>
            <label className="block text-sm font-medium">Memories or details you'd like to share
              <textarea className={`${field} mt-2`} rows={3} value={memories} onChange={(e) => setMemories(e.target.value)} placeholder="He always hummed old songs while cooking on Sundays…" />
            </label>
          </div>

          <div className="flex gap-3 rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground">
            <Lock className="mt-0.5 size-4 shrink-0" />
            <p><strong>Privacy note:</strong> Your photo and answers stay in this browser tab only. They are not uploaded, stored, or used to train anything, and are cleared when you remove the photos or close the page.</p>
          </div>

          <Button size="lg" className="w-full rounded-full" onClick={create} disabled={!photo}>
            {photo ? "Create preview" : "Upload a photo to continue"}
          </Button>
        </div>

        {showPreview && (
          <div ref={previewRef} className="mt-10 scroll-mt-24 rounded-3xl bg-card p-6 shadow-soft md:p-10">
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">Sample demo</span>
            <h3 className="mt-3 text-3xl">Sample preview</h3>
            <video src={sample.url} controls playsInline className="mt-4 w-full rounded-2xl bg-foreground" />
            <div className="mt-4 flex gap-3 rounded-2xl border border-gold/50 bg-accent/40 p-4 text-sm">
              <Info className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
              <p>This is a <strong>pre-made sample animation</strong>. It was <strong>not generated from your uploaded photo</strong> or your answers, and it does <strong>not represent real communication with the deceased</strong>.</p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
