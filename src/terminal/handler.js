/**
 * Terminal Input Handler for MORNINGSTAR
 * Shortcuts: Q logout, R restart, A wipe auth DB
 */

import { clearAuthState } from "../database/authState.js";
import config from "../../config.js";
import fs from "fs/promises";

let connection = null;

export function setConnection(conn) {
  connection = conn;
}

async function logout() {
  console.log("\n🔄 Logging out...");

  try {
    if (connection) {
      try {
        await connection.logout();
        console.log("✅ Connection closed");
      } catch (err) {
        console.log("⚠️ Logout socket error:", err?.message || err);
      }
    }

    await clearAuthState();
    console.log("✅ Auth state cleared");
    console.log("✅ Logout complete!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during logout:", error);
    process.exit(1);
  }
}

async function restart() {
  console.log("\n🔄 Restarting bot...");

  try {
    if (connection) {
      try {
        await connection.end();
        console.log("✅ Connection closed gracefully");
      } catch (error) {
        console.log("⚠️ Connection already closed:", error?.message || error);
      }
    }
    console.log("✅ Restart initiated...\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during restart:", error);
    process.exit(1);
  }
}

async function wipeDatabase() {
  console.log("\n⚠️  SESSION WIPE INITIATED");

  try {
    await clearAuthState();

    const sessionDir = config.SESSION_DIR || "./session";
    try {
      const files = await fs.readdir(sessionDir).catch(() => []);
      for (const f of files) {
        await fs.unlink(`${sessionDir}/${f}`).catch(() => {});
      }
      console.log(`✅ Cleared session dir: ${sessionDir}`);
    } catch (err) {
      if (err.code !== "ENOENT") console.warn(err.message);
    }

    console.log("✅ Session wiped successfully!\n");
    console.log("⚠️  Please restart the bot manually.\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error wiping session:", error);
    process.exit(1);
  }
}

export function initTerminalHandler() {
  console.log("\n📝 Terminal shortcuts enabled:");
  console.log("   Type 'Q' + Enter - Logout and clear auth state");
  console.log("   Type 'R' + Enter - Restart the bot");
  console.log("   Type 'A' + Enter - Wipe session data");
  console.log("   Press Ctrl+C - Exit\n");

  process.stdin.setEncoding("utf8");
  if (process.stdin.isTTY) {
    process.stdin.resume();
  }

  process.stdin.on("data", async (data) => {
    const input = data.toString().trim().toUpperCase();

    if (input === "Q") {
      await logout();
    } else if (input === "R") {
      await restart();
    } else if (input === "A") {
      console.log("\n⚠️  WARNING: This will DELETE ALL AUTH DATABASE DATA!");
      console.log("⚠️  Type 'Y' and press Enter to confirm: ");

      process.stdin.once("data", async (confirmData) => {
        const confirm = confirmData.toString().trim().toUpperCase();
        if (confirm === "Y") {
          await wipeDatabase();
        } else {
          console.log("❌ Database wipe cancelled.\n");
        }
      });
    } else if (input.length > 0) {
      console.log(`⚠️  Unknown command: "${input}". Valid: Q, R, A`);
    }
  });

  process.on("SIGINT", async () => {
    console.log("\n👋 Shutting down...");
    if (connection) {
      try {
        await connection.end();
      } catch {
        /* ignore */
      }
    }
    process.exit(0);
  });
}
