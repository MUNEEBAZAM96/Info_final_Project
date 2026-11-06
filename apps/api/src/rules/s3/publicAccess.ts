import { readAllowStatements, type NormalizedStatement } from "../../parsers/validatePolicy";
import type { Finding, PolicyDocument } from "../types";

const ruleId = "s3-public-access";

export function findingForPublicAccess(statement: NormalizedStatement, index: number): Finding | null {
  if (!statement.Principal.includes("*") || !statement.Action.includes("s3:GetObject")) {
    return null;
  }

  const sid = statement.Sid ?? "statement";
  return {
    id: `${ruleId}-${index + 1}`,
    ruleId,
    severity: "Critical",
    title: "Bucket policy allows public read",
    evidence: `Statement Sid ${sid} uses Principal "*" and Action s3:GetObject.`,
    impact: "Anyone may be able to read objects covered by the resource.",
    remediation: 'Remove Principal "*" and allow only the required account or role.',
  };
}

export function publicAccess(policy: PolicyDocument): Finding[] {
  return readAllowStatements(policy).flatMap((statement, index) => {
    const finding = findingForPublicAccess(statement, index);
    return finding ? [finding] : [];
  });
}
