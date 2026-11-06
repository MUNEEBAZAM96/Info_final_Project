"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import ReactFlow from "reactflow";
import type { Edge, Node } from "reactflow";

import {
  Badge,
  Button,
  Code,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";

import { analyzePolicy, listSamples, type AccessGraph, type ApiSample } from "./api";
import { buildGuide, type GuideMode } from "./guide";
import { buildPreviewGraph } from "./graphPreview";
import type { Finding, PolicyDocument, SampleGroup, Severity } from "./types";

import "reactflow/dist/style.css";

const sectionStyle = { scrollMarginTop: 84 };

const severityRank: Record<Severity, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
  Critical: 3,
};

const severityStyle: Record<Severity, { background: string; color: string; border: string }> = {
  Critical: { background: "rgba(225, 29, 72, 0.16)", color: "#fda4af", border: "1px solid rgba(225, 29, 72, 0.4)" },
  High: { background: "rgba(249, 115, 22, 0.16)", color: "#fdba74", border: "1px solid rgba(249, 115, 22, 0.4)" },
  Medium: { background: "rgba(245, 158, 11, 0.16)", color: "#fcd34d", border: "1px solid rgba(245, 158, 11, 0.4)" },
  Low: { background: "rgba(148, 163, 184, 0.16)", color: "#cbd5e1", border: "1px solid rgba(148, 163, 184, 0.35)" },
};

function choiceStyle(selected: boolean): CSSProperties {
  return {
    borderRadius: 10,
    border: selected ? "1px solid var(--mantine-color-indigo-4)" : "1px solid var(--mantine-color-dark-4)",
    background: selected ? "color-mix(in srgb, var(--mantine-color-indigo-5) 18%, transparent)" : "transparent",
  };
}

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <Badge variant="light" styles={{ root: severityStyle[severity] }}>
      {severity}
    </Badge>
  );
}

function StatusLine({ group, findings }: { group: SampleGroup; findings: Finding[] }) {
  const highest = findings.reduce<Severity | null>((current, finding) => {
    if (!current || severityRank[finding.severity] > severityRank[current]) {
      return finding.severity;
    }
    return current;
  }, null);
  const countLabel = findings.length === 1 ? "1 finding" : `${findings.length} findings`;

  return (
    <Group gap="sm">
      <Text size="sm" fw={600} c={group === "secure" ? "#6ee7b7" : "#fda4af"}>
        {group === "secure" ? "Secure" : "Misconfigured"}
      </Text>
      <Text size="sm" c="dimmed">
        {countLabel}
      </Text>
      {highest ? <SeverityBadge severity={highest} /> : <Text size="sm" c="dimmed">No severity</Text>}
    </Group>
  );
}

function PolicyJson({ policy, fileName }: { policy: PolicyDocument; fileName: string | null }) {
  return (
    <Paper withBorder p="md" radius="md">
      <Text size="xs" tt="uppercase" c="dimmed" fw={600}>
        Policy
      </Text>
      <Group justify="space-between" mt="sm">
        <Text size="xs" c="dimmed">
          {fileName || "Policy"}
        </Text>
        <Text size="xs" c="dimmed">
          JSON
        </Text>
      </Group>
      <Code block mt="sm" style={{ background: "var(--mantine-color-dark-9)", color: "var(--mantine-color-dark-0)" }}>
        {JSON.stringify(policy, null, 2)}
      </Code>
    </Paper>
  );
}

