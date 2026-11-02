export const API_BASE_URL = "http://localhost:4000";

export type HealthResponse = {
  status: "ok";
};

export type NotImplementedResponse = {
  implemented: false;
  module: string;
};

export function getHealth(): Promise<HealthResponse> {
  return Promise.reject(new Error("Not implemented"));
}

export function analyzePolicy(): Promise<NotImplementedResponse> {
  return Promise.reject(new Error("Not implemented"));
}

export function listSamples(): Promise<NotImplementedResponse> {
  return Promise.reject(new Error("Not implemented"));
}

export function getScan(): Promise<NotImplementedResponse> {
  return Promise.reject(new Error("Not implemented"));
}
