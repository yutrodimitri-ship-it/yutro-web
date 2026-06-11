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

// --- Redis store (lazy singleton) ---

type RedisClient = import("ioredis").default;

let redisClient: RedisClient | null = null;

async function getRedisClient(): Promise<RedisClient> {
  if (!redisClient) {
    const { default: Redis } = await import("ioredis");
    redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
      maxRetriesPerRequest: 2,
      lazyConnect: true,
      enableOfflineQueue: false,
    });
    // Sin listener, un error de conexión se convierte en unhandled rejection
    redisClient.on("error", (err) => {
      console.error("Rate limit Redis error:", err.message);
    });
  }
  return redisClient;
}

async function checkRedisRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const client = await getRedisClient();

  const redisKey = `rl:${key}`;
  const windowSec = Math.ceil(windowMs / 1000);
  const [count, ttl] = (await client
    .multi()
    .incr(redisKey)
    .expire(redisKey, windowSec, "NX")
    .ttl(redisKey)
    .exec()
    .then((results) => [results?.[0]?.[1], results?.[2]?.[1]])) as [number, number];

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
    try {
      return await checkRedisRateLimit(key, maxRequests, windowMs);
    } catch (err) {
      // Si Redis no responde, degradar al límite en memoria en vez de tumbar la ruta
      console.error("Redis rate limit failed, falling back to memory:", err);
      return checkMemoryRateLimit(key, maxRequests, windowMs);
    }
  }
  return checkMemoryRateLimit(key, maxRequests, windowMs);
}
