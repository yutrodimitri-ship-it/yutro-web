// --- In-memory store ---

const memoryMap = new Map<string, { count: number; resetTime: number }>();

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of memoryMap) {
    if (now > value.resetTime) memoryMap.delete(key);
  }
}, 60_000);

function checkMemoryRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = memoryMap.get(key);

  if (!entry || now > entry.resetTime) {
    memoryMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  entry.count++;
  const remaining = Math.max(0, maxRequests - entry.count);
  return { allowed: entry.count <= maxRequests, remaining, resetIn: entry.resetTime - now };
}

// --- Redis store (lazy) ---

async function checkRedisRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const { default: Redis } = await import("ioredis");
  const client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

  const redisKey = `rl:${key}`;
  const windowSec = Math.ceil(windowMs / 1000);
  const count = await client.incr(redisKey);
  if (count === 1) await client.expire(redisKey, windowSec);
  const ttl = await client.ttl(redisKey);

  return {
    allowed: count <= maxRequests,
    remaining: Math.max(0, maxRequests - count),
    resetIn: ttl > 0 ? ttl * 1000 : windowMs,
  };
}

// --- Public API ---

export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  if (process.env.RATE_LIMIT_STORE === "redis") {
    return checkRedisRateLimit(key, maxRequests, windowMs);
  }
  return checkMemoryRateLimit(key, maxRequests, windowMs);
}
