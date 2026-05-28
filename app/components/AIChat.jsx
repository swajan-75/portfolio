"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    <div className="absolute bottom-6 right-6 md:bottom-24 md:right-12 z-50 flex flex-col items-end">
      <AnimatePresence mode="wait">
        {isOpen ? (
          
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{ backdropFilter: 'blur(150px) saturate(200%)', WebkitBackdropFilter: 'blur(150px) saturate(200%)', background: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.25)' }}
            className="w-80 md:w-96 overflow-hidden flex flex-col rounded-3xl"
          >
          
            <div className="p-4 flex justify-between items-center text-slate-900 border-b border-slate-300/50">
              <div className="flex items-center gap-2">
                <FiCpu className="animate-pulse text-blue-600" />
                <span className="font-bold text-sm">Mr. Meeseeks</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/40 p-1.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                <FiX size={20} className="text-slate-700" />
              </button>
            </div>

            
            <div className="h-80 overflow-y-auto p-4 space-y-4 flex flex-col custom-scrollbar bg-transparent">
              {messages.map((msg, i) => (
                <div key={i} className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === "user"
                    ? "bg-[#1976D2] text-white self-end rounded-tr-none shadow-sm"
                    : "bg-white/40 text-slate-900 font-medium self-start rounded-tl-none border border-white/40 shadow-sm"
                  }`}>
                  {msg.text}
                </div>
              ))}
              {loading && <div className="text-slate-600 font-medium text-xs animate-pulse">Mr. Meeseeks is thinking...</div>}
              <div ref={scrollRef} />
            </div>

        
            <div className="p-4 border-t border-slate-300/50 bg-white/10 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 glass-input px-4 py-2 text-sm focus:bg-white/40"
              />
              <button onClick={handleSend} className="p-2.5 bg-[#1976D2] hover:bg-[#1565C0] rounded-xl text-white shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors">
                <FiSend />
              </button>
            </div>
          </motion.div>
        ) : (
          
          <motion.button
            key="chat-toggle"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => setIsOpen(true)}
            style={{ backdropFilter: 'blur(150px) saturate(200%)', WebkitBackdropFilter: 'blur(150px) saturate(200%)', background: 'rgba(255,255,255,0.40)', border: '1px solid rgba(255,255,255,0.40)' }}
            className="relative w-14 h-14 flex items-center justify-center text-[#1976D2] text-2xl hover:bg-white/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full shadow-lg"
          >
            <FiMessageSquare />

            
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-transparent"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}