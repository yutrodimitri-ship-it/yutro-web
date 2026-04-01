import { randomBytes, createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.CSRF_SECRET || "yutro-csrf-dev-secret-change-in-prod";

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
