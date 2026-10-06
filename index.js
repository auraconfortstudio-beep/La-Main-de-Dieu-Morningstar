import fs from "fs/promises";
import path from "path";
import connect from "./src/socket/connection.js";
import { commands } from "./src/plugins.js";
import { initTerminalHandler } from "./src/terminal/handler.js";
import { useMultiDbAuthState, checkAuthCreds } from "./src/database/authState.js";
import config from "./config.js";

global.__basedir = path.resolve();

const readAndRequireFiles = async (directory) => {
  try {
    const files = await fs.readdir(directory);
    const jsFiles = files.filter((file) => file.endsWith(".js"));
    await Promise.all(
      jsFiles.map((file) =>
        import(`file://${path.join(directory, file).replace(/\\/g, "/")}`)
      )
    );
  } catch (error) {
    console.error("Error loading files:", error);
    throw error;
  }
};

const initialize = async () => {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║     LA MAIN DE DIEU — MORNINGSTAR        ║");
  console.log("║         ELOHIM — THE ETERNAL             ║");
  console.log("║         Baileys 7 · Termux-ready         ║");
  console.log("╚══════════════════════════════════════════╝\n");

  try {
    console.log(`⏳ Initializing session (${config.SESSION_DIR})...`);
    await useMultiDbAuthState();

    const credsCheck = await checkAuthCreds();
    if (credsCheck.hasCreds) {
      console.log("✅ Credentials found");
    } else if (process.env.PAIRING_NUMBER) {
      console.log(
        `ℹ️  No credentials — pairing code login (${process.env.PAIRING_NUMBER.replace(/\D/g, "")})`
      );
    } else {
      console.log(
        "ℹ️  No credentials — QR login (or set PAIRING_NUMBER for code login)"
      );
    }

    await readAndRequireFiles(path.join(global.__basedir, "src/plugins"));
    console.log(`✅ ${commands.length} Plugins Loaded!`);

    initTerminalHandler();

    // Optional enterprise admin HTTP (localhost + token) — disabled by default
    if (process.env.ADMIN_HTTP_PORT) {
      try {
        const { startAdminHttp } = await import("./src/enterprise/adminHttp.js");
        startAdminHttp();
      } catch (err) {
        console.warn("Admin HTTP not started:", err?.message || err);
      }
    }

    console.log("⏳ Connecting to WhatsApp...\n");
    await connect();
  } catch (error) {
    console.error("❌ Initialization error:", error);
    process.exit(1);
  }
};

initialize();
