import { deleteAdminProduct, updateAdminProduct } from "@/lib/server/demo-service";
import { ok, fail } from "@/lib/server/http";

export async function PATCH(request: Request, context: { params: { productId: string } }) {
  try {
    const payload = await request.json();
    const product = await updateAdminProduct(context.params.productId, payload);
    return ok({ product });
  } catch (error) {
    return fail(error, 401);
  }
}

export async function DELETE(_: Request, context: { params: { productId: string } }) {
  try {
    await deleteAdminProduct(context.params.productId);
    return ok({ success: true });
  } catch (error) {
    return fail(error, 401);
  }
}
