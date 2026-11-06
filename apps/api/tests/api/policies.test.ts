import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/app";

const dataset = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../../dataset");

function loadPolicy(group: string, name: string) {
  return JSON.parse(readFileSync(path.join(dataset, group, `${name}.json`), "utf8"));
}

const cases = [
  ["secure", "iam-least-privilege", 0, undefined],
  ["secure", "trust-restricted-principal", 0, undefined],
  ["secure", "s3-private-bucket", 0, undefined],
  ["misconfigured", "iam-wildcard-action", 1, "Wildcard action"],
  ["misconfigured", "iam-wildcard-resource", 1, "Wildcard resource"],
  ["misconfigured", "iam-excessive-privilege", 1, "Administrator-style permission"],
  ["misconfigured", "trust-broad-principal", 1, "Role trust allows any principal"],
  ["misconfigured", "s3-public-access", 1, "Bucket policy allows public read"],
] as const;

describe("analysis api", () => {
  it("GET /health returns 200", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("GET /api/samples returns eight samples", async () => {
    const response = await request(app).get("/api/samples");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(8);
    expect(response.body.map((sample: { id: string }) => sample.id)).toContain("iam-least-privilege");
  });

  it("GET /api/samples/iam-excessive-privilege returns the Critical finding", async () => {
    const response = await request(app).get("/api/samples/iam-excessive-privilege");
    expect(response.status).toBe(200);
    expect(response.body.findings[0].title).toBe("Administrator-style permission");
    expect(response.body.findings[0].severity).toBe("Critical");
  });

  it("GET /api/samples/does-not-exist returns 404", async () => {
    const response = await request(app).get("/api/samples/does-not-exist");
    expect(response.status).toBe(404);
  });

  it("POST /api/policies/analyze checks every dataset policy", async () => {
    for (const [group, name, count, title] of cases) {
      const response = await request(app).post("/api/policies/analyze").send(loadPolicy(group, name));
      expect(response.status).toBe(200);
      expect(response.body.findings).toHaveLength(count);
      if (title) {
        expect(response.body.findings[0].title).toBe(title);
      }
      expect(response.body.graph.identities[0].name).toBe("Sample identity");
    }
  });

  it("POST /api/policies/analyze rejects a non-object", async () => {
    const response = await request(app).post("/api/policies/analyze").send([]);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "This file is not valid JSON." });
  });

  it("POST /api/scans then GET /api/scans/:id returns the same findings", async () => {
    const created = await request(app).post("/api/scans").send({
      fileName: "iam-wildcard-action.json",
      policy: loadPolicy("misconfigured", "iam-wildcard-action"),
    });
    expect(created.status).toBe(201);
    expect(created.body.findings[0].title).toBe("Wildcard action");

    const fetched = await request(app).get(`/api/scans/${created.body.id}`);
    expect(fetched.status).toBe(200);
    expect(fetched.body.findings).toEqual(created.body.findings);
  });
});
