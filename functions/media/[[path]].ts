import type { Env } from "../_lib";

// GET /media/<r2 key> — streams objects from R2 with HTTP Range support so <video> can seek.
export const onRequestGet: PagesFunction<Env, "path"> = async ({ request, params, env }) => {
  const key = (params.path as string[]).map(decodeURIComponent).join("/");
  if (!key || !env.VIDEOS) return new Response("Not found", { status: 404 });

  const object = await env.VIDEOS.get(key, {
    range: request.headers,
    onlyIf: request.headers,
  });
  if (!object) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "public, max-age=86400");

  // Conditional request matched (If-None-Match etc.) — no body returned.
  if (!("body" in object)) return new Response(null, { status: 304, headers });

  if (request.headers.has("range") && object.range) {
    const r = object.range as { offset?: number; length?: number; suffix?: number };
    const length = r.suffix ?? r.length ?? object.size - (r.offset ?? 0);
    const offset = r.suffix !== undefined ? object.size - r.suffix : (r.offset ?? 0);
    headers.set("content-range", `bytes ${offset}-${offset + length - 1}/${object.size}`);
    headers.set("content-length", String(length));
    return new Response(object.body, { status: 206, headers });
  }

  headers.set("content-length", String(object.size));
  return new Response(object.body, { headers });
};
