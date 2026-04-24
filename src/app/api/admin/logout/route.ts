import { ok, fail } from "@/lib/server/http";
import { logoutAdmin } from "@/lib/server/demo-service";

export async function POST() {
  try {
    await logoutAdmin();
    return ok({ success: true });
  } catch (error) {
    return fail(error);
  }
}
