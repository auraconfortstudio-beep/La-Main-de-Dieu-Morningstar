/**
 * Pure-JS multi-file auth state for Termux / Android
 * Uses Baileys useMultiFileAuthState — no native modules.
 */

import { useMultiFileAuthState, initAuthCreds } from "baileys";
import fs from "fs/promises";
import path from "path";

/**
 * @param {string} sessionDir directory for session files (default ./session)
 * @returns {Promise<{ state, saveCreds, clearAuthState, hasCreds, botKv }>}
 */
export async function useFileAuthState(sessionDir = "./session") {
  const abs = path.resolve(sessionDir);
  await fs.mkdir(abs, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(abs);

  const clearAuthState = async () => {
    try {
      const files = await fs.readdir(abs);
      await Promise.all(
        files.map((f) =>
          fs.unlink(path.join(abs, f)).catch(() => {})
        )
      );
      // Reset in-memory to empty creds so next connect requests QR/pairing
      if (state.creds) {
        Object.assign(state.creds, initAuthCreds());
      }
    } catch (err) {
      console.error("[auth-file] clear failed:", err?.message || err);
    }
  };

  const hasCreds = async () => {
    try {
      const credsPath = path.join(abs, "creds.json");
      await fs.access(credsPath);
      const raw = await fs.readFile(credsPath, "utf8");
      const data = JSON.parse(raw);
      return !!(data?.me || data?.registered);
    } catch {
      return false;
    }
  };

  return {
    state,
    saveCreds,
    clearAuthState,
    hasCreds,
  };
}
