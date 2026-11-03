"use client";

import ReactFlow from "reactflow";
import type { Edge, Node } from "reactflow";

type AttackPathGraphProps = {
  nodes: Node[];
  edges: Edge[];
  caption: string;
};

export function AttackPathGraph({ nodes, edges, caption }: AttackPathGraphProps) {
  return (
    <section id="attack-path" className="scroll-mt-24 rounded-2xl border border-white/10 bg-[#161d2e] p-5 shadow-sm">
      <h2 className="text-xs font-medium uppercase tracking-wide text-slate-400">Relationship preview</h2>
      <div className="mt-3 h-[320px] w-full overflow-hidden rounded-xl bg-[#0e1424]">
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
        />
      </div>
      <p className="mt-3 text-sm text-slate-400">{caption}</p>
    </section>
  );
}
