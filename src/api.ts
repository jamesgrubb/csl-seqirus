import type { SiteContent, Video, VideoListResponse, VideoPatch } from "../shared/types";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

const send = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});

export const fetchVideos = () => request<VideoListResponse>("/api/videos");
export const fetchVideo = (slug: string) => request<Video>(`/api/videos/${encodeURIComponent(slug)}`);
export const fetchContent = () => request<SiteContent>("/api/content");

export const fetchEditor = () => request<{ email: string }>("/api/edit/me");
export const saveContent = (key: string, value: string) =>
  request<{ key: string; value: string }>("/api/edit/content", send("PUT", { key, value }));
export const saveVideo = (slug: string, patch: VideoPatch) =>
  request<Video>(`/api/edit/videos/${encodeURIComponent(slug)}`, send("PATCH", patch));

export function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}
