import { describe, expect, it } from "vitest";
import { releaseTalent } from "../release-talent";

describe("releaseTalent · basic removal", () => {
  it("removes the talent from shortlist", () => {
    const result = releaseTalent(
      { shortlist: ["A", "B", "C"], exclusives: [] },
      "B"
    );
    expect(result.shortlist).toEqual(["A", "C"]);
    expect(result.changed).toBe(true);
  });

  it("removes the talent from exclusives if present", () => {
    const result = releaseTalent(
      { shortlist: ["A", "B"], exclusives: ["B"] },
      "B"
    );
    expect(result.shortlist).toEqual(["A"]);
    expect(result.exclusives).toEqual([]);
  });

  it("preserves shortlist order on removal", () => {
    const result = releaseTalent(
      { shortlist: ["Z", "A", "M", "B"], exclusives: [] },
      "M"
    );
    expect(result.shortlist).toEqual(["Z", "A", "B"]);
  });
});

describe("releaseTalent · castingEmptied flag", () => {
  it("flags empty when the released talent was the only one", () => {
    const result = releaseTalent(
      { shortlist: ["A"], exclusives: ["A"] },
      "A"
    );
    expect(result.castingEmptied).toBe(true);
    expect(result.shortlist).toEqual([]);
    expect(result.exclusives).toEqual([]);
  });

  it("does NOT flag empty when shortlist still has other talents", () => {
    const result = releaseTalent(
      { shortlist: ["A", "B"], exclusives: [] },
      "A"
    );
    expect(result.castingEmptied).toBe(false);
  });

  it("does NOT flag empty when the talent wasn't there (no state change)", () => {
    // Edge case: the shortlist is already empty, the talent isn't present.
    // We do not want to mark the casting as 'rejected' just because someone
    // tried to release a phantom talent — that's a no-op.
    const result = releaseTalent({ shortlist: [], exclusives: [] }, "GHOST");
    expect(result.castingEmptied).toBe(false);
    expect(result.changed).toBe(false);
  });
});

describe("releaseTalent · idempotency", () => {
  it("returns unchanged shortlist/exclusives when talent isn't present", () => {
    const result = releaseTalent(
      { shortlist: ["A", "B"], exclusives: ["A"] },
      "GHOST"
    );
    expect(result.shortlist).toEqual(["A", "B"]);
    expect(result.exclusives).toEqual(["A"]);
    expect(result.changed).toBe(false);
    expect(result.castingEmptied).toBe(false);
  });

  it("treats talent present in exclusives but missing from shortlist as no-op (data corruption guard)", () => {
    // Defensive: shouldn't happen by business rules, but if it does we don't
    // pretend a release happened.
    const result = releaseTalent(
      { shortlist: ["A"], exclusives: ["A", "B"] },
      "B"
    );
    // Shortlist unchanged because B wasn't there.
    expect(result.shortlist).toEqual(["A"]);
    expect(result.changed).toBe(false);
    // But exclusives ARE cleaned (defensive normalization).
    expect(result.exclusives).toEqual(["A"]);
  });
});

describe("releaseTalent · purity", () => {
  it("does not mutate the input arrays", () => {
    const shortlist = ["A", "B", "C"];
    const exclusives = ["A"];
    releaseTalent({ shortlist, exclusives }, "A");
    expect(shortlist).toEqual(["A", "B", "C"]);
    expect(exclusives).toEqual(["A"]);
  });
});
