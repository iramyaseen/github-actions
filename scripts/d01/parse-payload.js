#!/usr/bin/env node
"use strict";

const raw = process.argv[2] || process.env.WEBHOOK_PAYLOAD || "{}";

let payload;
try {
  payload = typeof raw === "string" ? JSON.parse(raw) : raw;
} catch {
  payload = {};
}

const parsed = {
  branch: payload.branch || "main",
  commit: payload.commit || "",
  repository: payload.repository || "iramyaseen/github-actions",
  tag: payload.tag || "latest",
  isApproved: Boolean(payload.isApproved),
  approverName: payload.approverName || "None",
  approvedDate: payload.approvedDate || (payload.isApproved ? new Date().toISOString() : "None"),
  env: payload.env || "prod",
  inTimeWindow: Boolean(payload.inTimeWindow),
  authorizationStatus: payload.authorizationStatus || "NotAllowed",
};

console.log(JSON.stringify({ status: "parsed", payload: parsed }, null, 2));
