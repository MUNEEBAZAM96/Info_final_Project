import { describe, expect, it } from "vitest";
import { analyzePolicy } from "../../src/rules/engine";
import { excessivePrivilege } from "../../src/rules/iam/excessivePrivilege";
import { wildcardAction } from "../../src/rules/iam/wildcardAction";
import { wildcardResource } from "../../src/rules/iam/wildcardResource";

describe("iam rule stubs", () => {
  it("returns no findings", () => {
    const policy = {};
    expect(wildcardAction(policy)).toEqual([]);
    expect(wildcardResource(policy)).toEqual([]);
    expect(excessivePrivilege(policy)).toEqual([]);
    expect(analyzePolicy(policy)).toEqual([]);
  });
});
