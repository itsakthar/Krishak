import { deleteAdminLabour, updateAdminLabour } from "@/lib/server/demo-service";
import { ok, fail } from "@/lib/server/http";

export async function PATCH(request: Request, context: { params: { labourId: string } }) {
  try {
    const payload = await request.json();
    const labourer = await updateAdminLabour(context.params.labourId, payload);
    return ok({ labourer });
  } catch (error) {
    return fail(error, 401);
  }
}

export async function DELETE(_: Request, context: { params: { labourId: string } }) {
  try {
    await deleteAdminLabour(context.params.labourId);
    return ok({ success: true });
  } catch (error) {
    return fail(error, 401);
  }
}
