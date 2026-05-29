"use client";
import { useState, useRef, useEffect } from "react";
import { FiMessageSquare, FiX, FiSend, FiCpu } from "react-icons/fi";
import api from "@/lib/axios";

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "I'm Mr. Meeseeks! I'm here to help you explore Swajan Barua! How Can you Help You ?" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

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
      const res = await api.post("/chat/", { message: input });
      setMessages(prev => [...prev, { role: "bot", text: res.data.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", text: "Mr. Meeseeks is offline. Try again later?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-80 md:bottom-24 md:right-12 md:w-96 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div
          className="w-full sm:w-80 md:w-96 flex flex-col rounded-3xl overflow-hidden mb-3"
          style={{
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            background: 'rgba(240, 242, 255, 0.95)',
            border: '1px solid rgba(255,255,255,0.80)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.20)',
          }}
        >
          {/* Header */}
          <div className="p-4 flex justify-between items-center border-b border-black/10">
            <div className="flex items-center gap-2">
              <FiCpu className="animate-pulse text-blue-600" />
              <span className="font-bold text-sm text-slate-800">Mr. Meeseeks</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-black/10 p-1.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <FiX size={20} className="text-slate-600" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 flex flex-col custom-scrollbar">
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
              <div className="text-slate-500 font-medium text-xs animate-pulse">
                Mr. Meeseeks is thinking...
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-black/10 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-white/40 border border-black/10 rounded-xl px-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white/60 transition-colors"
            />
            <button
              onClick={handleSend}
              className="p-2.5 bg-[#1976D2] hover:bg-[#1565C0] rounded-xl text-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
            >
              <FiSend />
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="relative w-14 h-14 flex items-center justify-center text-[#1976D2] text-2xl hover:bg-white/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full shadow-lg"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: 'rgba(255,255,255,0.50)',
          border: '1px solid rgba(255,255,255,0.50)',
        }}
      >
        {isOpen ? <FiX size={22} /> : <FiMessageSquare />}

        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-transparent"></span>
          </span>
        )}
      </button>
    </div>
  );
}