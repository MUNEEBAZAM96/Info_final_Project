import type { Finding, PolicyDocument } from "../types";

export function wildcardResource(_policy: PolicyDocument): Finding[] {
  return [];
}
