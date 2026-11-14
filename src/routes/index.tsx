import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Upload, X, Mic, Video, ShieldCheck, Info, Heart, Lock, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/ai_handshake.jpg.asset.json";
import sample from "@/assets/sample_companion.mp4.asset.json";
import { getCompanionVideo, startCompanionVideo } from "@/lib/companion-video.functions";

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
const MAX_POLLS = 40;
const POLL_MS = 5000;

type Photo = { url: string; file: File };

type Gen =
  | { phase: "idle" }
  | { phase: "starting" }
  | { phase: "generating"; progress: number }
  | { phase: "done"; url: string }
  | { phase: "failed"; message: string };

/** Shrinks a photo in the browser and returns base64 JPEG for the video service. */
async function fileToJpegBase64(file: File, max = 1024): Promise<{ base64: string; mimeType: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Your browser could not read that photo.");
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
  const base64 = dataUrl.split(",")[1] ?? "";
  if (!base64) throw new Error("Your browser could not read that photo.");
  return { base64, mimeType: "image/jpeg" };
}

function dataUrlToBlobUrl(dataUrl: string): string {
  const [head, b64] = dataUrl.split(",");
  if (!head || !b64) throw new Error("The finished preview could not be shown.");
  const mime = head.match(/:(.*?);/)?.[1] ?? "video/mp4";
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return URL.createObjectURL(new Blob([bytes], { type: mime }));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function Index() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [allowed, setAllowed] = useState("");
  const [avoid, setAvoid] = useState("");
  const [memories, setMemories] = useState("");
  const [gen, setGen] = useState<Gen>({ phase: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);
  const cancelRef = useRef(false);
  const blobUrlRef = useRef<string | null>(null);
  const photosRef = useRef<Photo[]>([]);
  photosRef.current = photos;

  useEffect(
    () => () => {
      cancelRef.current = true;
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.url));
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    },
    [],
  );

  const photo = photos.length > 0;
  const busy = gen.phase === "starting" || gen.phase === "generating";

  const onFiles = (list?: FileList | null) => {
    if (!list) return;
    const next = Array.from(list)
      .filter((f) => f.type.startsWith("image/"))
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    if (next.length) setPhotos((p) => [...p, ...next]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removePhoto = (url: string) => {
    URL.revokeObjectURL(url);
    setPhotos((p) => {
      const next = p.filter((x) => x.url !== url);
      if (!next.length) {
        cancelRef.current = true;
        busyRef.current = false;
        setGen({ phase: "idle" });
      }
      return next;
    });
  };

  const removeAll = () => {
    cancelRef.current = true;
    busyRef.current = false;
    photos.forEach((p) => URL.revokeObjectURL(p.url));
    setPhotos([]);
    setGen({ phase: "idle" });
  };

  const create = async () => {
    if (!photo || busyRef.current) return;
    busyRef.current = true;
    cancelRef.current = false;
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setGen({ phase: "starting" });
    setTimeout(() => previewRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    try {
      const first = photos[0];
      if (!first) throw new Error("A photo is needed to create the preview.");
      const { base64, mimeType } = await fileToJpegBase64(first.file);
      const job = await startCompanionVideo({ data: { imageBase64: base64, mimeType, allowed, avoid, memories } });
      setGen({ phase: "generating", progress: job.progress ?? 0 });

      for (let i = 0; i < MAX_POLLS; i += 1) {
        await sleep(POLL_MS);
        if (cancelRef.current) return;
        const res = await getCompanionVideo({ data: { id: job.id } });
        if (cancelRef.current) return;
        if (res.status === "completed") {
          const url = dataUrlToBlobUrl(res.videoDataUrl);
          blobUrlRef.current = url;
          setGen({ phase: "done", url });
          return;
        }
        if (res.status === "failed") {
          setGen({ phase: "failed", message: res.message });
          return;
        }
        setGen({ phase: "generating", progress: res.progress });
      }
      setGen({ phase: "failed", message: "This preview took longer than expected. Please try again." });
    } catch (err) {
      if (!cancelRef.current) {
        setGen({ phase: "failed", message: err instanceof Error ? err.message : "Something went wrong." });
      }
    } finally {
      busyRef.current = false;
    }
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
            <Button size="lg" variant="outline" className="rounded-full bg-transparent" asChild><Link to="/boundaries">Set the boundaries</Link></Button>
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
          { icon: Lock, t: "Private by design", d: "Your photo is used only to make your preview, and is not stored." },
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
        <p className="mt-2 text-center text-muted-foreground">A few gentle steps, then a short AI-generated clip.</p>

        <div className="mt-10 space-y-8 rounded-3xl bg-card p-6 shadow-soft md:p-10">
          <div>
            <h3 className="text-2xl">1. Upload photos</h3>
            <p className="mt-1 text-sm text-muted-foreground">Add one or more photos. One is enough to continue. The first photo is used for the preview clip.</p>
            {photo && (
              <div className="mt-4 flex flex-wrap gap-3">
                {photos.map((p, i) => (
                  <div key={p.url} className="relative">
                    <img src={p.url} alt={`Uploaded photo ${i + 1}`} className="size-24 rounded-2xl object-cover" />
                    <button type="button" onClick={() => removePhoto(p.url)} aria-label={`Remove photo ${i + 1}`} className="absolute -right-2 -top-2 rounded-full bg-foreground p-1 text-background shadow-soft"><X className="size-3" /></button>
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
            <p><strong>Privacy note:</strong> Your photo and answers are sent only to create this preview clip. They are not stored on our servers, not used to train anything, and are cleared from this tab when you remove the photos or close the page.</p>
          </div>

          <Button size="lg" className="w-full rounded-full" onClick={create} disabled={!photo || busy}>
            {busy ? <><Loader2 className="size-4 animate-spin" /> Creating your preview…</> : photo ? "Create preview" : "Upload a photo to continue"}
          </Button>
        </div>

        {gen.phase !== "idle" && (
          <div ref={previewRef} className="mt-10 scroll-mt-24 rounded-3xl bg-card p-6 shadow-soft md:p-10">
            {gen.phase === "starting" && (
              <>
                <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">Preparing</span>
                <h3 className="mt-3 text-3xl">Getting your preview ready</h3>
                <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Reading your photo and writing the scene…</p>
              </>
            )}

            {gen.phase === "generating" && (
              <>
                <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">Generating</span>
                <h3 className="mt-3 text-3xl">Filming your preview</h3>
                <p className="mt-2 text-sm text-muted-foreground">This usually takes a minute or two. You can keep reading while it renders.</p>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${Math.max(6, Math.round(gen.progress * 100))}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{Math.max(6, Math.round(gen.progress * 100))}%</p>
              </>
            )}

            {gen.phase === "done" && (
              <>
                <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">AI-generated preview</span>
                <h3 className="mt-3 text-3xl">Your preview</h3>
                <video src={gen.url} controls playsInline className="mt-4 w-full rounded-2xl bg-foreground" />
                <div className="mt-4 flex gap-3 rounded-2xl border border-gold/50 bg-accent/40 p-4 text-sm">
                  <Info className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
                  <p>This short clip was <strong>generated by an AI video model from your photo</strong>. It is a <strong>reflection tool</strong> — it is <strong>not the person who died</strong>, it does <strong>not represent real communication with them</strong>, and it is <strong>not grief therapy</strong>.</p>
                </div>
                {(allowed || avoid || memories) && (
                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                    <div className="rounded-2xl bg-secondary p-4"><p className="text-xs font-semibold uppercase tracking-wide text-secondary-foreground">May discuss</p><p className="mt-1 text-muted-foreground">{allowed || "—"}</p></div>
                    <div className="rounded-2xl bg-secondary p-4"><p className="text-xs font-semibold uppercase tracking-wide text-secondary-foreground">Topics to avoid</p><p className="mt-1 text-muted-foreground">{avoid || "—"}</p></div>
                    <div className="rounded-2xl bg-secondary p-4"><p className="text-xs font-semibold uppercase tracking-wide text-secondary-foreground">Shared memories</p><p className="mt-1 text-muted-foreground">{memories || "—"}</p></div>
                  </div>
                )}
              </>
            )}

            {gen.phase === "failed" && (
              <>
                <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">Sample demo</span>
                <h3 className="mt-3 text-3xl">Sample preview</h3>
                <p className="mt-2 text-sm text-muted-foreground">Your clip could not be made: {gen.message} So this pre-made sample animation is shown instead.</p>
                <video src={sample.url} controls playsInline className="mt-4 w-full rounded-2xl bg-foreground" />
                <div className="mt-4 flex gap-3 rounded-2xl border border-gold/50 bg-accent/40 p-4 text-sm">
                  <Info className="mt-0.5 size-4 shrink-0 text-accent-foreground" />
                  <p>This is a <strong>pre-made sample animation</strong>. It was <strong>not generated from your uploaded photo</strong> or your answers, and it does <strong>not represent real communication with the deceased</strong>.</p>
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
