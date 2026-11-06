export type Severity = "Critical" | "High" | "Medium" | "Low";

export type Finding = {
  id: string;
  ruleId: string;
  severity: Severity;
  title: string;
  evidence: string;
  impact: string;
  remediation: string;
};

export type PolicyDocument = {
  Version?: string;
  Statement?: unknown;
};

export type SampleGroup = "secure" | "misconfigured";

export type SamplePolicy = {
  id: string;
  fileName: string;
  title: string;
  group: SampleGroup;
  policy: PolicyDocument;
};