function FindingsList({
  findings,
  selectedId,
  emptyText,
  note,
  onSelect,
}: {
  findings: Finding[];
  selectedId: string | null;
  emptyText: string;
  note?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <Paper id="findings" withBorder p="md" radius="md" style={sectionStyle}>
      <Text size="xs" tt="uppercase" c="dimmed" fw={600}>
        Findings
      </Text>
      {note ? (
        <Text size="sm" mt="sm">
          {note}
        </Text>
      ) : null}
      {findings.length === 0 ? (
        <Text size="sm" c="dimmed" mt="sm">
          {emptyText}
        </Text>
      ) : (
        <Stack gap="xs" mt="sm">
          {findings.map((finding) => {
            const selected = finding.id === selectedId;
            return (
              <UnstyledButton
                key={finding.id}
                onClick={() => onSelect(finding.id)}
                aria-pressed={selected}
                p="sm"
                style={choiceStyle(selected)}
              >
                <Group align="flex-start" wrap="nowrap">
                  <SeverityBadge severity={finding.severity} />
                  <div>
                    <Text size="sm">{finding.title}</Text>
                    <Text size="xs" c="dimmed">
                      {finding.ruleId}
                    </Text>
                  </div>
                </Group>
              </UnstyledButton>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}

function FindingDetail({ finding }: { finding: Finding | null }) {
  return (
    <Paper withBorder p="md" radius="md">
      <Text size="xs" tt="uppercase" c="dimmed" fw={600}>
        Finding detail
      </Text>
      {finding ? (
        <Stack gap="sm" mt="sm">
          <Group>
            <Text size="sm" fw={600}>
              {finding.title}
            </Text>
            <SeverityBadge severity={finding.severity} />
          </Group>
          <Paper withBorder p="sm" radius="md">
            <Text size="xs" tt="uppercase" c="dimmed" fw={600}>
              Evidence
            </Text>
            <Text size="sm" mt="xs">
              {finding.evidence}
            </Text>
          </Paper>
          <Paper withBorder p="sm" radius="md">
            <Text size="xs" tt="uppercase" c="dimmed" fw={600}>
              Impact
            </Text>
            <Text size="sm" mt="xs">
              {finding.impact}
            </Text>
          </Paper>
        </Stack>
      ) : (
        <Text size="sm" c="dimmed" mt="sm">
          Select a finding to see evidence.
        </Text>
      )}
    </Paper>
  );
}

function RemediationPanel({ recommendation }: { recommendation: string | null }) {
  return (
    <Paper withBorder p="md" radius="md">
      <Text size="xs" tt="uppercase" c="dimmed" fw={600}>
        Remediation
      </Text>
      {recommendation ? (
        <Paper
          mt="sm"
          p="md"
          radius="md"
          style={{ background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.35)" }}
        >
          <Text size="sm" c="#a7f3d0">
            {recommendation}
          </Text>
        </Paper>
      ) : (
        <Text size="sm" c="dimmed" mt="sm">
          Remediation guidance will appear here.
        </Text>
      )}
    </Paper>
  );
}

function AttackPathGraph({ nodes, edges, caption }: { nodes: Node[]; edges: Edge[]; caption: string }) {
  return (
    <Paper id="attack-path" withBorder p="md" radius="md" style={sectionStyle}>
      <Text size="xs" tt="uppercase" c="dimmed" fw={600}>
        Relationship preview
      </Text>
      <div style={{ height: 320, marginTop: 12, borderRadius: 12, overflow: "hidden", background: "var(--mantine-color-dark-9)", border: "1px solid var(--mantine-color-dark-4)" }}>
        <ReactFlow
          key={`${nodes.map((node) => node.id).join("-")}-${edges.length}`}
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
          style={{ background: "transparent" }}
        />
      </div>
      <Text size="sm" c="dimmed" mt="sm">
        {caption}
      </Text>
    </Paper>
  );
}

function GuideCard({ mode, remediation, invalidFile }: { mode: GuideMode; remediation: string | null; invalidFile: boolean }) {
  const guide = buildGuide(mode, remediation, invalidFile);

  return (
    <Paper id="guide" withBorder p="md" radius="md" style={sectionStyle}>
      <Title order={4}>CloudGuard Guide</Title>
      <Text size="sm" c="dimmed" mt={4}>
        Guidance from this demo.
      </Text>
      <Stack gap="sm" mt="md">
        <div>
          <Text size="xs" tt="uppercase" c="dimmed" fw={600}>
            You can
          </Text>
          <Text size="sm" mt={4}>
            {guide.youCan}
          </Text>
        </div>
        <div>
          <Text size="xs" tt="uppercase" c="dimmed" fw={600}>
            Do next
          </Text>
          <Text size="sm" mt={4}>
            {guide.doNext}
          </Text>
        </div>
        <div>
          <Text size="xs" tt="uppercase" c="dimmed" fw={600}>
            Recommended change
          </Text>
          <Text size="sm" mt={4}>
            {guide.recommendedChange}
          </Text>
        </div>
        {guide.invalidNote ? (
          <Text size="sm" c="red.4">
            {guide.invalidNote}
          </Text>
        ) : null}
      </Stack>
    </Paper>
  );
}

function ReviewColumn({
  policy,
  fileName,
  findings,
  findingsNote,
  emptyFindingsText,
  nodes,
  edges,
  caption,
  guideMode,
  invalidFile,
}: {
  policy: PolicyDocument | null;
  fileName: string | null;
  findings: Finding[];
  findingsNote?: string;
  emptyFindingsText: string;
  nodes: Node[];
  edges: Edge[];
  caption: string;
  guideMode: GuideMode;
  invalidFile: boolean;
}) {
  const findingKey = findings.map((finding) => finding.id).join("|");
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(findings[0]?.id ?? null);
  const selectedFinding = findings.find((finding) => finding.id === selectedFindingId) ?? null;

  useEffect(() => {
    setSelectedFindingId(findingKey ? findingKey.split("|")[0] : null);
  }, [findingKey]);

  if (!policy) {
    return (
      <Stack>
        <Paper id="findings" withBorder p="xl" radius="md" style={{ ...sectionStyle, borderStyle: "dashed" }}>
          <Text ta="center" c="dimmed">
            Select a sample policy or upload a JSON file.
          </Text>
        </Paper>
        <GuideCard mode={guideMode} remediation={null} invalidFile={invalidFile} />
      </Stack>
    );
  }

  return (
    <Stack>
      <PolicyJson policy={policy} fileName={fileName} />
      <FindingsList
        findings={findings}
        selectedId={selectedFinding?.id ?? null}
        emptyText={emptyFindingsText}
        note={findingsNote}
        onSelect={setSelectedFindingId}
      />
      <FindingDetail finding={selectedFinding} />
      <RemediationPanel recommendation={selectedFinding?.remediation ?? null} />
      <AttackPathGraph nodes={nodes} edges={edges} caption={caption} />
      <GuideCard mode={guideMode} remediation={selectedFinding?.remediation ?? null} invalidFile={invalidFile} />
    </Stack>
  );
}

function permissionFrom(graph: AccessGraph | undefined) {
  const permission = graph?.permissions[0];
  if (!permission) {
    return undefined;
  }
  return { action: permission.action, resource: permission.resource };
}

export function CloudGuardHome() {
  const [samples, setSamples] = useState<ApiSample[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedPolicy, setUploadedPolicy] = useState<PolicyDocument | null>(null);
  const [uploadedAnalysis, setUploadedAnalysis] = useState<{ findings: Finding[]; graph: AccessGraph } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listSamples()
      .then((next) => {
        if (active) {
          setSamples(next);
        }
      })
      .catch(() => {
        if (active) {
          setLoadError("The analysis API is not running.");
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const selectedSample = samples.find((sample) => sample.id === selectedSampleId) ?? null;
  const activePolicy = uploadedPolicy ?? selectedSample?.policy ?? null;
  const findings = uploadedAnalysis?.findings ?? selectedSample?.findings ?? [];
  const activeGraph = uploadedAnalysis?.graph ?? selectedSample?.graph;
  const guideMode: GuideMode = !activePolicy ? "empty" : findings.length > 0 ? "misconfigured" : "secure";
  const graph = useMemo(
    () =>
      buildPreviewGraph(
        !activePolicy ? "empty" : findings.length > 0 ? "misconfigured" : "secure",
        permissionFrom(activeGraph),
      ),
    [activePolicy, findings, activeGraph],
  );

  return (
    <Stack gap="lg">
      <div id="overview" style={sectionStyle}>
        <Title order={2}>Policy review</Title>
        <Text c="dimmed" mt={4}>
          Offline review of sample AWS IAM, trust, and S3 policies.
        </Text>
        {loadError ? (
          <Text size="sm" c="red.4" mt="sm">
            {loadError}
          </Text>
        ) : null}
        {selectedSample ? (
          <div style={{ marginTop: 12 }}>
            <StatusLine group={selectedSample.group} findings={findings} />
          </div>
        ) : null}
      </div>
      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Stack>
            <Paper withBorder p="md" radius="md">
              <Text size="xs" tt="uppercase" c="dimmed" fw={600}>
                Sample policies
              </Text>
              <Stack gap="md" mt="md">
                {(
                  [
                    { id: "secure", label: "Secure" },
                    { id: "misconfigured", label: "Misconfigured" },
                  ] as const
                ).map((group) => (
                  <div key={group.id}>
                    <Text size="sm" fw={600}>
                      {group.label}
                    </Text>
                    <Stack gap="xs" mt="xs">
                      {samples
                        .filter((sample) => sample.group === group.id)
                        .map((sample) => {
                          const selected = sample.id === selectedSampleId;
                          return (
                            <UnstyledButton
                              key={sample.id}
                              onClick={() => {
                                setSelectedSampleId(sample.id);
                                setUploadedFileName(null);
                                setUploadedPolicy(null);
                                setUploadedAnalysis(null);
                                setUploadError(null);
                              }}
                              aria-pressed={selected}
                              px="sm"
                              py={8}
                              style={choiceStyle(selected)}
                            >
                              <Group gap="xs">
                                <span
                                  style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 99,
                                    background: sample.group === "secure" ? "#10b981" : "#e11d48",
                                  }}
                                />
                                <Text size="sm">{sample.title}</Text>
                              </Group>
                            </UnstyledButton>
                          );
                        })}
                    </Stack>
                  </div>
                ))}
              </Stack>
            </Paper>
            <Paper id="policies" withBorder p="md" radius="md" style={sectionStyle}>
              <Text size="xs" tt="uppercase" c="dimmed" fw={600}>
                Upload policy
              </Text>
              <Text component="label" htmlFor="policy-file" size="sm" mt="md" display="block">
                JSON policy file
              </Text>
              <input
                id="policy-file"
                type="file"
                accept="application/json,.json"
                className="cg-file"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) {
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () => {
                    const text = typeof reader.result === "string" ? reader.result : "";
                    let parsed: unknown;
                    try {
                      parsed = JSON.parse(text);
                    } catch {
                      setUploadError("This file is not valid JSON.");
                      return;
                    }
                    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
                      setUploadError("This file is not valid JSON.");
                      return;
                    }
                    const policy = parsed as PolicyDocument;
                    void analyzePolicy(policy)
                      .then((result) => {
                        const match = samples.find((sample) => JSON.stringify(sample.policy) === JSON.stringify(policy));
                        setUploadError(null);
                        setUploadedFileName(file.name);
                        if (match) {
                          setSelectedSampleId(match.id);
                          setUploadedPolicy(null);
                          setUploadedAnalysis(null);
                          return;
                        }
                        setSelectedSampleId(null);
                        setUploadedPolicy(policy);
                        setUploadedAnalysis(result);
                      })
                      .catch(() => {
                        setUploadError("This file is not valid JSON.");
                      });
                  };
                  reader.readAsText(file);
                }}
              />
              {uploadedFileName ? (
                <Badge mt="sm" variant="light">
                  {uploadedFileName}
                </Badge>
              ) : null}
              {uploadError ? (
                <Text size="sm" c="red.4" mt="sm">
                  {uploadError}
                </Text>
              ) : null}
            </Paper>
            {selectedSample ? (
              <Button component={Link} href={`/scans/${selectedSample.id}`}>
                Open scan view
              </Button>
            ) : null}
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <ReviewColumn
            policy={activePolicy}
            fileName={selectedSample?.fileName ?? uploadedFileName}
            findings={findings}
            emptyFindingsText={
              activePolicy ? "No findings for this policy." : "Select a sample policy or upload a JSON file."
            }
            nodes={graph.nodes}
            edges={graph.edges}
            caption={graph.caption}
            guideMode={guideMode}
            invalidFile={uploadError !== null}
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export function CloudGuardScan({ sample }: { sample: ApiSample }) {
  const findings = sample.findings;
  const graph = useMemo(
    () =>
      buildPreviewGraph(
        findings.length > 0 ? "misconfigured" : "secure",
        permissionFrom(sample.graph),
      ),
    [findings.length, sample.graph],
  );

  return (
    <Stack gap="lg">
      <div id="overview" style={sectionStyle}>
        <Title order={2}>{sample.title}</Title>
        <Text c="dimmed" mt={4}>
          Offline review of sample AWS IAM, trust, and S3 policies.
        </Text>
        <div style={{ marginTop: 12 }}>
          <StatusLine group={sample.group} findings={findings} />
        </div>
      </div>
      <Button component={Link} href="/" variant="subtle" w="fit-content" px={0}>
        Back to dashboard
      </Button>
      <div id="policies" style={sectionStyle}>
        <ReviewColumn
          policy={sample.policy}
          fileName={sample.fileName}
          findings={findings}
          emptyFindingsText="No findings for this policy."
          nodes={graph.nodes}
          edges={graph.edges}
          caption={graph.caption}
          guideMode={findings.length > 0 ? "misconfigured" : "secure"}
          invalidFile={false}
        />
      </div>
    </Stack>
  );
}
