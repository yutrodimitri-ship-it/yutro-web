import { randomBytes, createHmac, timingSafeEqual } from "crypto";

// Lazy: se evalúa por request, no al importar, para que `next build`
// no falle si CSRF_SECRET solo existe como variable de runtime.
function getCsrfSecret(): string {
  const secret = process.env.CSRF_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("CSRF_SECRET must be set in production");
  }
  return "yutro-csrf-dev-secret";
}

export function generateCsrfToken(): { token: string; signature: string } {
  const token = randomBytes(32).toString("hex");
  const signature = createHmac("sha256", getCsrfSecret()).update(token).digest("hex");
  return { token, signature };
}

export function verifyCsrfToken(token: string, signature: string): boolean {
  const expected = createHmac("sha256", getCsrfSecret()).update(token).digest();
  const actual = Buffer.from(signature, "hex");
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}
