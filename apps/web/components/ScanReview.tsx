"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { getFindings } from "../lib/fixtures";
import { buildPreviewGraph } from "../lib/graphPreview";
import type { SamplePolicy } from "../lib/types";
import { AppHeader } from "./AppHeader";
import { PolicyReview } from "./PolicyReview";

type ScanReviewProps = {
  sample: SamplePolicy;
};

export function ScanReview({ sample }: ScanReviewProps) {
  const findings = getFindings(sample.id);
  const graph = useMemo(() => buildPreviewGraph(sample.group), [sample.group]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div id="overview" className="scroll-mt-24">
        <AppHeader status={{ group: sample.group, findings }} />
      </div>
      <Button
        variant="link"
        nativeButton={false}
        render={<Link href="/" />}
        className="h-auto w-fit px-0 text-sm text-slate-300 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
      >
        Back to dashboard
      </Button>
      <div id="policies" className="scroll-mt-24">
      <PolicyReview
        policy={sample.policy}
        fileName={sample.fileName}
        findings={findings}
        emptyFindingsText="No findings for this policy."
        nodes={graph.nodes}
        edges={graph.edges}
        caption={graph.caption}
        guideMode={sample.group}
      />
      </div>
    </main>
  );
}
