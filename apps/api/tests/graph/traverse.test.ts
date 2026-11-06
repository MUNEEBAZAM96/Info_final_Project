import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildGraph } from "../../src/graph/buildGraph";
import { bfs, dfs } from "../../src/graph/traverse";

const dataset = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../dataset");

describe("graph traversal", () => {
  it("returns no paths for an empty graph", () => {
    const graph = buildGraph();
    expect(graph.edges).toEqual([]);
    expect(bfs(graph, "start")).toEqual([]);
    expect(dfs(graph, "start")).toEqual([]);
  });

  it("walks the least-privilege preview from identity to resource", () => {
    const policy = JSON.parse(
      readFileSync(path.join(dataset, "secure", "iam-least-privilege.json"), "utf8"),
    );
    const graph = buildGraph(policy);
    expect(graph.permissions[0]).toMatchObject({
      action: "s3:GetObject",
      resource: "arn:aws:s3:::example-bucket/reports/summary.txt",
    });
    expect(bfs(graph, "identity")).toEqual(["identity", "role", "permission", "resource"]);
    expect(dfs(graph, "identity")).toEqual(["identity", "role", "permission", "resource"]);
  });
});
