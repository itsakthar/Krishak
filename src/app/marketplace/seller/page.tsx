"use client";

import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { RequireUser } from "@/components/route-guards";
import { useKrishak } from "@/components/krishak-provider";

export default function SellerPage() {
  const { translate } = useKrishak();

  return (
    <RequireUser>
      <PageShell backHref="/marketplace" subtitle="Manage your selling activity with two simple steps." title={translate("sellerTools")}>
        <div className="option-stack">
          <Link className="option-card" href="/marketplace/seller/new">
            <strong>{translate("newSell")}</strong>
            <span>Create a new product listing for admin approval.</span>
          </Link>
          <Link className="option-card" href="/marketplace/seller/history">
            <strong>{translate("history")}</strong>
            <span>Check pending, approved, and rejected listings.</span>
          </Link>
          <Link className="option-card muted" href="/marketplace">
            <strong>{translate("goBack")}</strong>
            <span>Return to the main marketplace.</span>
          </Link>
        </div>
      </PageShell>
    </RequireUser>
  );
}
