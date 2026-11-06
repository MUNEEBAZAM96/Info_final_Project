import { Router } from "express";
import { getScan, listScans, saveScan } from "../db/scans";
import { buildGraph } from "../graph/buildGraph";
import { PolicyValidationError, validatePolicy } from "../parsers/validatePolicy";
import { analyzePolicy } from "../rules/engine";
import type { PolicyDocument } from "../rules/types";

export const scansRouter = Router();

scansRouter.get("/", async (_req, res) => {
  res.json(await listScans());
});

scansRouter.post("/", async (req, res) => {
  const body = req.body as { policy?: unknown; fileName?: unknown };
  if (!body || typeof body !== "object" || Array.isArray(body) || body.policy === undefined) {
    res.status(400).json({ error: "This file is not valid JSON." });
    return;
  }
  if (body.policy === null || typeof body.policy !== "object" || Array.isArray(body.policy)) {
    res.status(400).json({ error: "This file is not valid JSON." });
    return;
  }

  try {
    const policy = validatePolicy(body.policy);
    const findings = analyzePolicy(policy as PolicyDocument);
    const graph = buildGraph(policy as PolicyDocument);
    const scan = await saveScan({
      policy: body.policy,
      fileName: typeof body.fileName === "string" ? body.fileName : null,
      findings,
      graph,
    });
    res.status(201).json(scan);
  } catch (error) {
    const message = error instanceof PolicyValidationError ? error.message : "This file is not valid JSON.";
    res.status(400).json({ error: message });
  }
});

scansRouter.get("/:id", async (req, res) => {
  const scan = await getScan(req.params.id);
  if (!scan) {
    res.status(404).json({ error: "Scan not found" });
    return;
  }
  res.json(scan);
});
