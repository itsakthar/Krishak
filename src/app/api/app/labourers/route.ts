import { readDemoDb } from "@/lib/server/demo-db";
import { createLabourSubmission } from "@/lib/server/demo-service";
import { ok, fail } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const demoDb = await readDemoDb();
    return ok({ labourers: demoDb.labourers.filter((labourer) => labourer.status === "approved") });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const labourer = await createLabourSubmission(payload);
    return ok({ labourer }, 201);
  } catch (error) {
    return fail(error);
  }
}
