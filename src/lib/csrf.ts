import { randomBytes, createHmac, timingSafeEqual } from "crypto";

function getCsrfSecret(): string {
  const secret = process.env.CSRF_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") throw new Error("CSRF_SECRET must be set");
    return "dev-csrf-secret-must-be-32-bytes!!";
  }
  return secret;
}

const SECRET = getCsrfSecret();

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
