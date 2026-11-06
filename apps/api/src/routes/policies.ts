import { Router } from "express";
import { buildGraph } from "../graph/buildGraph";
import { PolicyValidationError, validatePolicy } from "../parsers/validatePolicy";
import { analyzePolicy } from "../rules/engine";
import type { PolicyDocument } from "../rules/types";

export const policiesRouter = Router();

policiesRouter.post("/analyze", (req, res) => {
  if (req.body === null || typeof req.body !== "object" || Array.isArray(req.body)) {
    res.status(400).json({ error: "This file is not valid JSON." });
    return;
  }

  try {
    const policy = validatePolicy(req.body);
    res.json({
      findings: analyzePolicy(policy as PolicyDocument),
      graph: buildGraph(policy as PolicyDocument),
    });
  } catch (error) {
    const message = error instanceof PolicyValidationError ? error.message : "This file is not valid JSON.";
    res.status(400).json({ error: message });
  }
});
