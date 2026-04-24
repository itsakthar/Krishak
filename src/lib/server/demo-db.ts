import { promises as fs } from "fs";
import path from "path";

import { DemoDatabase } from "@/lib/data/types";

const demoDbPath = path.join(process.cwd(), "data", "demo-db.json");

async function ensureDemoDb() {
  await fs.access(demoDbPath);
}

export async function readDemoDb(): Promise<DemoDatabase> {
  await ensureDemoDb();
  const raw = await fs.readFile(demoDbPath, "utf8");
  return JSON.parse(raw) as DemoDatabase;
}

export async function writeDemoDb(data: DemoDatabase) {
  await fs.writeFile(demoDbPath, JSON.stringify(data, null, 2), "utf8");
}

export async function updateDemoDb<T>(updater: (current: DemoDatabase) => T | Promise<T>) {
  const current = await readDemoDb();
  const result = await updater(current);
  await writeDemoDb(current);
  return result;
}
