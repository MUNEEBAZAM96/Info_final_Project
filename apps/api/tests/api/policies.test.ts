import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../../src/app";

describe("api placeholders", () => {
  it("GET /health returns 200", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("placeholder routes return 501", async () => {
    const paths = ["/api/policies", "/api/samples", "/api/scans"];

    for (const path of paths) {
      const response = await request(app).get(path);
      expect(response.status).toBe(501);
      expect(response.body.implemented).toBe(false);
    }
  });
});
