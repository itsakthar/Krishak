import { getAdminDashboard } from "@/lib/server/demo-service";
import { ok, fail } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dashboard = await getAdminDashboard();
    return ok(dashboard);
  } catch (error) {
    return fail(error, 401);
  }
}
