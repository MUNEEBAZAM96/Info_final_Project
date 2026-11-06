import { readAllowStatements } from "../parsers/validatePolicy";
import { attachRecommendations } from "../remediation/recommendations";
import { assignSeverity } from "../scoring/severity";
import { findingForExcessive } from "./iam/excessivePrivilege";
import { findingForWildcardAction } from "./iam/wildcardAction";
import { findingForWildcardResource } from "./iam/wildcardResource";
import { findingForPublicAccess } from "./s3/publicAccess";
import { findingForBroadPrincipal } from "./trust/broadPrincipal";
import type { Finding, PolicyDocument } from "./types";

export function analyzePolicy(policy: PolicyDocument): Finding[] {
  const findings: Finding[] = [];

  readAllowStatements(policy).forEach((statement, index) => {
    const finding =
      findingForExcessive(statement, index) ??
      findingForWildcardAction(statement, index) ??
      findingForWildcardResource(statement, index) ??
      findingForBroadPrincipal(statement, index) ??
      findingForPublicAccess(statement, index);

    if (finding) {
      findings.push(finding);
    }
  });

  return assignSeverity(attachRecommendations(findings));
}
