import { ok, fail } from "@/lib/server/http";
import { startChat } from "@/lib/server/demo-service";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { type: "product" | "labour"; targetId: string };
    const chat = await startChat(payload.type, payload.targetId);
    return ok({ chat }, 201);
  } catch (error) {
    return fail(error, 401);
  }
}
