"use client";

import Image from "next/image";
import { useState } from "react";

import { useKrishak } from "@/components/krishak-provider";
import { Product } from "@/lib/data/types";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onChat: (product: Product) => void;
}

export function ProductCard({ product, onChat }: ProductCardProps) {
  const { addToCart, createOrder, language, translate } = useKrishak();
  const [showActions, setShowActions] = useState(false);
  const [calling, setCalling] = useState(false);

  async function handleCall() {
    setCalling(true);
    try {
      await createOrder("product", product.id);
      window.alert(`Seller phone number: ${product.sellerPhone}`);
    } finally {
      setCalling(false);
    }
  }

  return (
    <article className="listing-card">
      <div className="listing-image-wrap">
        <Image alt={product.name} className="listing-image" fill sizes="(max-width: 768px) 100vw, 33vw" src={product.imageUrl} />
      </div>
      <div className="listing-copy">
        <div className="listing-title-row">
          <h3>{product.name}</h3>
          <span className="price-pill">{formatCurrency(product.price, language)}</span>
        </div>
        <p className="detail-line">
          {product.quantityValue} {product.unit}
        </p>
        <p className="detail-line">{product.location}</p>
        <p className="muted-text">{product.description}</p>
      </div>
      <div className="button-row">
        <button className="secondary-button" onClick={() => addToCart(product.id)} type="button">
          {translate("addToCart")}
        </button>
        <button className="primary-button" onClick={() => setShowActions((current) => !current)} type="button">
          {translate("order")}
        </button>
      </div>
      {showActions ? (
        <div className="mini-panel">
          <button className="panel-button" onClick={() => onChat(product)} type="button">
            {translate("chat")}
          </button>
          <button className="panel-button ghost" disabled={calling} onClick={() => void handleCall()} type="button">
            {translate("call")}
          </button>
        </div>
      ) : null}
    </article>
  );
}
