// YUTRO Studio — Image storage via Supabase Storage
// Persists images between serverless function invocations on Vercel

const BUCKET = "studio-generations";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("WARNING: Supabase not configured, falling back to in-memory cache");
    return null;
  }
  return { url, key };
}

// In-memory fallback for local dev
const memCache = new Map<string, { data: Buffer; expires: number }>();

/**
 * Store an image — Supabase Storage in production, in-memory locally
 */
export async function cacheImage(filename: string, buffer: Buffer): Promise<void> {
  const config = getSupabaseConfig();

  if (config) {
    const res = await fetch(
      `${config.url}/storage/v1/object/${BUCKET}/${filename}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.key}`,
          apikey: config.key,
          "Content-Type": "image/png",
          "x-upsert": "true",
        },
        body: new Uint8Array(buffer),
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error(`[ImageCache] Upload failed: ${res.status} ${text}`);
      // Fall through to memory cache
    } else {
      return;
    }
  }

  // Fallback: in-memory (works locally, not across Vercel invocations)
  memCache.set(filename, { data: buffer, expires: Date.now() + 30 * 60 * 1000 });
}

/**
 * Retrieve an image — Supabase Storage in production, in-memory locally
 */
export async function getCachedImage(filename: string): Promise<Buffer | null> {
  const config = getSupabaseConfig();

  if (config) {
    const res = await fetch(
      `${config.url}/storage/v1/object/${BUCKET}/${filename}`,
      {
        headers: { Authorization: `Bearer ${config.key}`, apikey: config.key },
      }
    );

    if (res.ok) {
      return Buffer.from(await res.arrayBuffer());
    }
    // Not found in Supabase, try memory
  }

  // Fallback: in-memory
  const entry = memCache.get(filename);
  if (!entry || Date.now() > entry.expires) {
    if (entry) memCache.delete(filename);
    return null;
  }
  return entry.data;
}
