/**
 * Pure-JS JSON key-value store for bot settings (mode, sudo, stickers, lang…)
 * No native dependencies — Termux friendly.
 */

import fs from "fs/promises";
import path from "path";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

/**
 * @param {string} filePath path to JSON file (default ./data/botkv.json)
 */
export async function createJsonKv(filePath = "./data/botkv.json") {
  const abs = path.resolve(filePath);
  await fs.mkdir(path.dirname(abs), { recursive: true });

  let cache = {};
  try {
    const raw = await fs.readFile(abs, "utf8");
    cache = JSON.parse(raw);
    if (typeof cache !== "object" || cache === null) cache = {};
  } catch {
    cache = {};
    await fs.writeFile(abs, "{}", "utf8");
  }

  async function persist() {
    const tmp = `${abs}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(cache, null, 2), "utf8");
    await fs.rename(tmp, abs);
  }

  return {
    async get(key) {
      return cache[key] ?? null;
    },
    async set(key, value) {
      return mutex.runExclusive(async () => {
        if (value === null || value === undefined) {
          delete cache[key];
        } else {
          cache[key] = value;
        }
        await persist();
      });
    },
    async del(key) {
      return mutex.runExclusive(async () => {
        delete cache[key];
        await persist();
      });
    },
  };
}
