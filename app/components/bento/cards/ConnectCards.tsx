"use client";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import emailjs from "@emailjs/browser";
import { FiMail, FiMapPin, FiSend, FiArrowUpRight, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "motion/react";
import { useProfile } from "../../../hooks/useProfile";

const EMAIL_ADDRESS = "swajanbarua09@gmail.com";
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "service_uqakf6u";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "template_nl9vpnd";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "YimywiF0JktUGRhI4";

const FLOATING_ICONS = [
  { top: "15%", left: "12%", size: 56, rotate: -15, icon: <FiMail size={24} /> },
  { top: "8%", left: "65%", size: 46, rotate: 10, icon: <FiSend size={22} /> },
  { top: "45%", left: "8%", size: 58, rotate: 8, icon: <FiMapPin size={24} /> },
  { top: "35%", left: "70%", size: 50, rotate: -12, icon: <FiMail size={22} /> },
  { top: "65%", left: "25%", size: 52, rotate: 15, icon: <FiSend size={24} /> },
];

export function ContactCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const { profile } = useProfile();

  useEffect(() => {
    setMounted(true);
  }, []);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSending(true);
    setStatus(null);

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, { publicKey: PUBLIC_KEY })
      .then(() => {
        setStatus("success");
        formRef.current?.reset();
        setTimeout(() => {
          setStatus(null);
          setIsModalOpen(false);
        }, 3000);
      })
      .catch((error) => {
        setStatus("error");
        console.error("Contact form send failed:", error);
      })
      .finally(() => setIsSending(false));
  };

  return (
    <>
      {/* Visual Tile Button */}
      <button
        onPointerDown={(e) => { pointerStart.current = { x: e.clientX, y: e.clientY }; }}
        onPointerUp={(e) => {
          if (!pointerStart.current) return;
          const dx = e.clientX - pointerStart.current.x;
          const dy = e.clientY - pointerStart.current.y;
          pointerStart.current = null;
          if (Math.sqrt(dx * dx + dy * dy) > 8) return;
          setIsModalOpen(true);
        }}
        aria-label="Open contact form"
        className="bento-interactive group/contact relative flex h-full min-h-[280px] w-full flex-col justify-end overflow-hidden cursor-grab active:cursor-grabbing
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
      >
        {/* Topo background pattern */}
        <div
          className="bento-topo absolute inset-0 opacity-[0.12]"
          style={{ backgroundImage: "var(--topo-pattern)", backgroundSize: "240px 240px" }}
          aria-hidden="true"
        />

        {/* Floating icons */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {FLOATING_ICONS.map((item, i) => (
            <span
              key={i}
              className="bento-tile absolute flex items-center justify-center rounded-2xl bg-[#fff] text-[#0a0a0f] shadow-lg
                         transition-transform duration-500 group-hover/contact:scale-95"
              style={{
                top: item.top,
                left: item.left,
                width: item.size,
                height: item.size,
                transform: `rotate(${item.rotate}deg)`,
              }}
            >
              {item.icon}
            </span>
          ))}
        </div>

        {/* Hover overlay */}
        <div
          className="bento-overlay absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 backdrop-blur-[2px]
                     transition-opacity duration-300 group-hover/contact:opacity-100"
          aria-hidden="true"
        >
          <span className="text-2xl font-bold tracking-tight text-white">Get in touch</span>
        </div>

        {/* Arrow button */}
        <span
          className="bento-arrow relative z-10 m-4 flex h-10 w-10 items-center justify-center self-start rounded-full bg-[#fff]
                     text-[#0a0a0f] shadow-md transition-transform duration-300 group-hover/contact:scale-110"
          aria-hidden="true"
        >
          <FiArrowUpRight />
        </span>
      </button>

      {/* Popup Modal via Portal to escape stacking contexts */}
      {mounted && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                aria-hidden="true"
              />
              
              {/* Modal Content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-bg border border-white/10 shadow-2xl z-10 p-6 sm:p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  aria-label="Close contact modal"
                >
                  <FiX size={20} />
                </button>

                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <FiMail className="text-accent-light" /> Get in touch
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <a
                    href={`mailto:${EMAIL_ADDRESS}`}
                    className="card-inset flex items-center gap-3 p-3.5 rounded-2xl flex-1 hover:bg-white/[0.07] transition-colors
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <span className="text-accent-light text-lg shrink-0" aria-hidden="true">
                      <FiMail />
                    </span>
                    <span className="text-white/80 font-medium text-xs truncate">{EMAIL_ADDRESS}</span>
                  </a>
                  <div className="card-inset flex items-center gap-3 p-3.5 rounded-2xl flex-1">
                    <span className="text-accent-light text-lg shrink-0" aria-hidden="true">
                      <FiMapPin />
                    </span>
                    <span className="text-white/80 font-medium text-xs truncate">
                      {profile?.location || "Dhaka, Bangladesh"}
                    </span>
                  </div>
                </div>

                <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="user_name" className="text-xs font-bold text-white/80 ml-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="user_name"
                        name="user_name"
                        required
                        placeholder="John Doe"
                        className="w-full input-dark px-3.5 py-2.5 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="user_email" className="text-xs font-bold text-white/80 ml-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="user_email"
                        name="user_email"
                        required
                        placeholder="john@example.com"
                        className="w-full input-dark px-3.5 py-2.5 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="text-xs font-bold text-white/80 ml-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      placeholder="Project inquiry"
                      className="w-full input-dark px-3.5 py-2.5 text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message" className="text-xs font-bold text-white/80 ml-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      required
                      placeholder="Tell me about your project..."
                      className="w-full input-dark px-3.5 py-2.5 text-sm resize-y min-h-[90px]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSending}
                    className={`btn-primary w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
                      isSending ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSending ? (
                      "Sending..."
                    ) : (
                      <>
                        <FiSend aria-hidden="true" /> Send Message
                      </>
                    )}
                  </button>

                  {status === "success" && (
                    <p className="text-mint text-center text-xs font-bold" role="alert">
                      Message sent — I&apos;ll get back to you soon.
                    </p>
                  )}
                  {status === "error" && (
                    <p className="text-red-400 text-center text-xs font-bold" role="alert">
                      Failed to send. Please email me directly.
                    </p>
                  )}
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
