"use client";

import type { Finding } from "../lib/types";
import { SeverityBadge } from "./SeverityBadge";

type FindingsListProps = {
  findings: Finding[];
  selectedId: string | null;
  emptyText: string;
  note?: string;
  onSelect: (id: string) => void;
};

export function FindingsList({ findings, selectedId, emptyText, note, onSelect }: FindingsListProps) {
  return (
    <section id="findings" className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#161d2e] p-5 shadow-sm">
      <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">Findings</h2>
      {note ? <p className="mt-3 text-sm text-slate-200">{note}</p> : null}
      {findings.length === 0 ? (
        <p className="mt-3 text-sm text-slate-300">{emptyText}</p>
      ) : (
        <div className="mt-3 space-y-2">
          {findings.map((finding) => {
            const selected = finding.id === selectedId;
            return (
              <button
                key={finding.id}
                type="button"
                onClick={() => onSelect(finding.id)}
                className={`flex w-full items-start gap-3 rounded-lg border px-3 py-2 text-left transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300 ${
                  selected ? "border-violet-400/70 bg-violet-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
                aria-pressed={selected}
              >
                <SeverityBadge severity={finding.severity} />
                <span>
                  <span className="block text-sm text-slate-100">{finding.title}</span>
                  <span className="mt-1 block text-xs text-slate-500">{finding.ruleId}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
