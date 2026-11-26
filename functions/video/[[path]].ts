import type { Env } from "../_lib";

// GET /video/<file> — the hero film in public/video. Pages serves static files whole, ignoring Range,
// and Safari (iPhone especially) won't play a <video> without 206 partial responses, so answer ranges here.
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const asset = await env.ASSETS.fetch(new Request(url, { headers: { accept: request.headers.get("accept") ?? "*/*" } }));
  if (!asset.ok) return asset;

  const headers = new Headers(asset.headers);
  headers.set("accept-ranges", "bytes");
  headers.set("cache-control", "public, max-age=86400");

  const range = request.headers.get("range")?.match(/^bytes=(\d*)-(\d*)$/);
  if (!range) return new Response(asset.body, { headers });

  const body = await asset.arrayBuffer();
  const size = body.byteLength;
  let start = range[1] === "" ? size - Number(range[2]) : Number(range[1]);
  const end = range[1] === "" || range[2] === "" ? size - 1 : Math.min(Number(range[2]), size - 1);
  start = Math.max(0, start);
  if (start > end || start >= size) {
    return new Response(null, { status: 416, headers: { "content-range": `bytes */${size}` } });
  }

  headers.set("content-range", `bytes ${start}-${end}/${size}`);
  headers.set("content-length", String(end - start + 1));
  return new Response(body.slice(start, end + 1), { status: 206, headers });
};
