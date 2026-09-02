#!/usr/bin/env bash
set -euo pipefail

REPO="${REPOSITORY:-iramyaseen/github-actions}"
TAG="${TAG:-latest}"
WORK_DIR="${WORK_DIR:-/tmp/d01-release}"

echo "[d01] Setting up release environment for ${REPO}@${TAG}"

mkdir -p "${WORK_DIR}"
cd "${WORK_DIR}"

# Fetch official repo
if [ ! -d "github-actions/.git" ]; then
  git clone --depth 1 "https://github.com/${REPO}.git" github-actions
fi

cd github-actions
git fetch --depth 1 origin "${TAG}" 2>/dev/null || git fetch --depth 1 origin main
git checkout "${TAG}" 2>/dev/null || git checkout main

# Install Python SDK (custom)
if command -v python3 >/dev/null 2>&1; then
  python3 -m pip install --quiet --upgrade pip
  python3 -m pip install --quiet boto3 requests pyyaml 2>/dev/null || true
fi

# Install AWS CLI
if ! command -v aws >/dev/null 2>&1; then
  if command -v pip3 >/dev/null 2>&1; then
    pip3 install --quiet awscli
  elif command -v apk >/dev/null 2>&1; then
    apk add --no-cache aws-cli
  fi
fi

# Install yaseen-utils-sdk
if command -v pip3 >/dev/null 2>&1; then
  pip3 install --quiet yaseen-utils-sdk 2>/dev/null || echo "[d01] yaseen-utils-sdk optional install skipped"
fi

echo "[d01] Environment ready at ${WORK_DIR}/github-actions"
echo "{\"status\":\"ready\",\"repository\":\"${REPO}\",\"tag\":\"${TAG}\",\"workDir\":\"${WORK_DIR}/github-actions\"}"
