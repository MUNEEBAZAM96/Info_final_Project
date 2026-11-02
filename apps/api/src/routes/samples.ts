import { Router } from "express";

export const samplesRouter = Router();

samplesRouter.use((_req, res) => {
  res.status(501).json({ implemented: false, module: "samples" });
});
