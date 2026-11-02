type RemediationPanelProps = {
  recommendation: string;
};

export function RemediationPanel({ recommendation }: RemediationPanelProps) {
  return (
    <section>
      <h2 className="text-lg font-medium">Remediation</h2>
      <p>{recommendation}</p>
    </section>
  );
}
