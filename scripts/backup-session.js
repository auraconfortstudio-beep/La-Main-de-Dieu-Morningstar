/**
 * Backup session + botkv for Termux
 * Usage: npm run backup-session
 */
import fs from "fs/promises";
import path from "path";
import { execSync } from "child_process";

const SESSION = process.env.SESSION_DIR || "./session";
const KV = process.env.KV_PATH || "./data/botkv.json";
const OUT = process.env.BACKUP_DIR || "./backups";

async function main() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  await fs.mkdir(OUT, { recursive: true });
  const archive = path.join(OUT, `session-backup-${stamp}.tar.gz`);
  const parts = [];
  try {
    await fs.access(SESSION);
    parts.push(SESSION);
  } catch { /* missing */ }
  try {
    await fs.access(KV);
    parts.push(path.dirname(KV) === "." ? KV : path.dirname(KV));
  } catch { /* missing */ }
  if (!parts.length) {
    console.error("Nothing to backup (no session/data).");
    process.exit(1);
  }
  execSync(`tar -czf "${archive}" ${parts.join(" ")}`, { stdio: "inherit" });
  console.log("✅ Backup:", archive);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
