import { ok, fail } from "@/lib/server/http";
import { registerUser } from "@/lib/server/demo-service";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const user = await registerUser(payload);
    return ok({ user }, 201);
  } catch (error) {
    return fail(error);
  }
}
