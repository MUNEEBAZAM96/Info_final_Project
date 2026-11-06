import { readAllowStatements } from "../parsers/validatePolicy";
import type { PolicyDocument } from "../rules/types";
import { emptyAccessGraph, type AccessGraph } from "./model";

export function buildGraph(policy?: PolicyDocument): AccessGraph {
  const statement = policy ? readAllowStatements(policy)[0] : undefined;
  if (!statement) {
    return emptyAccessGraph();
  }

  const action = statement.Action[0] ?? "*";
  const resource = statement.Resource[0] ?? "*";

  return {
    identities: [{ id: "identity", name: "Sample identity" }],
    roles: [{ id: "role", name: "Sample role" }],
    permissions: [{ id: "permission", action, resource }],
    resources: [{ id: "resource", arn: "Sample resource" }],
    edges: [
      { from: "identity", to: "role", relation: "assumes" },
      { from: "role", to: "permission", relation: "allows" },
      { from: "permission", to: "resource", relation: "on" },
    ],
  };
}
