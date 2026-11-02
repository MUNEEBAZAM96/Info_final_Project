import express from "express";
import { policiesRouter } from "./routes/policies";
import { samplesRouter } from "./routes/samples";
import { scansRouter } from "./routes/scans";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/policies", policiesRouter);
app.use("/api/samples", samplesRouter);
app.use("/api/scans", scansRouter);
