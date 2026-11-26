import type { SiteContent } from "../../shared/types";
import { json, type Env } from "../_lib";

// GET /api/content — all editable page copy as { key: value }
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare("SELECT key, value FROM content").all<{ key: string; value: string }>();
  const body: SiteContent = Object.fromEntries(results.map((r) => [r.key, r.value]));
  return json(body);
};
