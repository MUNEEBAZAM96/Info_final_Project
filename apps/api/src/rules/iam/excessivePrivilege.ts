import { readAllowStatements, type NormalizedStatement } from "../../parsers/validatePolicy";
import type { Finding, PolicyDocument } from "../types";

const ruleId = "iam-excessive-privilege";

export function findingForExcessive(statement: NormalizedStatement, index: number): Finding | null {
  if (!statement.Action.includes("*") || !statement.Resource.includes("*")) {
    return null;
  }

  const sid = statement.Sid ?? "statement";
  return {
    id: `${ruleId}-${index + 1}`,
    ruleId,
    severity: "Critical",
    title: "Administrator-style permission",
    evidence: `Statement Sid ${sid} uses Action "*" and Resource "*".`,
    impact: "The statement grants every action on every resource.",
    remediation: "Replace both wildcards with the required actions and resource ARNs.",
  };
}

export function excessivePrivilege(policy: PolicyDocument): Finding[] {
  return readAllowStatements(policy).flatMap((statement, index) => {
    const finding = findingForExcessive(statement, index);
    return finding ? [finding] : [];
  });
}
