import { ok, fail } from "@/lib/server/http";
import { loginAdmin } from "@/lib/server/demo-service";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { password: string };
    await loginAdmin(payload.password);
    return ok({ success: true });
  } catch (error) {
    return fail(error, 401);
  }
}
