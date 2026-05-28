"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import emailjs from "@emailjs/browser"; 
import { FiMail, FiMapPin, FiSend, FiLink } from "react-icons/fi";
import api from "@/lib/axios";
import { resolveIcon } from "@/app/lib/resolveIcon";

const glass = {
  backdropFilter: 'blur(24px) saturate(180%)',
  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
};

const glassInner = {
  backdropFilter: 'blur(16px) saturate(160%)',
  WebkitBackdropFilter: 'blur(16px) saturate(160%)',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
};

export default function Contact() {
  const formRef = useRef();
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null); 
  const [contacts, setContacts] = useState([]);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    api.get(`/profile?t=${Date.now()}`)
      .then(({ data }) => setContacts(data?.socials || []))
      .catch(err => console.error("Failed to load contacts:", err));
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatus(null);

    const SERVICE_ID = "service_uqakf6u";
    const TEMPLATE_ID = "template_nl9vpnd";
    const PUBLIC_KEY = "YimywiF0JktUGRhI4";

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
        publicKey: PUBLIC_KEY,
      })
      .then(
        () => {
          setIsSending(false);
          setStatus("success");
          formRef.current.reset(); 
          setTimeout(() => setStatus(null), 5000); 
        },
        (error) => {
          setIsSending(false);
          setStatus("error");
          console.error("FAILED...", error.text);
        }
      );
  };

  const formVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="min-h-[85vh] py-16 px-4 sm:px-6 lg:px-8 flex items-center" id="contact">
      <div className="max-w-7xl w-full mx-auto p-6 sm:p-10 md:p-12">
        <motion.header 
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-[clamp(2rem,6vw,3rem)] font-bold text-white mb-4">
            Let's Connect
          </h2>
          <p className="text-white/80 max-w-xl mx-auto text-base sm:text-lg font-medium">
            Have a project in mind or want to discuss the latest in AI and Web Dev? 
            My inbox is always open.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          <motion.div 
            initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <article style={glass} className="p-6 sm:p-8 rounded-3xl">
              <h3 className="text-[clamp(1.25rem,3vw,1.5rem)] font-bold mb-6 text-white">Contact Info</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div style={glassInner} className="p-3 rounded-xl text-sky-300 text-xl" aria-hidden="true">
                    <FiMapPin />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Location</h4>
                    <p className="text-white/80 font-medium">Dhaka, Bangladesh</p>
                    <p className="text-xs text-white/60 mt-1 font-medium">Open to remote work</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div style={glassInner} className="p-3 rounded-xl text-sky-300 text-xl" aria-hidden="true">
                    <FiMail />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Email</h4>
                    <a href="mailto:swajanbarua09@gmail.com" className="text-white/80 font-medium hover:text-sky-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded p-1 -ml-1">
                      swajanbarua09@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </article>

            <nav aria-label="Social links" className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {contacts.map((c, i) => (
                <SocialBtn key={i} icon={c.icon} label={c.platform} href={c.url} delay={shouldReduceMotion ? 0 : 0.1 + (i * 0.1)} />
              ))}
            </nav>
          </motion.div>

          <motion.div 
            variants={formVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            style={glass}
            className="p-6 sm:p-8 rounded-3xl"
          >
            <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="user_name" className="text-sm font-bold text-white/90 ml-1">Name</label>
                  <input 
                    type="text" 
                    id="user_name"
                    name="user_name" 
                    required
                    placeholder="John Doe" 
                    className="w-full glass-input px-4 py-3.5"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="user_email" className="text-sm font-bold text-white/90 ml-1">Email</label>
                  <input 
                    type="email" 
                    id="user_email"
                    name="user_email" 
                    required
                    placeholder="john@example.com" 
                    className="w-full glass-input px-4 py-3.5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-bold text-white/90 ml-1">Subject</label>
                <input 
                  type="text" 
                  id="subject"
                  name="subject" 
                  required
                  placeholder="Project Inquiry" 
                  className="w-full glass-input px-4 py-3.5"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-bold text-white/90 ml-1">Message</label>
                <textarea 
                  id="message"
                  rows={4} 
                  name="message" 
                  required
                  placeholder="Tell me about your project..." 
                  className="w-full glass-input px-4 py-3.5 resize-y min-h-[120px]"
                />
              </div>

              <motion.button
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                disabled={isSending}
                type="submit"
                className={`w-full font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 shadow-md ${
                  isSending ? "bg-white/50 text-black/60 cursor-not-allowed" : "bg-white hover:bg-gray-200 text-black"
                }`}
              >
                {isSending ? "Sending..." : <><FiSend aria-hidden="true" /> Send Message</>}
              </motion.button>

              {status === "success" && (
                <p className="text-green-400 text-center text-sm mt-3 font-bold" role="alert">
                  Message sent successfully!
                </p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-center text-sm mt-3 font-bold" role="alert">
                  Failed to send. Please try again.
                </p>
              )}
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function SocialBtn({ icon, label, href, delay }) {
  const iconElement = resolveIcon(icon, { size: 24 }) || <FiLink />;

  return (
    <motion.a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.4 }}
      viewport={{ once: true }}
      style={glassInner}
      className="flex flex-col items-center justify-center gap-2 p-4 hover:bg-white/10 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-2xl"
      aria-label={`Visit my ${label} profile`}
    >
      <div className="text-2xl text-white/80 group-hover:text-sky-300 transition-colors" aria-hidden="true">
        {iconElement}
      </div>
      <span className="text-xs text-white/70 group-hover:text-sky-300 font-bold">{label}</span>
    </motion.a>
  );
}