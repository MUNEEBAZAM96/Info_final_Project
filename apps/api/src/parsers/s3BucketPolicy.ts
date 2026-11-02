import type { PolicyDocument } from "../rules/types";

/** Future check: read an S3 bucket policy principal, action, and resource. */
export function parseS3BucketPolicy(policy: PolicyDocument): PolicyDocument {
  return policy;
}
