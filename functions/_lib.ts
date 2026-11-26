import type { Video } from "../shared/types";

export interface Env {
  DB: D1Database;
  /** The site's static files (Pages binds this automatically). */
  ASSETS: Fetcher;
  VIDEOS?: R2Bucket; // optional until the R2 bucket is bound in wrangler.toml
  /** Cloudflare Access team domain, e.g. "csl-video.cloudflareaccess.com". Empty = editing disabled. */
  ACCESS_TEAM_DOMAIN?: string;
  /** Application Audience (AUD) tag of the Access application protecting /edit and /api/edit. */
  ACCESS_AUD?: string;
  /** Local dev only (.dev.vars): treat requests to localhost as this editor. */
  DEV_EDITOR_EMAIL?: string;
}

export interface VideoRow {
  id: number;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string | null;
  category_name: string | null;
  video_key: string;
  poster_key: string | null;
  duration_seconds: number | null;
  featured: number;
  created_at: string;
}

export const VIDEO_SELECT = `
  SELECT v.id, v.slug, v.title, v.summary, v.description, v.category, c.name AS category_name,
         v.video_key, v.poster_key, v.duration_seconds, v.featured, v.created_at
  FROM videos v LEFT JOIN categories c ON c.slug = v.category
  WHERE v.published = 1`;

const mediaUrl = (key: string) => `/media/${key.split("/").map(encodeURIComponent).join("/")}`;

export function toVideo(row: VideoRow): Video {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description,
    category: row.category,
    categoryName: row.category_name,
    videoUrl: mediaUrl(row.video_key),
    posterUrl: row.poster_key ? mediaUrl(row.poster_key) : null,
    durationSeconds: row.duration_seconds,
    featured: row.featured === 1,
    createdAt: row.created_at,
  };
}

export const json = (data: unknown, init: ResponseInit = {}) =>
  Response.json(data, {
    ...init,
    headers: { "cache-control": "no-cache", ...init.headers }, // edits must show up immediately
  });
