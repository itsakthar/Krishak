import { Language } from "@/lib/data/types";
import { ok, fail } from "@/lib/server/http";
import { updateLanguage } from "@/lib/server/demo-service";

export async function PATCH(request: Request) {
  try {
    const payload = (await request.json()) as { language: Language };
    const user = await updateLanguage(payload.language);
    return ok({ user });
  } catch (error) {
    return fail(error, 401);
  }
}
