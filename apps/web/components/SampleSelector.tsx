"use client";

import type { SamplePolicy } from "../lib/types";

type SampleSelectorProps = {
  samples: SamplePolicy[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const focusClass =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-300";

export function SampleSelector({ samples, selectedId, onSelect }: SampleSelectorProps) {
  const groups: Array<{ id: SamplePolicy["group"]; label: string }> = [
    { id: "secure", label: "Secure" },
    { id: "misconfigured", label: "Misconfigured" },
  ];

  return (
    <section id="overview" className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#161d2e] p-5 shadow-sm">
      <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">Sample policies</h2>
      <div className="mt-4 space-y-4">
        {groups.map((group) => (
          <div key={group.id}>
            <h3 className="text-sm font-medium text-slate-200">{group.label}</h3>
            <div className="mt-2 space-y-2">
              {samples
                .filter((sample) => sample.group === group.id)
                .map((sample) => {
                  const selected = sample.id === selectedId;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => onSelect(sample.id)}
                      className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm text-slate-200 transition-colors duration-200 ${focusClass} ${
                        selected
                          ? "border-violet-400/70 bg-violet-500/10 shadow-sm"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                      }`}
                      aria-pressed={selected}
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full transition-transform duration-200 ${
                          selected ? "scale-110" : "scale-100"
                        } ${sample.group === "secure" ? "bg-emerald-500" : "bg-rose-500"}`}
                      />
                      {sample.title}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
