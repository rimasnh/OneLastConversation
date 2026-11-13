// Server-only helper for the Lovable AI Gateway video endpoint.
// Never import this from browser code: it reads a secret server environment variable.

export type VideoJob = {
  id: string;
  status: "queued" | "in_progress" | "completed" | "failed";
  progress?: number;
  error?: { code?: string; message?: string };
};

export type VideoMediaPart =
  | { type: "text"; text: string }
  | { type: "image"; data: string; mime_type: string };

export type VideoCreateBody = {
  model: string;
  input: string | VideoMediaPart[];
  response_format: {
    type: "video";
    resolution: "360p" | "720p" | "1080p" | "4k";
    duration: string;
    aspect_ratio?: string;
  };
  generation_config?: Record<string, unknown>;
};

const BASE_URL = "https://ai.gateway.lovable.dev";
const MAX_DOWNLOAD_BYTES = 12_000_000;

function gatewayKey(): string {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("The AI service is not configured for this workspace yet.");
  return key;
}

async function readJob(response: Response): Promise<VideoJob> {
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? `The video request failed (${response.status}).`);
  }
  return (await response.json()) as VideoJob;
}

export async function createVideoJob(body: VideoCreateBody): Promise<VideoJob> {
  return readJob(
    await fetch(`${BASE_URL}/v1/videos`, {
      method: "POST",
      headers: { Authorization: `Bearer ${gatewayKey()}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

export async function pollVideoJob(id: string): Promise<VideoJob> {
  return readJob(
    await fetch(`${BASE_URL}/v1/videos/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${gatewayKey()}` },
    }),
  );
}

/** Downloads the finished MP4 and returns it as a base64 data URL. */
export async function downloadVideoDataUrl(id: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/v1/videos/${encodeURIComponent(id)}/content`, {
    headers: { Authorization: `Bearer ${gatewayKey()}` },
  });
  if (!response.ok || !response.body) {
    throw new Error(`The finished preview could not be downloaded (${response.status}).`);
  }
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length > MAX_DOWNLOAD_BYTES) {
    throw new Error("The finished preview is too large to show in this demo.");
  }
  let binary = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return `data:video/mp4;base64,${btoa(binary)}`;
}
