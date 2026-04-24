import { ok, fail } from "@/lib/server/http";
import { createOrder, listMyOrders } from "@/lib/server/demo-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await listMyOrders();
    return ok({ orders });
  } catch (error) {
    return fail(error, 401);
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { type: "product" | "labour"; targetId: string };
    const order = await createOrder(payload.type, payload.targetId);
    return ok({ order }, 201);
  } catch (error) {
    return fail(error, 401);
  }
}
