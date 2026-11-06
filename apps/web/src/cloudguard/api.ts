import type { Finding, PolicyDocument, SampleGroup } from "./types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type AccessGraph = {
  identities: { id: string; name: string }[];
  roles: { id: string; name: string }[];
  permissions: { id: string; action: string; resource: string }[];
  resources: { id: string; arn: string }[];
  edges: { from: string; to: string; relation: string }[];
};

export type ApiSample = {
  id: string;
  fileName: string;
  title: string;
  group: SampleGroup;
  policy: PolicyDocument;
  findings: Finding[];
  graph: AccessGraph;
};

export type AnalysisResult = {
  findings: Finding[];
  graph: AccessGraph;
};

async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? "The analysis API could not read this policy.";
  } catch {
    return "The analysis API could not read this policy.";
  }
}

export async function listSamples(): Promise<ApiSample[]> {
  const response = await fetch(`${API_BASE_URL}/api/samples`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  return response.json() as Promise<ApiSample[]>;
}

export async function getApiSample(id: string): Promise<ApiSample | null> {
  const response = await fetch(`${API_BASE_URL}/api/samples/${id}`, { cache: "no-store" });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  return response.json() as Promise<ApiSample>;
}

export async function analyzePolicy(policy: PolicyDocument): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/api/policies/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(policy),
  });
  if (!response.ok) {
    throw new Error(await readError(response));
  }
  return response.json() as Promise<AnalysisResult>;
}
