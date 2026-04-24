import { ok, fail } from "@/lib/server/http";
import { updateProfile } from "@/lib/server/demo-service";

export async function PATCH(request: Request) {
  try {
    const payload = await request.json();
    const user = await updateProfile(payload);
    return ok({ user });
  } catch (error) {
    return fail(error, 401);
  }
}
