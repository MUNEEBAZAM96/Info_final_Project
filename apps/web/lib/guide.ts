export type GuideMode = "empty" | "secure" | "misconfigured" | "unknown";

export type GuideCopy = {
  youCan: string;
  doNext: string;
  recommendedChange: string;
  invalidNote: string | null;
};

export function buildGuide(mode: GuideMode, remediation: string | null, invalidFile: boolean): GuideCopy {
  const copy: Record<GuideMode, Omit<GuideCopy, "invalidNote">> = {
    empty: {
      youCan: "Choose a sample policy or upload a JSON file.",
      doNext: "Open IAM least privilege, then IAM excessive privilege.",
      recommendedChange: "No policy is loaded yet.",
    },
    secure: {
      youCan: "Read the policy and open the scan view.",
      doNext: "Compare it with a misconfigured sample.",
      recommendedChange: "No change is suggested for this sample.",
    },
    misconfigured: {
      youCan: "Read the finding, evidence, and impact.",
      doNext: "Open the scan view.",
      recommendedChange: remediation ?? "No change is suggested for this sample.",
    },
    unknown: {
      youCan: "Read the uploaded JSON.",
      doNext: "Select a known sample to see fixture findings.",
      recommendedChange: "Rule analysis is not connected yet.",
    },
  };

  return {
    ...copy[mode],
    invalidNote: invalidFile ? "The last file was not valid JSON." : null,
  };
}
