"use client";

import { useState } from "react";

import { useKrishak } from "@/components/krishak-provider";
import { Labourer } from "@/lib/data/types";
import { formatCurrency } from "@/lib/utils";

interface LabourCardProps {
  labourer: Labourer;
  onChat: (labourer: Labourer) => void;
}

export function LabourCard({ labourer, onChat }: LabourCardProps) {
  const { createOrder, language, translate } = useKrishak();
  const [showActions, setShowActions] = useState(false);

  async function handleCall() {
    await createOrder("labour", labourer.id);
    window.alert(`Labour phone number: ${labourer.phone}`);
  }

  return (
    <article className="listing-card compact">
      <div className="listing-copy">
        <div className="listing-title-row">
          <h3>{labourer.name}</h3>
          <span className="price-pill">{formatCurrency(labourer.pricePerDay, language)}/day</span>
        </div>
        <p className="detail-line">{labourer.location}</p>
      </div>
      <div className="button-row">
        <button className="primary-button" onClick={() => setShowActions((current) => !current)} type="button">
          {translate("hire")}
        </button>
      </div>
      {showActions ? (
        <div className="mini-panel">
          <button className="panel-button" onClick={() => onChat(labourer)} type="button">
            {translate("chat")}
          </button>
          <button className="panel-button ghost" onClick={() => void handleCall()} type="button">
            {translate("call")}
          </button>
        </div>
      ) : null}
    </article>
  );
}
