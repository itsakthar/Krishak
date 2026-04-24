"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { LabourCard } from "@/components/labour-card";
import { PageShell } from "@/components/page-shell";
import { RequireUser } from "@/components/route-guards";
import { useKrishak } from "@/components/krishak-provider";
import { Labourer } from "@/lib/data/types";

export default function LabourPage() {
  const router = useRouter();
  const { labourers, startChat } = useKrishak();

  async function handleChat(labourer: Labourer) {
    const chat = await startChat("labour", labourer.id);
    router.push(`/chat/${chat.id}`);
  }

  return (
    <RequireUser>
      <PageShell
        action={
          <Link className="primary-link" href="/labour/register">
            As a Labour
          </Link>
        }
        subtitle="Browse approved labour profiles and contact them with one tap."
        title="Labours"
      >
        <section className="card-grid">
          {labourers.map((labourer) => (
            <LabourCard key={labourer.id} labourer={labourer} onChat={handleChat} />
          ))}
        </section>
        {labourers.length === 0 ? <div className="empty-card">No approved labour profiles yet.</div> : null}
      </PageShell>
    </RequireUser>
  );
}
