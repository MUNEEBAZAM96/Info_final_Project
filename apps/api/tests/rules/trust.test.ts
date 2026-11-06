import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { analyzePolicy } from "../../src/rules/engine";
import { broadPrincipal } from "../../src/rules/trust/broadPrincipal";

const dataset = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../dataset");

function loadPolicy(group: string, name: string) {
  return JSON.parse(readFileSync(path.join(dataset, group, `${name}.json`), "utf8"));
}

describe("trust rules", () => {
  it("returns no findings for an empty object", () => {
    const policy = {};
    expect(broadPrincipal(policy)).toEqual([]);
    expect(analyzePolicy(policy)).toEqual([]);
  });

  it("returns no findings for a restricted principal", () => {
    expect(analyzePolicy(loadPolicy("secure", "trust-restricted-principal"))).toEqual([]);
  });

  it("flags a trust policy that allows any principal", () => {
    const findings = analyzePolicy(loadPolicy("misconfigured", "trust-broad-principal"));
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      ruleId: "trust-broad-principal",
      severity: "High",
      title: "Role trust allows any principal",
      evidence: 'Statement Sid AllowAnyPrincipal uses Principal "*" and Action sts:AssumeRole.',
      remediation: "Set Principal to the specific trusted account or role ARN.",
    });
  });
});
