import type { PolicyDocument } from "../rules/types";

export class PolicyValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PolicyValidationError";
  }
}

export interface NormalizedStatement {
  Sid?: string;
  Effect: "Allow";
  Action: string[];
  NotAction: string[];
  Resource: string[];
  NotResource: string[];
  Principal: string[];
}

export interface NormalizedPolicy {
  Version?: string;
  Statement: NormalizedStatement[];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringList(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return [];
}

function principalList(value: unknown): string[] {
  if (value === undefined || value === null) {
    return [];
  }
  if (typeof value === "string") {
    return [value];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => principalList(item));
  }
  if (!isPlainObject(value)) {
    return [];
  }

  return Object.values(value).flatMap((entry) => stringList(entry));
}

function normalizeStatement(statement: Record<string, unknown>): NormalizedStatement {
  return {
    Sid: typeof statement.Sid === "string" ? statement.Sid : undefined,
    Effect: "Allow",
    Action: stringList(statement.Action),
    NotAction: stringList(statement.NotAction),
    Resource: stringList(statement.Resource),
    NotResource: stringList(statement.NotResource),
    Principal: principalList(statement.Principal),
  };
}

export function validatePolicy(input: unknown): NormalizedPolicy {
  if (!isPlainObject(input)) {
    throw new PolicyValidationError("This file is not valid JSON.");
  }
  if (!("Statement" in input)) {
    throw new PolicyValidationError("Policy must include a Statement.");
  }

  const statementInput = input.Statement;
  const statements = Array.isArray(statementInput) ? statementInput : [statementInput];
  if (statements.some((statement) => !isPlainObject(statement))) {
    throw new PolicyValidationError("Each statement must be an object.");
  }

  return {
    Version: typeof input.Version === "string" ? input.Version : undefined,
    Statement: statements
      .filter((statement) => statement.Effect === "Allow")
      .map((statement) => normalizeStatement(statement)),
  };
}

export function readAllowStatements(input: PolicyDocument | unknown): NormalizedStatement[] {
  try {
    return validatePolicy(input).Statement;
  } catch {
    return [];
  }
}
