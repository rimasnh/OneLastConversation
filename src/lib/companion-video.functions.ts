import { createServerFn } from "@tanstack/react-start";
import {
  createVideoJob,
  downloadVideoDataUrl,
  pollVideoJob,
  type VideoCreateBody,
} from "@/lib/video-jobs";

const MODEL = "google/gemini-omni-1.1-flash";

type StartInput = {
  imageBase64: string;
  mimeType: string;
  allowed: string;
  avoid: string;
  memories: string;
};

/** Trims and flattens free text so it cannot smuggle instructions or markup into the prompt. */
function clean(text: string, max: number): string {
  return text
    .replace(/[<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function buildPrompt(input: StartInput): string {
  const mood = clean(input.memories, 220);
  const topics = clean(input.allowed, 160);
  const lines = [
    "A single continuous shot, no scene cuts.",
    "The uploaded photograph opens the clip and stays the clear subject.",
    "Camera: a very slow, gentle push-in. The person's face, hair, and clothing stay unchanged; they do not talk, their lips do not move, and they do not blink.",
    "Light: warm morning light drifts slowly across the frame, soft dust motes floating in the air, a calm and tender mood.",
    "Background: a quiet room with a vase of white flowers softly out of focus behind the photograph.",
  ];
  if (mood) lines.push(`The feeling of the scene is shaped by this memory: ${mood}`);
  if (topics) lines.push(`The warmth of the scene may hint at these subjects: ${topics}`);
  lines.push(
    "Audio: a soft, slow piano note and quiet room tone. No dialogue, no voices.",
    "No caption, no on-screen text, no watermark.",
    "Ends on a still, held hero shot of the photograph.",
  );
  return lines.join(" ");
}

export const startCompanionVideo = createServerFn({ method: "POST" })
  .inputValidator((input: StartInput) => input)
  .handler(async ({ data }) => {
    if (!data.imageBase64 || !data.mimeType) {
      throw new Error("A photo is needed to create the preview.");
    }
    const body: VideoCreateBody = {
      model: MODEL,
      input: [
        { type: "text", text: buildPrompt(data) },
        { type: "image", data: data.imageBase64, mime_type: data.mimeType },
      ],
      response_format: { type: "video", resolution: "720p", duration: "5s" },
      generation_config: { video_config: { task: "image_to_video" }, thinking_level: "low" },
    };
    const job = await createVideoJob(body);
    return { id: job.id, status: job.status, progress: job.progress ?? 0 };
  });

export type PreviewStatus =
  | { status: "queued" | "in_progress"; progress: number }
  | { status: "completed"; videoDataUrl: string }
  | { status: "failed"; message: string };

export const getCompanionVideo = createServerFn({ method: "POST" })
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data }): Promise<PreviewStatus> => {
    const job = await pollVideoJob(data.id);
    if (job.status === "completed") {
      return { status: "completed", videoDataUrl: await downloadVideoDataUrl(job.id) };
    }
    if (job.status === "failed") {
      const code = job.error?.code === "moderation_blocked" ? " The photo or text may have been blocked by safety filters." : "";
      return { status: "failed", message: `${job.error?.message ?? "Generation failed."}${code}` };
    }
    return { status: job.status, progress: job.progress ?? 0 };
  });
