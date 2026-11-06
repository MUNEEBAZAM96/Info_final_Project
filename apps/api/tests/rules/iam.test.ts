import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { validatePolicy } from "../../src/parsers/validatePolicy";
import { analyzePolicy } from "../../src/rules/engine";
import { excessivePrivilege } from "../../src/rules/iam/excessivePrivilege";
import { wildcardAction } from "../../src/rules/iam/wildcardAction";
import { wildcardResource } from "../../src/rules/iam/wildcardResource";

const dataset = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../dataset");

function loadPolicy(group: string, name: string) {
  return JSON.parse(readFileSync(path.join(dataset, group, `${name}.json`), "utf8"));
}

describe("iam rules", () => {
  it("returns no findings for an empty object", () => {
    const policy = {};
    expect(wildcardAction(policy)).toEqual([]);
    expect(wildcardResource(policy)).toEqual([]);
    expect(excessivePrivilege(policy)).toEqual([]);
    expect(analyzePolicy(policy)).toEqual([]);
  });

  it("returns no findings for least privilege", () => {
    expect(analyzePolicy(loadPolicy("secure", "iam-least-privilege"))).toEqual([]);
  });

  it("flags a wildcard action once", () => {
    const findings = analyzePolicy(loadPolicy("misconfigured", "iam-wildcard-action"));
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      ruleId: "iam-wildcard-action",
      severity: "High",
      title: "Wildcard action",
      evidence: 'Statement Sid AllowAllActions uses Action "*".',
      impact: "The statement allows every action on one object.",
    });
  });

  it("flags a wildcard resource once", () => {
    const findings = analyzePolicy(loadPolicy("misconfigured", "iam-wildcard-resource"));
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      severity: "High",
      title: "Wildcard resource",
    });
  });

  it("flags administrator access once and skips the wildcard rules", () => {
    const policy = loadPolicy("misconfigured", "iam-excessive-privilege");
    const findings = analyzePolicy(policy);
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      severity: "Critical",
      title: "Administrator-style permission",
      remediation: "Replace both wildcards with the required actions and resource ARNs.",
    });
    expect(wildcardAction(policy)).toEqual([]);
    expect(wildcardResource(policy)).toEqual([]);
  });

  it("rejects malformed input and accepts the dataset policies", () => {
    expect(() => JSON.parse(readFileSync(path.join(dataset, "invalid", "malformed.json"), "utf8"))).toThrow();
    expect(() => validatePolicy(null)).toThrow();
    expect(() => validatePolicy([])).toThrow();
    expect(() => validatePolicy("policy")).toThrow();

    for (const [group, name] of [
      ["secure", "iam-least-privilege"],
      ["secure", "trust-restricted-principal"],
      ["secure", "s3-private-bucket"],
      ["misconfigured", "iam-wildcard-action"],
      ["misconfigured", "iam-wildcard-resource"],
      ["misconfigured", "iam-excessive-privilege"],
      ["misconfigured", "trust-broad-principal"],
      ["misconfigured", "s3-public-access"],
    ] as const) {
      expect(validatePolicy(loadPolicy(group, name)).Statement.length).toBeGreaterThan(0);
    }
  });
});
