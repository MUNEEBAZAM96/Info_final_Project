import type { Finding, PolicyDocument } from "./types";
import { excessivePrivilege } from "./iam/excessivePrivilege";
import { wildcardAction } from "./iam/wildcardAction";
import { wildcardResource } from "./iam/wildcardResource";
import { publicAccess } from "./s3/publicAccess";
import { broadPrincipal } from "./trust/broadPrincipal";

export function analyzePolicy(policy: PolicyDocument): Finding[] {
  return [
    ...wildcardAction(policy),
    ...wildcardResource(policy),
    ...excessivePrivilege(policy),
    ...broadPrincipal(policy),
    ...publicAccess(policy),
  ];
}
