# CloudGuard: Cloud Security Misconfiguration and Attack-Path Analyzer

Offline analysis of sample AWS IAM, trust, and S3 policies.

Repository: https://github.com/MUNEEBAZAM96/Info_final_Project

Rules, scoring, remediation, graph traversal, and persistence are stubs. This repository is a compiling skeleton. It does not detect misconfigurations or draw access paths yet.

## Commands

Install dependencies from the repository root:

```bash
npm install
```

Typecheck the web and API apps:

```bash
npm run typecheck
```

Run the API test suite:

```bash
npm test
```

Run the API and web app together:

```bash
npm run dev
```

Run one app:

```bash
npm run dev:api
npm run dev:web
```

The API listens on port 4000. The web app listens on port 3000.

## Layout

```text
dataset/
  secure/          sample policies intended to be treated as acceptable
  misconfigured/   sample policies with placeholder risky statements
  invalid/         malformed input for a future parser check
  expected/        empty labeled answer key for future evaluation
apps/web/          Next.js dashboard placeholders
  app/             home page and scan result page
  components/      upload, samples, findings, remediation, and empty graph
  lib/api.ts       unused API client stubs
apps/api/          Express API and analysis stubs
  src/routes/      placeholder HTTP routers
  src/parsers/     policy parsing stubs
  src/rules/       rule stubs for IAM, trust, and S3
  src/scoring/     severity stub
  src/remediation/ remediation stub
  src/graph/       empty graph model and traversal stubs
  src/db/          commented scan schema and persistence stubs
  tests/           stub behavior checks
```
