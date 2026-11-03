"use client";

import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { buildGuide, type GuideMode } from "../lib/guide";
import { FadeIn } from "./FadeIn";

type GuideAssistantProps = {
  mode: GuideMode;
  remediation: string | null;
  invalidFile: boolean;
};

export function GuideAssistant({ mode, remediation, invalidFile }: GuideAssistantProps) {
  const guide = buildGuide(mode, remediation, invalidFile);
  const replayKey = `${mode}:${guide.recommendedChange}:${guide.invalidNote ?? ""}`;

  return (
    <Card id="guide" className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#161d2e] text-slate-100 shadow-sm ring-white/10">
      <CardContent className="flex flex-col gap-4 sm:flex-row">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-100">
          <Shield className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-medium text-slate-100">CloudGuard Guide</h2>
          <p className="mt-1 text-sm text-slate-400">Guidance from this demo.</p>
          <FadeIn replayKey={replayKey} className="mt-4 space-y-3">
            <GuideRow label="You can" text={guide.youCan} />
            <GuideRow label="Do next" text={guide.doNext} />
            <GuideRow label="Recommended change" text={guide.recommendedChange} />
            {guide.invalidNote ? <p className="text-sm text-rose-700">{guide.invalidNote}</p> : null}
          </FadeIn>
        </div>
      </CardContent>
    </Card>
  );
}

function GuideRow({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm text-slate-200">{text}</p>
    </div>
  );
}
