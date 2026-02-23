"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiX, FiSend, FiCpu } from "react-icons/fi";

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "I'm Mr. Meeseeks! Look at me! I'm here to help you explore Swajan Barua! How Can you Help You ?" }
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
      const res = await fetch("https://portfolio-backend-omega-gray.vercel.app/api/v1/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "bot", text: data.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", text: "Mr. Meeseeks is offline. Try again later?" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-25 right-15 z-50 flex flex-col items-end">
      <AnimatePresence mode="wait">
        {isOpen ? (
          
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-80 md:w-96 bg-white/[0.03] border border-white/20 rounded-3xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] backdrop-blur-[20px] saturate-[180%]"
          >
          
            <div className="bg-purple-600/80 p-4 flex justify-between items-center text-white backdrop-blur-md">
              <div className="flex items-center gap-2">
                <FiCpu className="animate-pulse" />
                <span className="font-bold text-sm">Mr. Meeseeks</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                <FiX size={20} />
              </button>
            </div>

            
            <div className="h-80 overflow-y-auto p-4 space-y-4 flex flex-col custom-scrollbar bg-transparent">
              {messages.map((msg, i) => (
                <div key={i} className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === "user"
                    ? "bg-purple-600/90 text-white self-end rounded-tr-none shadow-lg"
                    : "bg-white/10 text-gray-200 self-start rounded-tl-none border border-white/10 backdrop-blur-md"
                  }`}>
                  {msg.text}
                </div>
              ))}
              {loading && <div className="text-purple-400 text-xs animate-pulse">Mr. Meeseeks is thinking...</div>}
              <div ref={scrollRef} />
            </div>

        
            <div className="p-4 border-t border-white/10 bg-white/[0.02] flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:bg-white/10 transition-all"
              />
              <button onClick={handleSend} className="p-2.5 bg-purple-600/90 hover:bg-purple-500 rounded-xl text-white shadow-lg">
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
            className="relative w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl shadow-xl border border-purple-400/30"
          >
            <FiMessageSquare />

            
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-neutral-900"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}