"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { findSampleByPolicy, getFindings, samples } from "../lib/fixtures";
import type { GuideMode } from "../lib/guide";
import { buildPreviewGraph } from "../lib/graphPreview";
import type { PolicyDocument } from "../lib/types";
import { AppHeader } from "./AppHeader";
import { FadeIn } from "./FadeIn";
import { PolicyUpload } from "./PolicyUpload";
import { PolicyReview } from "./PolicyReview";
import { SampleSelector } from "./SampleSelector";

export function Dashboard() {
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedPolicy, setUploadedPolicy] = useState<PolicyDocument | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const selectedSample = samples.find((sample) => sample.id === selectedSampleId) ?? null;
  const activePolicy = uploadedPolicy ?? selectedSample?.policy ?? null;
  const findings = selectedSample ? getFindings(selectedSample.id) : [];
  const unknownUpload = uploadedPolicy !== null;
  const guideMode: GuideMode = !activePolicy ? "empty" : unknownUpload ? "unknown" : (selectedSample?.group ?? "empty");
  const graph = useMemo(
    () => buildPreviewGraph(selectedSample?.group ?? "empty"),
    [selectedSample],
  );

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <AppHeader
        status={selectedSample ? { group: selectedSample.group, findings } : null}
      />
      <div className="grid items-start gap-5 lg:grid-cols-2">
        <FadeIn className="space-y-5">
          <SampleSelector
            samples={samples}
            selectedId={selectedSampleId}
            onSelect={(id) => {
              setSelectedSampleId(id);
              setUploadedFileName(null);
              setUploadedPolicy(null);
              setUploadError(null);
            }}
          />
          <PolicyUpload
            fileName={uploadedFileName}
            error={uploadError}
            onInvalid={() => setUploadError("This file is not valid JSON.")}
            onParsed={(fileName, policy) => {
              const match = findSampleByPolicy(policy);
              setUploadError(null);
              setUploadedFileName(fileName);
              if (match) {
                setSelectedSampleId(match.id);
                setUploadedPolicy(null);
                return;
              }
              setSelectedSampleId(null);
              setUploadedPolicy(policy);
            }}
          />
          {selectedSample ? (
            <Button
              nativeButton={false}
              render={<Link href={`/scans/${selectedSample.id}`} />}
              className="h-auto bg-violet-600 px-4 py-2 text-white transition-transform duration-200 hover:-translate-y-px hover:bg-violet-500 hover:shadow-md active:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
            >
              Open scan view
              <ArrowRight />
            </Button>
          ) : null}
        </FadeIn>
        <PolicyReview
          policy={activePolicy}
          fileName={selectedSample?.fileName ?? uploadedFileName}
          findings={findings}
          findingsNote={
            unknownUpload
              ? "Rule analysis is not connected yet. This upload is shown only as policy text."
              : undefined
          }
          emptyFindingsText={
            activePolicy ? "No findings for this policy." : "Select a sample policy or upload a JSON file."
          }
          nodes={graph.nodes}
          edges={graph.edges}
          caption={graph.caption}
          guideMode={guideMode}
          invalidFile={uploadError !== null}
        />
      </div>
    </main>
  );
}
