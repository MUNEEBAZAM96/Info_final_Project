import cors from "cors";
import express from "express";
import { policiesRouter } from "./routes/policies";
import { samplesRouter } from "./routes/samples";
import { scansRouter } from "./routes/scans";

export const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/policies", policiesRouter);
app.use("/api/samples", samplesRouter);
app.use("/api/scans", scansRouter);

app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof SyntaxError) {
    res.status(400).json({ error: "This file is not valid JSON." });
    return;
  }
  next(error);
});
