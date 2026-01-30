"use client";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import emailjs from "@emailjs/browser"; // 1. Import EmailJS
import { FiMail, FiMapPin, FiSend, FiGithub, FiLinkedin, FiFacebook, FiPhone } from "react-icons/fi";
import codeforecesIcon from "../images/codeforces.png";

export default function Contact() {
  // 2. Setup Ref and State
  const formRef = useRef();
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'

  // 3. The Send Function
  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatus(null);

    // --- REPLACE WITH YOUR EMAILJS KEYS ---
    const SERVICE_ID = "service_uqakf6u";
    const TEMPLATE_ID = "template_nl9vpnd";
    const PUBLIC_KEY = "YimywiF0JktUGRhI4";
    // --------------------------------------

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, {
        publicKey: PUBLIC_KEY,
      })
      .then(
        () => {
          setIsSending(false);
          setStatus("success");
          formRef.current.reset(); // Clear form
          setTimeout(() => setStatus(null), 5000); // clear success msg after 5s
        },
        (error) => {
          setIsSending(false);
          setStatus("error");
          console.error("FAILED...", error.text);
        }
      );
  };

  return (
    <section className="py-24 px-6 bg-black text-white" id="contact">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-4">
            Let's Connect
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Have a project in mind or want to discuss the latest in AI and Web Dev? 
            My inbox is always open.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* 1. CONTACT INFO & SOCIALS */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Location/Email Card */}
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 p-8 rounded-3xl">
              <h3 className="text-2xl font-bold mb-6">Contact Info</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 text-xl">
                    <FiMapPin />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Location</h4>
                    <p className="text-gray-400">Dhaka, Bangladesh</p>
                    <p className="text-xs text-gray-500 mt-1">Open to remote work</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-500/10 rounded-xl text-green-400 text-xl">
                    <FiMail />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Email</h4>
                    <a href="mailto:swajanbarua09@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                      swajanbarua09@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              <SocialBtn icon={<FiGithub />} label="GitHub" href="https://github.com/swajan-75" delay={0.1} />
              <SocialBtn icon={<FiLinkedin />} label="LinkedIn" href="https://www.linkedin.com/in/swajan-barua09/" delay={0.2} />
              <SocialBtn icon={<FiFacebook />} label="Facebook" href="https://www.facebook.com/swajan.09" delay={0.3} />
              <SocialBtn icon={<FiPhone />} label="Phone" href="tel:+8801742227504" delay={0.4} />
              <SocialBtn icon={codeforecesIcon} label="Codeforces" href="https://codeforces.com/profile/Swajan_" delay={0.5}/>
            </div>
          </motion.div>


          {/* 2. MESSAGE FORM */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 p-8 rounded-3xl"
          >
            {/* 4. Connect Form Ref and Submit Handler */}
            <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 ml-1">Name</label>
                  <input 
                    type="text" 
                    name="user_name" // 5. Added 'name' attribute
                    required
                    placeholder="John Doe" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-400 ml-1">Email</label>
                  <input 
                    type="email" 
                    name="user_email" // 5. Added 'name' attribute
                    required
                    placeholder="john@example.com" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 ml-1">Subject</label>
                <input 
                  type="text" 
                  name="subject" // 5. Added 'name' attribute
                  required
                  placeholder="Project Inquiry" 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 ml-1">Message</label>
                <textarea 
                  rows="4" 
                  name="message" // 5. Added 'name' attribute
                  required
                  placeholder="Tell me about your project..." 
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-gray-600 resize-none"
                />
              </div>

              {/* 6. Updated Button with Loading State */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSending}
                type="submit"
                className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors ${
                  isSending ? "bg-gray-600 cursor-not-allowed" : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {isSending ? (
                  "Sending..."
                ) : (
                  <>
                    <FiSend /> Send Message
                  </>
                )}
              </motion.button>

               {/* 7. Success/Error Messages */}
               {status === "success" && (
                <p className="text-green-400 text-center text-sm mt-2">
                  Message sent successfully!
                </p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-center text-sm mt-2">
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

// 8. Kept your SocialBtn Component exactly as requested
function SocialBtn({ icon, label, href, delay }) {
  const isReactIcon = React.isValidElement(icon);

  return (
    <motion.a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: delay }}
      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
    >
      <div className="text-2xl text-gray-400 group-hover:text-white transition-colors">
        {isReactIcon ? (
          icon
        ) : (
          <img 
            src={icon.src || icon} 
            alt={label} 
            className="w-6 h-6 object-contain opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all" 
          />
        )}
      </div>
      <span className="text-xs text-gray-500 group-hover:text-gray-300">{label}</span>
    </motion.a>
  );
}