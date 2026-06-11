import { describe, expect, it } from "vitest";
import { castingIdempotencyKey } from "../idempotency";

describe("castingIdempotencyKey", () => {
  it("returns stable hash for the same selection within the same minute", () => {
    // Aligned to the start of a minute so +30s stays in the same bucket.
    const tsAligned = 60_000 * 28_616_667; // exactamente al inicio de un minuto
    const a = castingIdempotencyKey(
      "samsung",
      ["YE-W07", "YE-M14"],
      ["YE-W07"],
      tsAligned
    );
    const b = castingIdempotencyKey(
      "samsung",
      ["YE-M14", "YE-W07"], // different order — should sort
      ["YE-W07"],
      tsAligned + 30_000 // same minute bucket
    );
    expect(a).toBe(b);
  });

  it("returns a different hash for different shortlists", () => {
    const ts = 1_717_000_000_000;
    const a = castingIdempotencyKey("samsung", ["YE-W07"], [], ts);
    const b = castingIdempotencyKey("samsung", ["YE-M14"], [], ts);
    expect(a).not.toBe(b);
  });

  it("returns a different hash when crossing the minute boundary", () => {
    const t1 = 1_717_000_000_000;
    const t2 = t1 + 60_000;
    const a = castingIdempotencyKey("samsung", ["YE-W07"], [], t1);
    const b = castingIdempotencyKey("samsung", ["YE-W07"], [], t2);
    expect(a).not.toBe(b);
  });

  it("differentiates exclusives", () => {
    const ts = 1_717_000_000_000;
    const a = castingIdempotencyKey("samsung", ["YE-W07"], [], ts);
    const b = castingIdempotencyKey("samsung", ["YE-W07"], ["YE-W07"], ts);
    expect(a).not.toBe(b);
  });

  it("scopes by projectSlug", () => {
    const ts = 1_717_000_000_000;
    const a = castingIdempotencyKey("samsung", ["YE-W07"], [], ts);
    const b = castingIdempotencyKey("nestle", ["YE-W07"], [], ts);
    expect(a).not.toBe(b);
  });

  it("produces a 32-char hex string", () => {
    const key = castingIdempotencyKey("samsung", ["YE-W07"], [], 0);
    expect(key).toMatch(/^[a-f0-9]{32}$/);
  });
});
