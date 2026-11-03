"use client";

import { FileText } from "lucide-react";
import type { PolicyDocument } from "../lib/types";
import { FadeIn } from "./FadeIn";

type PolicyUploadProps = {
  fileName: string | null;
  error: string | null;
  onParsed: (fileName: string, policy: PolicyDocument) => void;
  onInvalid: () => void;
};

export function PolicyUpload({ fileName, error, onParsed, onInvalid }: PolicyUploadProps) {
  return (
    <section id="policies" className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#161d2e] p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
        <FileText className="size-3.5" aria-hidden="true" />
        Upload policy
      </h2>
      <label className="mt-4 block text-sm text-slate-200" htmlFor="policy-file">
        JSON policy file
        <input
          id="policy-file"
          type="file"
          accept="application/json,.json"
          className="mt-2 block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border file:border-white/10 file:bg-white/10 file:px-3 file:py-2 file:text-sm file:text-slate-100 file:hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) {
              return;
            }
            const reader = new FileReader();
            reader.onload = () => {
              const text = typeof reader.result === "string" ? reader.result : "";
              try {
                const parsed: unknown = JSON.parse(text);
                if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
                  onInvalid();
                  return;
                }
                onParsed(file.name, parsed as PolicyDocument);
              } catch {
                onInvalid();
              }
            };
            reader.readAsText(file);
          }}
        />
      </label>
      {fileName ? (
        <p className="mt-3 w-fit rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200">{fileName}</p>
      ) : null}
      {error ? (
        <FadeIn y={4} className="mt-3">
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
        </FadeIn>
      ) : null}
    </section>
  );
}
