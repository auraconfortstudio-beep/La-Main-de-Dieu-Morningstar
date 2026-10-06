/**
 * Auth State Factory — pure JS (Termux-ready)
 * Multi-file Baileys session + JSON BotKV
 */

import { attachBotKv, seedBotKvFromEnv } from "./botKv.js";
import { useFileAuthState } from "./authFile.js";
import { createJsonKv } from "./jsonKv.js";
import config from "../../config.js";

let initPromise = null;
let activeBackend = null;

async function initBackend() {
  const sessionDir = config.SESSION_DIR || "./session";
  const kvPath = config.KV_PATH || "./data/botkv.json";

  const fileAuth = await useFileAuthState(sessionDir);
  const botKv = await createJsonKv(kvPath);

  activeBackend = {
    ...fileAuth,
    botKv,
  };

  console.log(`✅ Auth backend: multi-file session (${sessionDir})`);
  console.log(`✅ BotKV: JSON (${kvPath})`);

  attachBotKv(botKv);
  await seedBotKvFromEnv();

  return activeBackend;
}

/**
 * Initialize once and return Baileys-compatible auth state.
 * @returns {Promise<{ state: object, saveCreds: Function }>}
 */
export async function useMultiDbAuthState() {
  if (!initPromise) {
    initPromise = initBackend();
  }
  const backend = await initPromise;
  return {
    state: backend.state,
    saveCreds: backend.saveCreds,
  };
}

/**
 * Clear all auth state (logout / reset)
 */
export async function clearAuthState() {
  if (!initPromise) {
    await useMultiDbAuthState();
  }
  await initPromise;
  if (activeBackend?.clearAuthState) {
    await activeBackend.clearAuthState();
    console.log("Cleared auth state");
  }
}

/**
 * Cheap creds existence check
 */
export async function checkAuthCreds() {
  if (!initPromise) {
    await useMultiDbAuthState();
  }
  await initPromise;
  const has =
    typeof activeBackend.hasCreds === "function"
      ? await activeBackend.hasCreds()
      : false;

  return {
    valid: !!has,
    hasCreds: !!has,
  };
}

/**
 * @deprecated Prefer checkAuthCreds
 */
export async function validateAuthState() {
  const result = await checkAuthCreds();
  return {
    valid: result.hasCreds,
    issues: result.hasCreds ? [] : ["No credentials found"],
    stats: null,
  };
}

export async function getAuthStateStats() {
  return null;
}
