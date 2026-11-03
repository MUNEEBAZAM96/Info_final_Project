"use client";

import type { Finding, SampleGroup, Severity } from "../lib/types";
import { FadeIn } from "./FadeIn";
import { SeverityBadge } from "./SeverityBadge";

const severityRank: Record<Severity, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
  Critical: 3,
};

type AppHeaderProps = {
  status?: {
    group: SampleGroup;
    findings: Finding[];
  } | null;
};

export function AppHeader({ status = null }: AppHeaderProps) {
  const findingCount = status?.findings.length ?? 0;
  const highestSeverity = status?.findings.reduce<Severity | null>((highest, finding) => {
    if (!highest || severityRank[finding.severity] > severityRank[highest]) {
      return finding.severity;
    }
    return highest;
  }, null);
  const statusKey = status ? `${status.group}-${findingCount}-${highestSeverity ?? "none"}` : "none";

  return (
    <FadeIn>
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-slate-100">Policy review</h1>
        <p className="mt-1 text-sm text-slate-400">Offline review of sample AWS IAM, trust, and S3 policies.</p>
        {status ? (
          <FadeIn replayKey={statusKey} className="mt-3">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className={status.group === "secure" ? "font-medium text-emerald-300" : "font-medium text-rose-300"}>
                {status.group === "secure" ? "Secure" : "Misconfigured"}
              </span>
              <span className="text-slate-400">
                {findingCount === 1 ? "1 finding" : `${findingCount} findings`}
              </span>
              {highestSeverity ? (
                <SeverityBadge severity={highestSeverity} />
              ) : (
                <span className="text-slate-400">No severity</span>
              )}
            </div>
          </FadeIn>
        ) : null}
      </header>
    </FadeIn>
  );
}
