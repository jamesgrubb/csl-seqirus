import type { Env } from "./_lib";

// Verifies the Cloudflare Access JWT (Cf-Access-Jwt-Assertion) and returns the signed-in editor's email.
// Fails closed: no token, unknown key, bad signature, wrong audience or expired → null.
// https://developers.cloudflare.com/cloudflare-one/identity/authorization-cookie/validating-json/

type AccessJwk = JsonWebKey & { kid: string };
let certCache: { team: string; at: number; keys: AccessJwk[] } | null = null;

async function getKeys(team: string, refresh = false): Promise<AccessJwk[]> {
  if (!refresh && certCache?.team === team && Date.now() - certCache.at < 3_600_000) return certCache.keys;
  const res = await fetch(`https://${team}/cdn-cgi/access/certs`);
  if (!res.ok) return [];
  const { keys } = await res.json<{ keys: AccessJwk[] }>();
  certCache = { team, at: Date.now(), keys };
  return keys;
}

const b64url = (s: string) =>
  Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(s.length / 4) * 4, "=")), (c) =>
    c.charCodeAt(0),
  );
const decodeJson = (s: string) => JSON.parse(new TextDecoder().decode(b64url(s)));

export async function getEditor(request: Request, env: Env): Promise<string | null> {
  const host = new URL(request.url).hostname;
  if (env.DEV_EDITOR_EMAIL && (host === "localhost" || host === "127.0.0.1")) return env.DEV_EDITOR_EMAIL;

  const token = request.headers.get("cf-access-jwt-assertion");
  const team = env.ACCESS_TEAM_DOMAIN;
  if (!token || !team || !env.ACCESS_AUD) return null;

  try {
    const [h, p, sig] = token.split(".");
    if (!sig) return null;
    const header = decodeJson(h) as { kid: string; alg: string };
    const payload = decodeJson(p) as { aud: string | string[]; exp: number; iss: string; email?: string };
    if (header.alg !== "RS256") return null;

    let jwk = (await getKeys(team)).find((k) => k.kid === header.kid);
    if (!jwk) jwk = (await getKeys(team, true)).find((k) => k.kid === header.kid); // key rotation
    if (!jwk) return null;

    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64url(sig), new TextEncoder().encode(`${h}.${p}`));
    if (!valid) return null;

    const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!aud.includes(env.ACCESS_AUD)) return null;
    if (payload.iss !== `https://${team}`) return null;
    if (payload.exp * 1000 < Date.now()) return null;
    return payload.email ?? null;
  } catch {
    return null;
  }
}
