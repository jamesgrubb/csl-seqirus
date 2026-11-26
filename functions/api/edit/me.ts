import type { Env } from "../../_lib";
import type { EditData } from "./_middleware";

// GET /api/edit/me — who is signed in (the middleware has already verified it)
export const onRequestGet: PagesFunction<Env, string, EditData> = async ({ data }) =>
  Response.json({ email: data.editor });
