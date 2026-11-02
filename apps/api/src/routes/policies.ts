import { Router } from "express";

export const policiesRouter = Router();

policiesRouter.use((_req, res) => {
  res.status(501).json({ implemented: false, module: "policies" });
});
