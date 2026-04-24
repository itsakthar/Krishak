"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { RequireUser } from "@/components/route-guards";
import { useKrishak } from "@/components/krishak-provider";
import { ChatRoom } from "@/lib/data/types";
import { formatDate } from "@/lib/utils";

export default function ChatPage() {
  const params = useParams<{ chatId: string }>();
  const { currentUser, fetchChat, language, sendMessage } = useKrishak();
  const [chat, setChat] = useState<ChatRoom | null>(null);
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadChat = async () => {
      try {
        const response = await fetchChat(params.chatId);
        if (mounted) {
          setChat(response);
        }
      } catch (error) {
        if (mounted) {
          setMessage(error instanceof Error ? error.message : "Unable to load chat.");
        }
      }
    };

    void loadChat();
    const interval = window.setInterval(() => void loadChat(), 4000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, [fetchChat, params.chatId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) {
      return;
    }

    try {
      const updated = await sendMessage(params.chatId, text);
      setChat(updated);
      setText("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send message.");
    }
  }

  return (
    <RequireUser>
      <PageShell backHref="/orders" subtitle="Real-time style buyer and seller messaging for fast negotiation." title={chat?.title || "Farmers Chat"}>
        {message ? <div className="inline-message error">{message}</div> : null}
        <section className="chat-card">
          <div className="chat-thread">
            {chat?.messages.map((entry) => {
              const mine = entry.senderId === currentUser?.id;
              return (
                <div className={`chat-bubble ${mine ? "mine" : ""}`} key={entry.id}>
                  <strong>{entry.senderName}</strong>
                  <p>{entry.text}</p>
                  <span>{formatDate(entry.createdAt, language)}</span>
                </div>
              );
            })}
          </div>
          <form className="chat-form" onSubmit={handleSubmit}>
            <textarea onChange={(event) => setText(event.target.value)} placeholder="Type your message" rows={2} value={text} />
            <button className="primary-button" type="submit">
              Send
            </button>
          </form>
        </section>
      </PageShell>
    </RequireUser>
  );
}
