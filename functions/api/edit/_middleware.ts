import { getEditor } from "../../_access";
import { json, type Env } from "../../_lib";

export interface EditData extends Record<string, unknown> {
  editor: string;
}

// Every /api/edit/* request must carry a valid Cloudflare Access identity.
export const onRequest: PagesFunction<Env, string, EditData> = async (ctx) => {
  const editor = await getEditor(ctx.request, ctx.env);
  if (!editor) return json({ error: "Not signed in as an editor" }, { status: 401, headers: { "cache-control": "no-store" } });
  ctx.data.editor = editor;
  const res = await ctx.next();
  res.headers.set("cache-control", "no-store");
  return res;
};
