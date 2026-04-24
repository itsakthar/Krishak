import { getBootstrapData } from "@/lib/server/demo-service";
import { ok, fail } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getBootstrapData();
    return ok(data);
  } catch (error) {
    return fail(error);
  }
}
