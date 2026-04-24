"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useKrishak } from "@/components/krishak-provider";

const navItems = [
  { href: "/marketplace", labelKey: "marketplace" },
  { href: "/labour", labelKey: "labours" },
  { href: "/orders", labelKey: "orders" },
  { href: "/profile", labelKey: "profile" }
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { translate } = useKrishak();

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const active = pathname.startsWith(item.href);
        return (
          <Link className={`nav-link ${active ? "active" : ""}`} href={item.href} key={item.href}>
            <span>{translate(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
