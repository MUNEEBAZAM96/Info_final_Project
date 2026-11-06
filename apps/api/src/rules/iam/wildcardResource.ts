import { readAllowStatements, type NormalizedStatement } from "../../parsers/validatePolicy";
import type { Finding, PolicyDocument } from "../types";

const ruleId = "iam-wildcard-resource";

export function findingForWildcardResource(statement: NormalizedStatement, index: number): Finding | null {
  if (!statement.Resource.includes("*") || statement.Action.includes("*")) {
    return null;
  }

  const sid = statement.Sid ?? "statement";
  return {
    id: `${ruleId}-${index + 1}`,
    ruleId,
    severity: "High",
    title: "Wildcard resource",
    evidence: `Statement Sid ${sid} uses Resource "*".`,
    impact: "s3:GetObject applies to every resource.",
    remediation: 'Replace Resource "*" with the required object ARN.',
  };
}

export function wildcardResource(policy: PolicyDocument): Finding[] {
  return readAllowStatements(policy).flatMap((statement, index) => {
    const finding = findingForWildcardResource(statement, index);
    return finding ? [finding] : [];
  });
}
