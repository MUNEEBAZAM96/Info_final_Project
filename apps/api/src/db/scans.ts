import { randomUUID } from "node:crypto";
import type { AccessGraph } from "../graph/model";
import type { Finding } from "../rules/types";

export interface StoredScan {
  id: string;
  fileName: string | null;
  policy: unknown;
  findings: Finding[];
  graph: AccessGraph;
  createdAt: string;
}

const scans = new Map<string, StoredScan>();

export async function saveScan(input: {
  policy: unknown;
  fileName?: string | null;
  findings: Finding[];
  graph: AccessGraph;
}): Promise<StoredScan> {
  const record: StoredScan = {
    id: randomUUID(),
    fileName: input.fileName ?? null,
    policy: input.policy,
    findings: input.findings,
    graph: input.graph,
    createdAt: new Date().toISOString(),
  };
  scans.set(record.id, record);
  return record;
}

export async function getScan(id: string): Promise<StoredScan | undefined> {
  return scans.get(id);
}

export async function listScans(): Promise<StoredScan[]> {
  return [...scans.values()].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}
