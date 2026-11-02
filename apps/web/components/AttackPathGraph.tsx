"use client";

import ReactFlow from "reactflow";
import type { Edge, Node } from "reactflow";

const nodes: Node[] = [];
const edges: Edge[] = [];

export function AttackPathGraph() {
  return (
    <section>
      <h2 className="text-lg font-medium">Attack path</h2>
      <div style={{ position: "relative", width: "100%", height: 320 }}>
        <ReactFlow nodes={nodes} edges={edges} />
      </div>
    </section>
  );
}
