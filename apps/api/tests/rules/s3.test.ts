import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { analyzePolicy } from "../../src/rules/engine";
import { publicAccess } from "../../src/rules/s3/publicAccess";

const dataset = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../dataset");

function loadPolicy(group: string, name: string) {
  return JSON.parse(readFileSync(path.join(dataset, group, `${name}.json`), "utf8"));
}

describe("s3 rules", () => {
  it("returns no findings for an empty object", () => {
    const policy = {};
    expect(publicAccess(policy)).toEqual([]);
    expect(analyzePolicy(policy)).toEqual([]);
  });

  it("returns no findings for a private bucket policy", () => {
    expect(analyzePolicy(loadPolicy("secure", "s3-private-bucket"))).toEqual([]);
  });

  it("flags a bucket policy that allows public read", () => {
    const findings = analyzePolicy(loadPolicy("misconfigured", "s3-public-access"));
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({
      ruleId: "s3-public-access",
      severity: "Critical",
      title: "Bucket policy allows public read",
      evidence: 'Statement Sid AllowPublicRead uses Principal "*" and Action s3:GetObject.',
      remediation: 'Remove Principal "*" and allow only the required account or role.',
    });
  });
});
