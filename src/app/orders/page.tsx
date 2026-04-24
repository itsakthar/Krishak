"use client";

import Link from "next/link";

import { PageShell } from "@/components/page-shell";
import { RequireUser } from "@/components/route-guards";
import { useKrishak } from "@/components/krishak-provider";
import { formatDate } from "@/lib/utils";

export default function OrdersPage() {
  const { chats, language, orders } = useKrishak();

  return (
    <RequireUser>
      <PageShell
        action={
          <Link className="ghost-link" href="/cart">
            Cart
          </Link>
        }
        subtitle="Track contact requests, orders, and active conversations."
        title="Orders & Chats"
      >
        <section className="section-stack">
          <div className="section-head">
            <h2>Orders</h2>
          </div>
          <div className="list-stack">
            {orders.map((order) => (
              <article className="simple-card" key={order.id}>
                <div className="listing-title-row">
                  <strong>{order.title}</strong>
                  <span className={`status-pill ${order.status}`}>{order.status}</span>
                </div>
                <p>{order.sellerName}</p>
                <p className="muted-text">{formatDate(order.createdAt, language)}</p>
              </article>
            ))}
          </div>
          {orders.length === 0 ? <div className="empty-card">No orders yet. Use chat or call from a listing to create one.</div> : null}
        </section>

        <section className="section-stack">
          <div className="section-head">
            <h2>Farmers Chat</h2>
          </div>
          <div className="list-stack">
            {chats.map((chat) => (
              <Link className="simple-card link-card" href={`/chat/${chat.id}`} key={chat.id}>
                <div className="listing-title-row">
                  <strong>{chat.title}</strong>
                  <span className="muted-text">{formatDate(chat.lastMessageAt, language)}</span>
                </div>
                <p>{chat.lastMessage}</p>
              </Link>
            ))}
          </div>
          {chats.length === 0 ? <div className="empty-card">No chats started yet.</div> : null}
        </section>
      </PageShell>
    </RequireUser>
  );
}
