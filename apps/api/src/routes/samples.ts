import { Router } from "express";
import { getCatalogSample, listCatalog } from "../samples/catalog";

export const samplesRouter = Router();

samplesRouter.get("/", (_req, res) => {
  res.json(listCatalog());
});

samplesRouter.get("/:id", (req, res) => {
  const sample = getCatalogSample(req.params.id);
  if (!sample) {
    res.status(404).json({ error: "No sample matches this id." });
    return;
  }
  res.json(sample);
});
