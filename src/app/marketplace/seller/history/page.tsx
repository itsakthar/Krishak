"use client";

import { useEffect, useState } from "react";

import { PageShell } from "@/components/page-shell";
import { RequireUser } from "@/components/route-guards";
import { useKrishak } from "@/components/krishak-provider";
import { Product } from "@/lib/data/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function SellerHistoryPage() {
  const { fetchMyProducts, language, translate } = useKrishak();
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setProducts(await fetchMyProducts());
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to load your listings.");
      }
    };

    void load();
  }, [fetchMyProducts]);

  return (
    <RequireUser>
      <PageShell backHref="/marketplace/seller" subtitle="Track every product submission and approval status here." title={translate("history")}>
        {message ? <div className="inline-message error">{message}</div> : null}

        <div className="list-stack">
          {products.map((product) => (
            <article className="simple-card" key={product.id}>
              <div className="listing-title-row">
                <strong>{product.name}</strong>
                <span className={`status-pill ${product.status}`}>{product.status}</span>
              </div>
              <p>
                {formatCurrency(product.price, language)} | {product.quantityValue} {product.unit}
              </p>
              <p>{product.location}</p>
              <p className="muted-text">{formatDate(product.createdAt, language)}</p>
            </article>
          ))}
        </div>

        {products.length === 0 ? <div className="empty-card">You have not submitted any products yet.</div> : null}
      </PageShell>
    </RequireUser>
  );
}
