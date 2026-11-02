import { AttackPathGraph } from "../components/AttackPathGraph";
import { FindingDetail } from "../components/FindingDetail";
import { FindingsList } from "../components/FindingsList";
import { PolicyUpload } from "../components/PolicyUpload";
import { RemediationPanel } from "../components/RemediationPanel";
import { SampleSelector } from "../components/SampleSelector";
import { SeverityBadge } from "../components/SeverityBadge";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-12">
      <header>
        <h1 className="text-3xl font-semibold">CloudGuard</h1>
        <p className="mt-3">
          Upload a policy or select a sample. The analysis API is not connected yet.
        </p>
      </header>
      <PolicyUpload label="Policy upload will be available here." />
      <SampleSelector label="Sample policies will be listed here." />
      <FindingsList title="Findings" emptyText="No findings yet." />
      <FindingDetail title="Finding detail" body="Select a finding to see evidence." />
      <SeverityBadge severity="Low" />
      <RemediationPanel recommendation="Remediation guidance will appear here." />
      <AttackPathGraph />
    </main>
  );
}
