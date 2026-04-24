"use client";

import { useRouter } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { RequireUser } from "@/components/route-guards";
import { useKrishak } from "@/components/krishak-provider";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const { cartProductIds, clearCart, language, products, removeFromCart, startChat } = useKrishak();

  const items = products.filter((product) => cartProductIds.includes(product.id));
  const total = items.reduce((sum, item) => sum + item.price, 0);

  async function handleOrderNow(productId: string) {
    const chat = await startChat("product", productId);
    router.push(`/chat/${chat.id}`);
  }

  return (
    <RequireUser>
      <PageShell backHref="/marketplace" subtitle="Your saved products stay here until you are ready to contact the seller." title="Cart">
        <div className="summary-card">
          <strong>{items.length} items saved</strong>
          <span>{formatCurrency(total, language)}</span>
        </div>

        <div className="list-stack">
          {items.map((item) => (
            <article className="simple-card" key={item.id}>
              <div className="listing-title-row">
                <strong>{item.name}</strong>
                <span>{formatCurrency(item.price, language)}</span>
              </div>
              <p>
                {item.quantityValue} {item.unit}
              </p>
              <p>{item.location}</p>
              <div className="button-row">
                <button className="secondary-button" onClick={() => removeFromCart(item.id)} type="button">
                  Remove
                </button>
                <button className="primary-button" onClick={() => void handleOrderNow(item.id)} type="button">
                  Order Now
                </button>
              </div>
            </article>
          ))}
        </div>

        {items.length === 0 ? <div className="empty-card">Your cart is empty. Add products from the marketplace.</div> : null}

        {items.length > 0 ? (
          <button className="ghost-block-button" onClick={clearCart} type="button">
            Clear Cart
          </button>
        ) : null}
      </PageShell>
    </RequireUser>
  );
}
