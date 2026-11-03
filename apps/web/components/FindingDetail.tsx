import type { Finding } from "../lib/types";
import { SeverityBadge } from "./SeverityBadge";

type FindingDetailProps = {
  finding: Finding | null;
};

export function FindingDetail({ finding }: FindingDetailProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#161d2e] p-5 shadow-sm">
      <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">Finding detail</h2>
      {finding ? (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium text-slate-100">{finding.title}</p>
            <SeverityBadge severity={finding.severity} />
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Evidence</p>
            <p className="mt-2 text-sm text-slate-200">{finding.evidence}</p>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Impact</p>
            <p className="mt-2 text-sm text-slate-200">{finding.impact}</p>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-300">Select a finding to see evidence.</p>
      )}
    </section>
  );
}
