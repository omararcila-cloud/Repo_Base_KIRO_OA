import { describe, it, expect } from "vitest";
import fc from "fast-check";

describe("Test infrastructure", () => {
  it("should run a basic vitest assertion", () => {
    expect(1 + 1).toBe(2);
  });

  it("should run a fast-check property test", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        expect(a + b).toBe(b + a);
      })
    );
  });
});
