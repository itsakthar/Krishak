import { UiSettings } from "@/lib/data/types";
import { ok, fail } from "@/lib/server/http";
import { updateUiSettings } from "@/lib/server/demo-service";

export async function PATCH(request: Request) {
  try {
    const payload = (await request.json()) as UiSettings;
    const uiSettings = await updateUiSettings(payload);
    return ok({ uiSettings });
  } catch (error) {
    return fail(error, 401);
  }
}
