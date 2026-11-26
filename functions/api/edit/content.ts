import { json, type Env } from "../../_lib";
import type { EditData } from "./_middleware";

const MAX_LENGTH = 2000;

// PUT /api/edit/content  { key, value }
export const onRequestPut: PagesFunction<Env, string, EditData> = async ({ request, env, data }) => {
  const body = await request.json<{ key?: unknown; value?: unknown }>().catch(() => ({}) as { key?: unknown; value?: unknown });
  const { key, value } = body;
  if (typeof key !== "string" || typeof value !== "string" || !value.trim() || value.length > MAX_LENGTH) {
    return json({ error: "Expected { key, value } with non-empty text" }, { status: 400 });
  }

  const existing = await env.DB.prepare("SELECT value FROM content WHERE key = ?1").bind(key).first<{ value: string }>();
  if (!existing) return json({ error: `Unknown content key: ${key}` }, { status: 404 });

  const text = value.trim();
  await env.DB.batch([
    env.DB.prepare("UPDATE content SET value = ?2, updated_at = datetime('now'), updated_by = ?3 WHERE key = ?1").bind(key, text, data.editor),
    env.DB.prepare("INSERT INTO edits (editor, entity, entity_id, field, old_value, new_value) VALUES (?1, 'content', ?2, 'value', ?3, ?4)").bind(
      data.editor, key, existing.value, text,
    ),
  ]);
  return json({ key, value: text });
};
