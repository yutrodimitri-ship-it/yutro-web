import { describe, expect, it } from "vitest";
import { diffAccessChanges, type AccessRow } from "../access-diff";

function row(slug: string, revokedAt: Date | null = null, id?: string): AccessRow {
  return { id: id ?? `id-${slug}`, projectSlug: slug, revokedAt };
}

describe("diffAccessChanges · no-op cases", () => {
  it("returns empty diff when existing active matches target exactly", () => {
    const existing = [row("samsung"), row("nestle")];
    const result = diffAccessChanges(existing, ["samsung", "nestle"]);
    expect(result.toCreate).toEqual([]);
    expect(result.toReactivate).toEqual([]);
    expect(result.toRevoke).toEqual([]);
  });

  it("handles empty input both sides", () => {
    const result = diffAccessChanges([], []);
    expect(result.toCreate).toEqual([]);
    expect(result.toReactivate).toEqual([]);
    expect(result.toRevoke).toEqual([]);
  });
});

describe("diffAccessChanges · create", () => {
  it("creates rows for target slugs with no existing row", () => {
    const result = diffAccessChanges([], ["samsung", "nestle"]);
    expect(result.toCreate).toEqual(["samsung", "nestle"]);
    expect(result.toReactivate).toEqual([]);
    expect(result.toRevoke).toEqual([]);
  });

  it("dedupes target slugs", () => {
    const result = diffAccessChanges([], ["samsung", "samsung", "samsung"]);
    expect(result.toCreate).toEqual(["samsung"]);
  });

  it("preserves target order when multiple new slugs are requested", () => {
    const result = diffAccessChanges([], ["c", "a", "b"]);
    expect(result.toCreate).toEqual(["c", "a", "b"]);
  });
});

describe("diffAccessChanges · reactivate", () => {
  it("reactivates a revoked row instead of creating a duplicate", () => {
    const revokedRow = row("samsung", new Date("2026-01-01"));
    const result = diffAccessChanges([revokedRow], ["samsung"]);
    expect(result.toCreate).toEqual([]);
    expect(result.toReactivate).toEqual([revokedRow]);
    expect(result.toRevoke).toEqual([]);
  });

  it("can reactivate multiple revoked rows in a single diff", () => {
    const a = row("a", new Date("2026-01-01"));
    const b = row("b", new Date("2026-01-02"));
    const result = diffAccessChanges([a, b], ["a", "b"]);
    expect(result.toReactivate).toEqual([a, b]);
  });

  it("when a slug exists both active and revoked (data quirk), trusts the first occurrence", () => {
    // Defensive: if there's a stale duplicate row in the DB, we deterministically
    // pick the first one rather than crashing.
    const activeFirst = row("samsung", null, "id-active");
    const revokedSecond = row("samsung", new Date("2026-01-01"), "id-revoked");
    const result = diffAccessChanges([activeFirst, revokedSecond], ["samsung"]);
    expect(result.toReactivate).toEqual([]);
    expect(result.toRevoke).toEqual([]);
    expect(result.toCreate).toEqual([]);
  });
});

describe("diffAccessChanges · revoke", () => {
  it("revokes active slugs that are not in target", () => {
    const result = diffAccessChanges(
      [row("samsung"), row("nestle")],
      ["samsung"]
    );
    expect(result.toRevoke).toEqual(["nestle"]);
  });

  it("does NOT revoke already-revoked rows", () => {
    const result = diffAccessChanges(
      [row("samsung"), row("nestle", new Date("2026-01-01"))],
      ["samsung"]
    );
    // nestle is already revoked, so no double-revoke
    expect(result.toRevoke).toEqual([]);
  });

  it("revokes everything when target is empty", () => {
    const result = diffAccessChanges(
      [row("a"), row("b"), row("c")],
      []
    );
    expect(new Set(result.toRevoke)).toEqual(new Set(["a", "b", "c"]));
  });
});

describe("diffAccessChanges · combined operations", () => {
  it("partitions correctly: create + reactivate + revoke in one diff", () => {
    const revoked = row("oldRevoked", new Date("2026-01-01"));
    const stayActive = row("stayActive");
    const willRevoke = row("willRevoke");
    const result = diffAccessChanges(
      [revoked, stayActive, willRevoke],
      ["oldRevoked", "stayActive", "brandNew"]
    );
    expect(result.toReactivate).toEqual([revoked]);
    expect(result.toCreate).toEqual(["brandNew"]);
    expect(result.toRevoke).toEqual(["willRevoke"]);
  });

  it("never places the same slug in two buckets", () => {
    const result = diffAccessChanges(
      [row("a"), row("b", new Date("2026-01-01"))],
      ["b", "c"]
    );
    const allSlugs = [
      ...result.toCreate,
      ...result.toReactivate.map((r) => r.projectSlug),
      ...result.toRevoke,
    ];
    const unique = new Set(allSlugs);
    expect(allSlugs.length).toBe(unique.size);
  });
});

describe("diffAccessChanges · purity", () => {
  it("does not mutate the existing array or its rows", () => {
    const r1 = row("a");
    const r2 = row("b", new Date("2026-01-01"));
    const existing = [r1, r2];
    diffAccessChanges(existing, ["a", "c"]);
    expect(existing).toEqual([r1, r2]);
    expect(r2.revokedAt).toEqual(new Date("2026-01-01"));
  });
});
