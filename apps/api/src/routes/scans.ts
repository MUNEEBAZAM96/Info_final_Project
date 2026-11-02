import { Router } from "express";

export const scansRouter = Router();

scansRouter.use((_req, res) => {
  res.status(501).json({ implemented: false, module: "scans" });
});
