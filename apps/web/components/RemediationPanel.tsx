type RemediationPanelProps = {
  recommendation: string | null;
};

export function RemediationPanel({ recommendation }: RemediationPanelProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#161d2e] p-5 shadow-sm">
      <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">Remediation</h2>
      {recommendation ? (
        <div className="mt-3 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          {recommendation}
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-300">Remediation guidance will appear here.</p>
      )}
    </section>
  );
}
