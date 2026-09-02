#!/usr/bin/env node
"use strict";

const payload = {
  branch: process.env.BRANCH || "main",
  commit: process.env.COMMIT || "",
  repository: process.env.REPOSITORY || "iramyaseen/github-actions",
  tag: process.env.TAG || "latest",
  env: process.env.ENV || "prod",
  isApproved: process.env.IS_APPROVED === "true",
  approverName: process.env.APPROVER_NAME || "",
};

const sequences = [
  { name: "validate-payload", run: () => Boolean(payload.branch && payload.repository && payload.tag) },
  { name: "resolve-components", run: () => ["payment-service", "health-check"] },
  { name: "prepare-release-context", run: () => ({ ...payload, releaseId: `d01-${Date.now()}` }) },
];

const results = [];
for (const seq of sequences) {
  try {
    const output = seq.run();
    results.push({ name: seq.name, status: "success", output });
  } catch (err) {
    results.push({ name: seq.name, status: "failed", error: String(err.message || err) });
  }
}

const allSuccess = results.every((r) => r.status === "success");
const response = {
  status: allSuccess ? "success" : "failed",
  sequences: results,
  deploymentReady: allSuccess,
  returnData: results.find((r) => r.name === "prepare-release-context")?.output || payload,
};

console.log(JSON.stringify(response, null, 2));
process.exit(allSuccess ? 0 : 1);
