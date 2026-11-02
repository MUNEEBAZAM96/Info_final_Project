import { describe, expect, it } from "vitest";
import { analyzePolicy } from "../../src/rules/engine";
import { broadPrincipal } from "../../src/rules/trust/broadPrincipal";

describe("trust rule stubs", () => {
  it("returns no findings", () => {
    const policy = {};
    expect(broadPrincipal(policy)).toEqual([]);
    expect(analyzePolicy(policy)).toEqual([]);
  });
});
