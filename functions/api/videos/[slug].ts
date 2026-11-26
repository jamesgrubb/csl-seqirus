import { json, toVideo, VIDEO_SELECT, type Env, type VideoRow } from "../../_lib";

// GET /api/videos/:slug
export const onRequestGet: PagesFunction<Env, "slug"> = async ({ params, env }) => {
  const row = await env.DB.prepare(`${VIDEO_SELECT} AND v.slug = ?1`)
    .bind(params.slug)
    .first<VideoRow>();

  if (!row) return json({ error: "Not found" }, { status: 404 });
  return json(toVideo(row));
};
