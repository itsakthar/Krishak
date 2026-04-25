import { promises as fs } from "fs";
import os from "os";
import path from "path";

import { DemoDatabase } from "@/lib/data/types";

const seedDbPath = path.join(process.cwd(), "data", "demo-db.json");
const serverlessDbPath = path.join(os.tmpdir(), "krishak", "demo-db.json");

function isServerlessRuntime() {
  return Boolean(
    process.env.VERCEL ||
      process.env.NETLIFY ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.LAMBDA_TASK_ROOT
  );
}

function getDemoDbPath() {
  return process.env.KRISHAK_DEMO_DB_PATH || (isServerlessRuntime() ? serverlessDbPath : seedDbPath);
}

async function ensureDemoDb() {
  const demoDbPath = getDemoDbPath();

  try {
    await fs.access(demoDbPath);
    return demoDbPath;
  } catch {
    if (demoDbPath === seedDbPath) {
      await fs.access(seedDbPath);
      return seedDbPath;
    }
  }

  await fs.mkdir(path.dirname(demoDbPath), { recursive: true });
  await fs.copyFile(seedDbPath, demoDbPath);
  return demoDbPath;
}

async function ensureWritableDemoDb() {
  const demoDbPath = await ensureDemoDb();
  await fs.access(demoDbPath);
  return demoDbPath;
}

export async function readDemoDb(): Promise<DemoDatabase> {
  const demoDbPath = await ensureDemoDb();
  const raw = await fs.readFile(demoDbPath, "utf8");
  return JSON.parse(raw) as DemoDatabase;
}

export async function writeDemoDb(data: DemoDatabase) {
  const demoDbPath = await ensureWritableDemoDb();
  await fs.writeFile(demoDbPath, JSON.stringify(data, null, 2), "utf8");
}

export async function updateDemoDb<T>(updater: (current: DemoDatabase) => T | Promise<T>) {
  const current = await readDemoDb();
  const result = await updater(current);
  await writeDemoDb(current);
  return result;
}
