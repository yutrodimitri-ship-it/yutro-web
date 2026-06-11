import { describe, expect, it } from "vitest";
import { policyAllows } from "../access-check";

describe("policyAllows · admin bypass", () => {
  it("allows admin regardless of access row presence", () => {
    expect(
      policyAllows({ email: "a@y.cl", role: "admin" }, false)
    ).toBe(true);
    expect(
      policyAllows({ email: "a@y.cl", role: "admin" }, true)
    ).toBe(true);
  });

  it("allows admin even with empty email", () => {
    // Defensive: admin role wins even if email is unusual.
    expect(policyAllows({ email: "", role: "admin" }, false)).toBe(true);
  });
});

describe("policyAllows · client access", () => {
  it("allows client when access row exists", () => {
    expect(
      policyAllows({ email: "c@y.cl", role: "client" }, true)
    ).toBe(true);
  });

  it("denies client when access row is missing", () => {
    expect(
      policyAllows({ email: "c@y.cl", role: "client" }, false)
    ).toBe(false);
  });
});

describe("policyAllows · unknown role", () => {
  it("treats any non-admin role as a client (requires access row)", () => {
    expect(policyAllows({ email: "x@y.cl", role: "viewer" }, false)).toBe(false);
    expect(policyAllows({ email: "x@y.cl", role: "viewer" }, true)).toBe(true);
    expect(policyAllows({ email: "x@y.cl", role: "" }, true)).toBe(true);
  });
});
