import { useCallback, useRef, useState } from "react";
import { OFFLINE_REPLY, sendChatMessage } from "./chatApi";

export type ChatRole = "assistant" | "user";

export interface ChatMessage {
  id: number;
  role: ChatRole;
  text: string;
  /** True until the typewriter has finished revealing this message. */
  isTyping: boolean;
}

const GREETING: ChatMessage = {
  id: 0,
  role: "assistant",
  text: "Hi, I'm Mr. Meeseeks. Ask me anything about Swajan's projects, skills or experience.",
  isTyping: true,
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [isSending, setIsSending] = useState(false);
  const nextId = useRef(1);

  const append = useCallback((role: ChatRole, text: string) => {
    const message: ChatMessage = { id: nextId.current++, role, text, isTyping: role === "assistant" };
    setMessages((prev) => [...prev, message]);
  }, []);

  /** Called once a message has fully typed out, so it never re-animates (e.g. after reopening). */
  const markTyped = useCallback((id: number) => {
    setMessages((prev) => prev.map((message) => (message.id === id ? { ...message, isTyping: false } : message)));
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || isSending) return;

      append("user", text);
      setIsSending(true);
      try {
        append("assistant", await sendChatMessage(text));
      } catch {
        append("assistant", OFFLINE_REPLY);
      } finally {
        setIsSending(false);
      }
    },
    [append, isSending],
  );

  const hasUserMessages = messages.some((message) => message.role === "user");
  const isTyping = messages.some((message) => message.isTyping);

  return { messages, isSending, isTyping, send, markTyped, hasUserMessages };
}
