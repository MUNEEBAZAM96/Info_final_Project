import { readAllowStatements, type NormalizedStatement } from "../../parsers/validatePolicy";
import type { Finding, PolicyDocument } from "../types";

const ruleId = "trust-broad-principal";

export function findingForBroadPrincipal(statement: NormalizedStatement, index: number): Finding | null {
  if (!statement.Principal.includes("*") || !statement.Action.includes("sts:AssumeRole")) {
    return null;
  }

  const sid = statement.Sid ?? "statement";
  return {
    id: `${ruleId}-${index + 1}`,
    ruleId,
    severity: "High",
    title: "Role trust allows any principal",
    evidence: `Statement Sid ${sid} uses Principal "*" and Action sts:AssumeRole.`,
    impact: "Any principal may be allowed to assume the role.",
    remediation: "Set Principal to the specific trusted account or role ARN.",
  };
}

export function broadPrincipal(policy: PolicyDocument): Finding[] {
  return readAllowStatements(policy).flatMap((statement, index) => {
    const finding = findingForBroadPrincipal(statement, index);
    return finding ? [finding] : [];
  });
}
