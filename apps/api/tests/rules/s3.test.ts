import { describe, expect, it } from "vitest";
import { publicAccess } from "../../src/rules/s3/publicAccess";
import { analyzePolicy } from "../../src/rules/engine";

describe("s3 rule stubs", () => {
  it("returns no findings", () => {
    const policy = {};
    expect(publicAccess(policy)).toEqual([]);
    expect(analyzePolicy(policy)).toEqual([]);
  });
});
