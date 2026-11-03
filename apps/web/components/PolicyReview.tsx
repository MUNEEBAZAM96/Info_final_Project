"use client";

import { useEffect, useState } from "react";
import type { Edge, Node } from "reactflow";
import type { GuideMode } from "../lib/guide";
import type { Finding, PolicyDocument } from "../lib/types";
import { AttackPathGraph } from "./AttackPathGraph";
import { FadeIn } from "./FadeIn";
import { FindingDetail } from "./FindingDetail";
import { FindingsList } from "./FindingsList";
import { GuideAssistant } from "./GuideAssistant";
import { RemediationPanel } from "./RemediationPanel";

type PolicyReviewProps = {
  policy: PolicyDocument | null;
  fileName?: string | null;
  findings: Finding[];
  findingsNote?: string;
  emptyFindingsText: string;
  nodes: Node[];
  edges: Edge[];
  caption: string;
  guideMode: GuideMode;
  invalidFile?: boolean;
};

export function PolicyReview({
  policy,
  fileName,
  findings,
  findingsNote,
  emptyFindingsText,
  nodes,
  edges,
  caption,
  guideMode,
  invalidFile = false,
}: PolicyReviewProps) {
  const findingKey = findings.map((finding) => finding.id).join("|");
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(findings[0]?.id ?? null);
  const selectedFinding = findings.find((finding) => finding.id === selectedFindingId) ?? null;

  useEffect(() => {
    setSelectedFindingId(findingKey ? findingKey.split("|")[0] : null);
  }, [findingKey]);

  if (!policy) {
    return (
      <div className="space-y-5">
        <FadeIn>
          <section id="findings" className="scroll-mt-24 rounded-2xl border border-dashed border-white/15 bg-[#161d2e] px-6 py-16 text-center text-slate-300">
            Select a sample policy or upload a JSON file.
          </section>
        </FadeIn>
        <FadeIn delay={0.04}>
          <GuideAssistant mode={guideMode} remediation={null} invalidFile={invalidFile} />
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <FadeIn>
        <section className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#161d2e] p-5 shadow-sm">
          <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">Policy</h2>
          <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-400">
            <span>{fileName || "Policy"}</span>
            <span>JSON</span>
          </div>
          <FadeIn replayKey={fileName || "policy"} className="mt-3">
            <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-100">
              {JSON.stringify(policy, null, 2)}
            </pre>
          </FadeIn>
        </section>
      </FadeIn>
      <FadeIn delay={0.04}>
        <FindingsList
          findings={findings}
          selectedId={selectedFinding?.id ?? null}
          emptyText={emptyFindingsText}
          note={findingsNote}
          onSelect={setSelectedFindingId}
        />
      </FadeIn>
      <FadeIn delay={0.08}>
        <FindingDetail finding={selectedFinding} />
      </FadeIn>
      <FadeIn delay={0.12}>
        <RemediationPanel recommendation={selectedFinding?.remediation ?? null} />
      </FadeIn>
      <FadeIn delay={0.16}>
        <AttackPathGraph nodes={nodes} edges={edges} caption={caption} />
      </FadeIn>
      <FadeIn delay={0.2}>
        <GuideAssistant
          mode={guideMode}
          remediation={selectedFinding?.remediation ?? null}
          invalidFile={invalidFile}
        />
      </FadeIn>
    </div>
  );
}
