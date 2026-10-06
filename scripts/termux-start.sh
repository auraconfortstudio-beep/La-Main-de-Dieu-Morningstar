#!/data/data/com.termux/files/usr/bin/bash
# MORNINGSTAR — Termux launcher with wake-lock
set -e
cd "$(dirname "$0")/.."
if command -v termux-wake-lock >/dev/null 2>&1; then
  termux-wake-lock || true
fi
export NODE_ENV=production
exec node index.js
