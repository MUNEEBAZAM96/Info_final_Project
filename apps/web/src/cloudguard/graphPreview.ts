import { Position, type Edge, type Node } from "reactflow";

export type GraphVariant = "secure" | "misconfigured" | "empty";

export function buildPreviewGraph(
  variant: GraphVariant,
  permission?: { action?: string; resource?: string },
): {
  nodes: Node[];
  edges: Edge[];
  caption: string;
} {
  if (variant === "empty") {
    return {
      nodes: [],
      edges: [],
      caption: "Select a sample to see the relationship preview.",
    };
  }

  const highlighted = variant === "misconfigured";
  const permissionLabel =
    permission?.action || permission?.resource
      ? `Allowed permission\n${permission.action ?? "*"}\n${permission.resource ?? "*"}`
      : "Allowed permission";
  const labels = ["Sample identity", "Sample role", permissionLabel, "Sample resource"];
  const nodes: Node[] = labels.map((label, index) => ({
    id: `node-${index}`,
    data: { label },
    position: { x: index * 230, y: 80 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    className: "cg-fade-node",
    style: highlighted
      ? {
          width: 200,
          borderRadius: 8,
          border: "1px solid #e11d48",
          background: "#ffffff",
          color: "#0f172a",
          fontSize: 12,
          whiteSpace: "pre-wrap",
          animationDelay: `${index * 80}ms`,
        }
      : {
          width: 200,
          borderRadius: 8,
          border: "1px solid #cbd5e1",
          background: "#ffffff",
          color: "#0f172a",
          fontSize: 12,
          whiteSpace: "pre-wrap",
          animationDelay: `${index * 80}ms`,
        },
  }));

  const edges: Edge[] = [0, 1, 2].map((index) => ({
    id: `edge-${index}`,
    source: `node-${index}`,
    target: `node-${index + 1}`,
    className: "cg-fade-edge",
    style: highlighted
      ? { stroke: "#e11d48", strokeWidth: 2, animationDelay: `${320 + index * 80}ms` }
      : { stroke: "#94a3b8", animationDelay: `${320 + index * 80}ms` },
  }));

  return {
    nodes,
    edges,
    caption: highlighted
      ? "Preview of modeled relationships. This path is not calculated from the policy."
      : "No risky relationship is highlighted for this secure sample.",
  };
}
