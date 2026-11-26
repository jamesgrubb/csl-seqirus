import type { VideoPatch } from "../../../../shared/types";
import { json, toVideo, VIDEO_SELECT, type Env, type VideoRow } from "../../../_lib";
import type { EditData } from "../_middleware";

// Editable fields → DB column. Anything else in the body is ignored.
const TEXT_FIELDS = { title: "title", summary: "summary", description: "description" } as const;

// PATCH /api/edit/videos/:slug  { title?, summary?, description?, category?, featured? }
export const onRequestPatch: PagesFunction<Env, "slug", EditData> = async ({ request, params, env, data }) => {
  const slug = params.slug as string;
  const patch = await request.json<VideoPatch>().catch(() => ({}) as VideoPatch);

  const current = await env.DB.prepare(`${VIDEO_SELECT} AND v.slug = ?1`).bind(slug).first<VideoRow>();
  if (!current) return json({ error: "Not found" }, { status: 404 });

  const stmts: D1PreparedStatement[] = [];
  const log = (field: string, oldValue: unknown, newValue: unknown) =>
    stmts.push(
      env.DB.prepare("INSERT INTO edits (editor, entity, entity_id, field, old_value, new_value) VALUES (?1, 'video', ?2, ?3, ?4, ?5)").bind(
        data.editor, slug, field, oldValue == null ? null : String(oldValue), newValue == null ? null : String(newValue),
      ),
    );

  for (const [field, column] of Object.entries(TEXT_FIELDS)) {
    const value = patch[field as keyof typeof TEXT_FIELDS];
    if (value === undefined) continue;
    if (typeof value !== "string" || (field === "title" && !value.trim()) || value.length > 5000) {
      return json({ error: `Invalid ${field}` }, { status: 400 });
    }
    stmts.push(env.DB.prepare(`UPDATE videos SET ${column} = ?2 WHERE slug = ?1`).bind(slug, value.trim()));
    log(field, current[column as keyof VideoRow], value.trim());
  }

  if (patch.category !== undefined) {
    const exists = patch.category === null || (await env.DB.prepare("SELECT 1 FROM categories WHERE slug = ?1").bind(patch.category).first());
    if (!exists) return json({ error: "Unknown category" }, { status: 400 });
    stmts.push(env.DB.prepare("UPDATE videos SET category = ?2 WHERE slug = ?1").bind(slug, patch.category));
    log("category", current.category, patch.category);
  }

  if (patch.featured !== undefined) {
    // Only one featured video: it's the one shown in the home page banner.
    if (patch.featured) stmts.push(env.DB.prepare("UPDATE videos SET featured = 0 WHERE featured = 1 AND slug != ?1").bind(slug));
    stmts.push(env.DB.prepare("UPDATE videos SET featured = ?2 WHERE slug = ?1").bind(slug, patch.featured ? 1 : 0));
    log("featured", current.featured === 1, Boolean(patch.featured));
  }

  if (stmts.length === 0) return json({ error: "Nothing to update" }, { status: 400 });
  stmts.push(env.DB.prepare("UPDATE videos SET updated_at = datetime('now'), updated_by = ?2 WHERE slug = ?1").bind(slug, data.editor));
  await env.DB.batch(stmts);

  const updated = await env.DB.prepare(`${VIDEO_SELECT} AND v.slug = ?1`).bind(slug).first<VideoRow>();
  return json(toVideo(updated!));
};
