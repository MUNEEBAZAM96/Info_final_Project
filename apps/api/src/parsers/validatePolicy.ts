import type { PolicyDocument } from "../rules/types";

/** Future check: reject malformed JSON and objects that are not policy documents. */
export function validatePolicy(input: unknown): PolicyDocument {
  return input as PolicyDocument;
}
