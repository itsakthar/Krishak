import { getCurrentUser } from "@/lib/server/demo-service";
import { ok, fail } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return ok({ user });
  } catch (error) {
    return fail(error);
  }
}
