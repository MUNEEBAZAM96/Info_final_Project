import { readAllowStatements, type NormalizedStatement } from "../../parsers/validatePolicy";
import type { Finding, PolicyDocument } from "../types";

const ruleId = "iam-wildcard-action";

export function findingForWildcardAction(statement: NormalizedStatement, index: number): Finding | null {
  if (!statement.Action.includes("*") || statement.Resource.includes("*")) {
    return null;
  }

  const sid = statement.Sid ?? "statement";
  return {
    id: `${ruleId}-${index + 1}`,
    ruleId,
    severity: "High",
    title: "Wildcard action",
    evidence: `Statement Sid ${sid} uses Action "*".`,
    impact: "The statement allows every action on one object.",
    remediation: 'Replace Action "*" with the specific action the workload needs, such as s3:GetObject.',
  };
}

export function wildcardAction(policy: PolicyDocument): Finding[] {
  return readAllowStatements(policy).flatMap((statement, index) => {
    const finding = findingForWildcardAction(statement, index);
    return finding ? [finding] : [];
  });
}
