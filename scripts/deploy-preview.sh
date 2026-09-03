#!/usr/bin/env sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required before deploying." >&2
  exit 1
fi

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required before deploying." >&2
  exit 1
fi

echo "All Phase Electric preview deployment"
echo "Project: $ROOT_DIR"
echo

if ! npx --yes vercel@latest whoami >/dev/null 2>&1; then
  echo "Vercel login is required. Follow the login prompt, then this script will continue."
  npx --yes vercel@latest login
fi

echo "Running local verification before deployment..."
npm install
npm test
npm run typecheck
npm run build

echo
echo "Creating Vercel preview..."
npx --yes vercel@latest deploy --yes
