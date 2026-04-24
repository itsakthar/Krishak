import { ok, fail } from "@/lib/server/http";
import { loginUser } from "@/lib/server/demo-service";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const user = await loginUser(payload);
    return ok({ user });
  } catch (error) {
    return fail(error, 401);
  }
}
