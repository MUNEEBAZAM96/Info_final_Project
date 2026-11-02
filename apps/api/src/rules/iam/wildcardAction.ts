import type { Finding, PolicyDocument } from "../types";

export function wildcardAction(_policy: PolicyDocument): Finding[] {
  return [];
}
