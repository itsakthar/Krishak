import { ok, fail } from "@/lib/server/http";
import { getChat } from "@/lib/server/demo-service";

export const dynamic = "force-dynamic";

export async function GET(_: Request, context: { params: { chatId: string } }) {
  try {
    const chat = await getChat(context.params.chatId);
    return ok({ chat });
  } catch (error) {
    return fail(error, 404);
  }
}
