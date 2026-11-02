import { describe, expect, it } from "vitest";
import { buildGraph } from "../../src/graph/buildGraph";
import { bfs, dfs } from "../../src/graph/traverse";

describe("graph traversal stubs", () => {
  it("returns no paths", () => {
    const graph = buildGraph();
    expect(graph.edges).toEqual([]);
    expect(bfs(graph, "start")).toEqual([]);
    expect(dfs(graph, "start")).toEqual([]);
  });
});
