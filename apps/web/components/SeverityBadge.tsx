type Severity = "Critical" | "High" | "Medium" | "Low";

type SeverityBadgeProps = {
  severity: Severity;
};

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  return <p>Severity: {severity}</p>;
}
