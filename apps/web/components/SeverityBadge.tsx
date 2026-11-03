import type { Severity } from "../lib/types";

const severityClass: Record<Severity, string> = {
  Critical: "bg-rose-50 text-rose-800",
  High: "bg-orange-50 text-orange-800",
  Medium: "bg-amber-50 text-amber-800",
  Low: "bg-slate-100 text-slate-700",
};

const dotClass: Record<Severity, string> = {
  Critical: "bg-rose-600",
  High: "bg-orange-500",
  Medium: "bg-amber-500",
  Low: "bg-slate-500",
};

type SeverityBadgeProps = {
  severity: Severity;
};

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${severityClass[severity]}`}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotClass[severity]}`} />
      {severity}
    </span>
  );
}
