import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildGraph } from "../graph/buildGraph";
import type { AccessGraph } from "../graph/model";
import { analyzePolicy } from "../rules/engine";
import type { Finding, PolicyDocument } from "../rules/types";

export type SampleGroup = "secure" | "misconfigured";

export interface CatalogSample {
  id: string;
  fileName: string;
  title: string;
  group: SampleGroup;
  policy: PolicyDocument;
  findings: Finding[];
  graph: AccessGraph;
}

const titles: Record<string, string> = {
  "iam-least-privilege": "IAM least privilege",
  "trust-restricted-principal": "Restricted role trust",
  "s3-private-bucket": "Private bucket policy",
  "iam-wildcard-action": "IAM wildcard action",
  "iam-wildcard-resource": "IAM wildcard resource",
  "iam-excessive-privilege": "IAM excessive privilege",
  "trust-broad-principal": "Broad role trust",
  "s3-public-access": "Public bucket access",
};

const order = [
  { group: "secure" as const, id: "iam-least-privilege" },
  { group: "secure" as const, id: "trust-restricted-principal" },
  { group: "secure" as const, id: "s3-private-bucket" },
  { group: "misconfigured" as const, id: "iam-wildcard-action" },
  { group: "misconfigured" as const, id: "iam-wildcard-resource" },
  { group: "misconfigured" as const, id: "iam-excessive-privilege" },
  { group: "misconfigured" as const, id: "trust-broad-principal" },
  { group: "misconfigured" as const, id: "s3-public-access" },
];

const datasetRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../dataset");

function readSample(group: SampleGroup, id: string): CatalogSample {
  const fileName = `${id}.json`;
  const policy = JSON.parse(readFileSync(path.join(datasetRoot, group, fileName), "utf8")) as PolicyDocument;
  return {
    id,
    fileName,
    title: titles[id] ?? id,
    group,
    policy,
    findings: analyzePolicy(policy),
    graph: buildGraph(policy),
  };
}

export function listCatalog(): CatalogSample[] {
  return order.map((sample) => readSample(sample.group, sample.id));
}

export function getCatalogSample(id: string): CatalogSample | undefined {
  const match = order.find((sample) => sample.id === id);
  if (!match) {
    return undefined;
  }
  return readSample(match.group, match.id);
}
