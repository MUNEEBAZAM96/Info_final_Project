export type Severity = "Critical" | "High" | "Medium" | "Low";

export interface Finding {
  id: string;
  ruleId: string;
  severity: Severity;
  title: string;
  evidence: string;
  impact: string;
  remediation: string;
}

export interface PolicyDocument {
  Version?: string;
  Statement?: unknown;
}

export interface AnalysisResult {
  findings: Finding[];
}
