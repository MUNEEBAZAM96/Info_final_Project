import iamExcessivePrivilege from "../fixtures/policies/iam-excessive-privilege.json";
import iamLeastPrivilege from "../fixtures/policies/iam-least-privilege.json";
import iamWildcardAction from "../fixtures/policies/iam-wildcard-action.json";
import iamWildcardResource from "../fixtures/policies/iam-wildcard-resource.json";
import s3PrivateBucket from "../fixtures/policies/s3-private-bucket.json";
import s3PublicAccess from "../fixtures/policies/s3-public-access.json";
import trustBroadPrincipal from "../fixtures/policies/trust-broad-principal.json";
import trustRestrictedPrincipal from "../fixtures/policies/trust-restricted-principal.json";
import type { Finding, PolicyDocument, SamplePolicy } from "./types";

export const samples: SamplePolicy[] = [
  {
    id: "iam-least-privilege",
    fileName: "iam-least-privilege.json",
    title: "IAM least privilege",
    group: "secure",
    policy: iamLeastPrivilege as PolicyDocument,
  },
  {
    id: "trust-restricted-principal",
    fileName: "trust-restricted-principal.json",
    title: "Restricted role trust",
    group: "secure",
    policy: trustRestrictedPrincipal as PolicyDocument,
  },
  {
    id: "s3-private-bucket",
    fileName: "s3-private-bucket.json",
    title: "Private bucket policy",
    group: "secure",
    policy: s3PrivateBucket as PolicyDocument,
  },
  {
    id: "iam-wildcard-action",
    fileName: "iam-wildcard-action.json",
    title: "IAM wildcard action",
    group: "misconfigured",
    policy: iamWildcardAction as PolicyDocument,
  },
  {
    id: "iam-wildcard-resource",
    fileName: "iam-wildcard-resource.json",
    title: "IAM wildcard resource",
    group: "misconfigured",
    policy: iamWildcardResource as PolicyDocument,
  },
  {
    id: "iam-excessive-privilege",
    fileName: "iam-excessive-privilege.json",
    title: "IAM excessive privilege",
    group: "misconfigured",
    policy: iamExcessivePrivilege as PolicyDocument,
  },
  {
    id: "trust-broad-principal",
    fileName: "trust-broad-principal.json",
    title: "Broad role trust",
    group: "misconfigured",
    policy: trustBroadPrincipal as PolicyDocument,
  },
  {
    id: "s3-public-access",
    fileName: "s3-public-access.json",
    title: "Public bucket access",
    group: "misconfigured",
    policy: s3PublicAccess as PolicyDocument,
  },
];

const findingsBySampleId: Record<string, Finding[]> = {
  "iam-wildcard-action": [
    {
      id: "iam-wildcard-action-1",
      ruleId: "iam-wildcard-action",
      severity: "High",
      title: "Wildcard action",
      evidence: 'Statement Sid AllowAllActions uses Action "*".',
      impact: "The statement allows every action on one object.",
      remediation:
        'Replace Action "*" with the specific action the workload needs, such as s3:GetObject.',
    },
  ],
  "iam-wildcard-resource": [
    {
      id: "iam-wildcard-resource-1",
      ruleId: "iam-wildcard-resource",
      severity: "High",
      title: "Wildcard resource",
      evidence: 'Statement Sid AllowAllResources uses Resource "*".',
      impact: "s3:GetObject applies to every resource.",
      remediation: 'Replace Resource "*" with the required object ARN.',
    },
  ],
  "iam-excessive-privilege": [
    {
      id: "iam-excessive-privilege-1",
      ruleId: "iam-excessive-privilege",
      severity: "Critical",
      title: "Administrator-style permission",
      evidence: 'Statement Sid AdministratorStyleAccess uses Action "*" and Resource "*".',
      impact: "The statement grants every action on every resource.",
      remediation: "Replace both wildcards with the required actions and resource ARNs.",
    },
  ],
  "trust-broad-principal": [
    {
      id: "trust-broad-principal-1",
      ruleId: "trust-broad-principal",
      severity: "High",
      title: "Role trust allows any principal",
      evidence: 'Statement Sid AllowAnyPrincipal uses Principal "*" and Action sts:AssumeRole.',
      impact: "Any principal may be allowed to assume the role.",
      remediation: "Set Principal to the specific trusted account or role ARN.",
    },
  ],
  "s3-public-access": [
    {
      id: "s3-public-access-1",
      ruleId: "s3-public-access",
      severity: "Critical",
      title: "Bucket policy allows public read",
      evidence: 'Statement Sid AllowPublicRead uses Principal "*" and Action s3:GetObject.',
      impact: "Anyone may be able to read objects covered by the resource.",
      remediation: 'Remove Principal "*" and allow only the required account or role.',
    },
  ],
};

export function getSample(id: string): SamplePolicy | undefined {
  return samples.find((sample) => sample.id === id);
}

export function getFindings(sampleId: string): Finding[] {
  return findingsBySampleId[sampleId] ?? [];
}

export function findSampleByPolicy(policy: PolicyDocument): SamplePolicy | undefined {
  const serialized = JSON.stringify(policy);
  return samples.find((sample) => JSON.stringify(sample.policy) === serialized);
}
