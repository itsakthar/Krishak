import { readDemoDb } from "@/lib/server/demo-db";
import { createProductSubmission, listSellerProducts } from "@/lib/server/demo-service";
import { ok, fail } from "@/lib/server/http";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope");

    if (scope === "mine") {
      const products = await listSellerProducts();
      return ok({ products });
    }

    const demoDb = await readDemoDb();
    return ok({ products: demoDb.products.filter((product) => product.status === "approved") });
  } catch (error) {
    return fail(error, 401);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const product = await createProductSubmission(payload);
    return ok({ product }, 201);
  } catch (error) {
    return fail(error);
  }
}
