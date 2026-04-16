// YUTRO Studio — In-memory image cache with TTL
// Stores generated images between pipeline steps
// Note: Does not persist across Vercel cold starts — migrate to Supabase Storage if needed

const DEFAULT_TTL_MS = 30 * 60 * 1000; // 30 minutes

interface CacheEntry {
  data: Buffer;
  expires: number;
}

const cache = new Map<string, CacheEntry>();

/**
 * Store an image in the cache
 */
export function cacheImage(
  filename: string,
  buffer: Buffer,
  ttlMs = DEFAULT_TTL_MS
): void {
  cache.set(filename, { data: buffer, expires: Date.now() + ttlMs });
}

/**
 * Retrieve an image from the cache
 * Returns null if not found or expired
 */
export function getCachedImage(filename: string): Buffer | null {
  const entry = cache.get(filename);
  if (!entry) return null;

  if (Date.now() > entry.expires) {
    cache.delete(filename);
    return null;
  }

  return entry.data;
}

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of cache) {
    if (now > entry.expires) cache.delete(key);
  }
}, 5 * 60 * 1000);
