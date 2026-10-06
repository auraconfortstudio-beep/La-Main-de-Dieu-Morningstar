import dotenv from "dotenv";

dotenv.config();

/**
 * Morningstar / La Main de Dieu — Termux-first configuration
 * No Postgres / Sequelize / better-sqlite3.
 */

const config = {
  /** WhatsApp session directory (multi-file auth) */
  SESSION_DIR: process.env.SESSION_DIR || "./session",
  /** Bot settings JSON */
  KV_PATH: process.env.KV_PATH || "./data/botkv.json",
  LOG_LEVEL: process.env.LOG_LEVEL || "warn",
  /** Kept for compatibility with terminal wipe helpers */
  USE_POSTGRES: false,
  SQLITE_PATH: null,
  DATABASE_URL: null,
};

export default config;
