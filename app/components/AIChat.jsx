"use client";
import { useState, useRef, useEffect } from "react";
import { FiMessageSquare, FiX, FiSend, FiCpu, FiArrowLeft } from "react-icons/fi";
import api from "@/lib/axios";
import axios from "axios";

const INITIAL_MESSAGES = [
  { role: "bot", text: "I'm Mr. Meeseeks! I'm here to help you explore Swajan Barua! How can I help you?" }
];

// ─── Shared chat UI (used in both mobile and desktop) ────────────────────────
function ChatBody({ messages, loading, scrollRef }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col custom-scrollbar">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`max-w-[85%] p-3 rounded-2xl text-sm ${
            msg.role === "user"
              ? "bg-[#1976D2] text-white self-end rounded-tr-none shadow-sm"
              : "bg-white/70 text-slate-800 font-medium self-start rounded-tl-none border border-white/60 shadow-sm"
          }`}
        >
          {msg.text}
        </div>
      ))}
      {loading && (
        <div className="text-slate-400 text-xs animate-pulse self-start">
          Mr. Meeseeks is thinking...
        </div>
      )}
      <div ref={scrollRef} />
    </div>
  );
}

function ChatInput({ input, setInput, handleSend }) {
  return (
    <div className="p-3 border-t border-black/10 flex gap-2 bg-white/60">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type a message..."
        className="flex-1 bg-white/80 border border-black/10 rounded-xl px-4 py-2.5 text-base md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white transition-colors"
      />
      <button
        onClick={handleSend}
        className="p-2.5 bg-[#1976D2] hover:bg-[#1565C0] rounded-xl text-white shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors shrink-0"
      >
        <FiSend />
      </button>
    </div>
  );
}

// ─── Mobile full-screen overlay ───────────────────────────────────────────────
function MobileChatModal({ messages, loading, scrollRef, input, setInput, handleSend, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{
        background: 'rgba(240, 242, 255, 0.97)',
        // Use dvh so the layout adjusts when the keyboard opens
        height: '100dvh',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-black/10 bg-white/60 shrink-0">
        <button
          onClick={onClose}
          className="p-2 hover:bg-black/5 rounded-full transition-colors text-slate-600"
          aria-label="Close chat"
        >
          <FiArrowLeft size={20} />
        </button>
        <FiCpu className="animate-pulse text-blue-600" />
        <span className="font-bold text-sm text-slate-800">Mr. Meeseeks</span>
      </div>

      {/* Messages — fills remaining space */}
      <ChatBody messages={messages} loading={loading} scrollRef={scrollRef} />

      {/* Input — pinned to bottom, above safe area */}
      <div className="shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
      </div>
    </div>
  );
}

// ─── Desktop floating chat window ─────────────────────────────────────────────
function DesktopChatWindow({ messages, loading, scrollRef, input, setInput, handleSend, onClose }) {
  return (
    <div
      className="w-96 flex flex-col rounded-3xl overflow-hidden mb-3 shadow-2xl"
      style={{
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        background: 'rgba(240, 242, 255, 0.97)',
        border: '1px solid rgba(255,255,255,0.80)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.20)',
      }}
    >
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-black/10 shrink-0">
        <div className="flex items-center gap-2">
          <FiCpu className="animate-pulse text-blue-600" />
          <span className="font-bold text-sm text-slate-800">Mr. Meeseeks</span>
        </div>
        <button
          onClick={onClose}
          className="hover:bg-black/10 p-1.5 rounded-full transition-colors"
        >
          <FiX size={20} className="text-slate-600" />
        </button>
      </div>

      {/* Messages */}
      <div className="h-80 flex flex-col">
        <ChatBody messages={messages} loading={loading} scrollRef={scrollRef} />
      </div>

      {/* Input */}
      <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await axios.post("https://portfolio-backend-omega-gray.vercel.app/api/v1/chat/", { message: input });
      setMessages(prev => [...prev, { role: "bot", text: res.data.text || res.data.reply || res.data.message || res.data }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "bot", text: "Mr. Meeseeks is offline. Try again later?" }]);
    } finally {
      setLoading(false);
    }
  };

  const chatProps = { messages, loading, scrollRef, input, setInput, handleSend, onClose: () => setIsOpen(false) };

  return (
    <>
      {/* Mobile full-screen modal */}
      {isOpen && isMobile && <MobileChatModal {...chatProps} />}

      {/* Floating button + desktop window */}
      <div className="absolute bottom-24 right-4 sm:bottom-6 sm:right-6 md:bottom-6 md:right-8 lg:bottom-8 z-50 flex flex-col items-end">
        {/* Desktop chat window only */}
        {isOpen && !isMobile && (
          <DesktopChatWindow {...chatProps} />
        )}

        {/* Toggle button (always visible) */}
        <button
          onClick={() => setIsOpen(prev => !prev)}
          aria-label={isOpen ? "Close chat" : "Open chat"}
          className="relative w-14 h-14 flex items-center justify-center text-[#1976D2] text-2xl hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full shadow-lg"
          style={{
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(255,255,255,0.70)',
          }}
        >
          {isOpen ? <FiX size={22} /> : <FiMessageSquare />}

          {!isOpen && (
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white" />
            </span>
          )}
        </button>
      </div>
    </>
  );
}