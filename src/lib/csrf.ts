import { randomBytes, createHmac, timingSafeEqual } from "crypto";

function resolveCsrfSecret(): string {
  const secret = process.env.CSRF_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "[YUTRO] CSRF_SECRET environment variable is not set. " +
          "Set a strong random value (≥32 bytes) before deploying to production."
      );
    }
    // Development fallback only
    return "yutro-csrf-dev-secret-change-in-prod";
  }
  return secret;
}

const SECRET = resolveCsrfSecret();

export function generateCsrfToken(): { token: string; signature: string } {
  const token = randomBytes(32).toString("hex");
  const signature = createHmac("sha256", SECRET).update(token).digest("hex");
  return { token, signature };
}

export function verifyCsrfToken(token: string, signature: string): boolean {
  const expected = createHmac("sha256", SECRET).update(token).digest();
  const actual = Buffer.from(signature, "hex");
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}
