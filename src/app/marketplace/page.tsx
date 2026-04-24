"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { ProductCard } from "@/components/product-card";
import { RequireUser } from "@/components/route-guards";
import { useKrishak } from "@/components/krishak-provider";
import { Product } from "@/lib/data/types";

export default function MarketplacePage() {
  const router = useRouter();
  const { products, startChat, translate } = useKrishak();

  async function handleChat(product: Product) {
    const chat = await startChat("product", product.id);
    router.push(`/chat/${chat.id}`);
  }

  return (
    <RequireUser>
      <PageShell
        action={
          <div className="header-links">
            <Link className="ghost-link" href="/cart">
              {translate("cart")}
            </Link>
            <Link className="primary-link" href="/marketplace/seller">
              {translate("seller")}
            </Link>
          </div>
        }
        subtitle="Browse approved farm products, connect directly, and place quick orders."
        title={translate("marketplace")}
      >
        <section className="card-grid">
          {products.map((product) => (
            <ProductCard key={product.id} onChat={handleChat} product={product} />
          ))}
        </section>

        {products.length === 0 ? (
          <div className="empty-card">No approved products yet. New listings will appear here after admin approval.</div>
        ) : null}
      </PageShell>
    </RequireUser>
  );
}
