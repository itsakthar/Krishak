"use client";

import Link from "next/link";
import { PropsWithChildren, ReactNode } from "react";

import { BottomNav } from "@/components/bottom-nav";
import { LanguageFab } from "@/components/language-fab";
import { useKrishak } from "@/components/krishak-provider";

interface PageShellProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  backHref?: string;
}

export function PageShell({ title, subtitle, action, backHref, children }: PageShellProps) {
  const { uiSettings } = useKrishak();

  return (
    <div className="app-shell">
      <header className="page-header">
        <div>
          {backHref ? (
            <Link className="back-link" href={backHref}>
              Back
            </Link>
          ) : null}
          <div className="brand-chip">Krishak</div>
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {action ? <div className="header-action">{action}</div> : null}
      </header>

      <section className="hero-card">
        <h2>{uiSettings.heroTitle}</h2>
        <p>{uiSettings.heroSubtitle}</p>
      </section>

      <main className="page-content">{children}</main>
      <BottomNav />
      <LanguageFab />
    </div>
  );
}
