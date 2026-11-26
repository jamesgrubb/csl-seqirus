import type { Category, VideoListResponse } from "../../../shared/types";
import { json, toVideo, VIDEO_SELECT, type Env, type VideoRow } from "../../_lib";

// GET /api/videos?category=science
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const category = new URL(request.url).searchParams.get("category");

  const [videos, categories] = await env.DB.batch<VideoRow | Category>([
    env.DB.prepare(`${VIDEO_SELECT} AND (?1 IS NULL OR v.category = ?1)
                    ORDER BY v.featured DESC, v.created_at DESC, v.id DESC`).bind(category),
    env.DB.prepare(`SELECT slug, name FROM categories ORDER BY sort_order, name`),
  ]);

  const body: VideoListResponse = {
    videos: (videos.results as VideoRow[]).map(toVideo),
    categories: categories.results as Category[],
  };
  return json(body);
};
