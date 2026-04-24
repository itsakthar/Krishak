import { ok, fail } from "@/lib/server/http";
import { updateAdminOrder } from "@/lib/server/demo-service";

export async function PATCH(request: Request, context: { params: { orderId: string } }) {
  try {
    const payload = await request.json();
    const order = await updateAdminOrder(context.params.orderId, payload);
    return ok({ order });
  } catch (error) {
    return fail(error, 401);
  }
}
