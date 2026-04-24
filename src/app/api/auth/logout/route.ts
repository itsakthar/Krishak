import { ok, fail } from "@/lib/server/http";
import { logoutUser } from "@/lib/server/demo-service";

export async function POST() {
  try {
    await logoutUser();
    return ok({ success: true });
  } catch (error) {
    return fail(error);
  }
}
