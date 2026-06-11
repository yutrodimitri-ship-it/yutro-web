import { describe, expect, it } from "vitest";
import { castingReducer, EMPTY_STATE } from "../casting-reducer";
import type { CastingState } from "@/types/talent";

function state(
  shortlist: string[] = [],
  exclusives: string[] = []
): CastingState {
  return { shortlist, exclusives: new Set(exclusives) };
}

describe("castingReducer · ADD", () => {
  it("appends to shortlist", () => {
    const next = castingReducer(EMPTY_STATE, { type: "ADD", code: "YE-W07" });
    expect(next.shortlist).toEqual(["YE-W07"]);
  });

  it("is idempotent — re-adding does not duplicate", () => {
    const start = state(["YE-W07"]);
    const next = castingReducer(start, { type: "ADD", code: "YE-W07" });
    expect(next.shortlist).toEqual(["YE-W07"]);
    // Returns same reference (perf)
    expect(next).toBe(start);
  });

  it("preserves order of insertion", () => {
    let s = EMPTY_STATE;
    s = castingReducer(s, { type: "ADD", code: "C" });
    s = castingReducer(s, { type: "ADD", code: "A" });
    s = castingReducer(s, { type: "ADD", code: "B" });
    expect(s.shortlist).toEqual(["C", "A", "B"]);
  });
});

describe("castingReducer · REMOVE", () => {
  it("removes from shortlist", () => {
    const start = state(["A", "B"]);
    const next = castingReducer(start, { type: "REMOVE", code: "A" });
    expect(next.shortlist).toEqual(["B"]);
  });

  it("also clears exclusives for the removed code", () => {
    const start = state(["A", "B"], ["A"]);
    const next = castingReducer(start, { type: "REMOVE", code: "A" });
    expect(next.shortlist).toEqual(["B"]);
    expect(next.exclusives.has("A")).toBe(false);
  });

  it("is idempotent — removing absent code returns same state", () => {
    const start = state(["A"]);
    const next = castingReducer(start, { type: "REMOVE", code: "Z" });
    expect(next).toBe(start);
  });
});

describe("castingReducer · TOGGLE_EXCLUSIVE", () => {
  it("requires the code to be in shortlist first", () => {
    const start = state([]);
    const next = castingReducer(start, {
      type: "TOGGLE_EXCLUSIVE",
      code: "A",
    });
    expect(next.exclusives.has("A")).toBe(false);
    expect(next).toBe(start);
  });

  it("adds when off, removes when on", () => {
    let s = state(["A"]);
    s = castingReducer(s, { type: "TOGGLE_EXCLUSIVE", code: "A" });
    expect(s.exclusives.has("A")).toBe(true);
    s = castingReducer(s, { type: "TOGGLE_EXCLUSIVE", code: "A" });
    expect(s.exclusives.has("A")).toBe(false);
  });

  it("preserves shortlist order on toggle", () => {
    const start = state(["A", "B", "C"]);
    const next = castingReducer(start, {
      type: "TOGGLE_EXCLUSIVE",
      code: "B",
    });
    expect(next.shortlist).toEqual(["A", "B", "C"]);
  });
});

describe("castingReducer · HYDRATE", () => {
  it("rebuilds state from serialized payload", () => {
    const next = castingReducer(EMPTY_STATE, {
      type: "HYDRATE",
      payload: { shortlist: ["A", "B"], exclusives: ["A"] },
    });
    expect(next.shortlist).toEqual(["A", "B"]);
    expect(next.exclusives.has("A")).toBe(true);
    expect(next.exclusives.size).toBe(1);
  });

  it("overwrites existing state (does not merge)", () => {
    const start = state(["X"], ["X"]);
    const next = castingReducer(start, {
      type: "HYDRATE",
      payload: { shortlist: ["Y"], exclusives: [] },
    });
    expect(next.shortlist).toEqual(["Y"]);
    expect(next.exclusives.size).toBe(0);
  });
});

describe("castingReducer · RESET", () => {
  it("returns empty state", () => {
    const start = state(["A", "B"], ["A"]);
    const next = castingReducer(start, { type: "RESET" });
    expect(next.shortlist).toEqual([]);
    expect(next.exclusives.size).toBe(0);
  });
});
