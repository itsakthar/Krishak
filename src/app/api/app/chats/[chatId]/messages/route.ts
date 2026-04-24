import { ok, fail } from "@/lib/server/http";
import { sendChatMessage } from "@/lib/server/demo-service";

export async function POST(request: Request, context: { params: { chatId: string } }) {
  try {
    const payload = (await request.json()) as { text: string };
    const chat = await sendChatMessage(context.params.chatId, payload.text);
    return ok({ chat }, 201);
  } catch (error) {
    return fail(error, 401);
  }
}
