import type { AccessGraph } from "./model";

function neighbors(graph: AccessGraph): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();
  for (const edge of graph.edges) {
    const next = adjacency.get(edge.from) ?? [];
    next.push(edge.to);
    adjacency.set(edge.from, next);
  }
  return adjacency;
}

function knownIds(graph: AccessGraph): Set<string> {
  return new Set([
    ...graph.identities.map((node) => node.id),
    ...graph.roles.map((node) => node.id),
    ...graph.permissions.map((node) => node.id),
    ...graph.resources.map((node) => node.id),
    ...graph.edges.flatMap((edge) => [edge.from, edge.to]),
  ]);
}

export function bfs(graph: AccessGraph, startId: string): string[] {
  if (!knownIds(graph).has(startId)) {
    return [];
  }

  const adjacency = neighbors(graph);
  const visited: string[] = [];
  const seen = new Set<string>();
  const queue = [startId];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || seen.has(current)) {
      continue;
    }
    seen.add(current);
    visited.push(current);
    for (const next of adjacency.get(current) ?? []) {
      if (!seen.has(next)) {
        queue.push(next);
      }
    }
  }

  return visited;
}

export function dfs(graph: AccessGraph, startId: string): string[] {
  if (!knownIds(graph).has(startId)) {
    return [];
  }

  const adjacency = neighbors(graph);
  const visited: string[] = [];
  const seen = new Set<string>();

  const walk = (current: string) => {
    if (seen.has(current)) {
      return;
    }
    seen.add(current);
    visited.push(current);
    for (const next of adjacency.get(current) ?? []) {
      walk(next);
    }
  };

  walk(startId);
  return visited;
}
