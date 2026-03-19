"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiShield, FiArrowRight } from "react-icons/fi";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loginImage = "/logo.png";

  const handleLogin = async () => {
    setLoading(true);
    const res = await fetch("https://portfolio-backend-v2-4t2j.onrender.com/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) setStep(2);
    else{
        alert("Login Failed");
    }
    
  };

  const handleVerify = async () => {
    setLoading(true);
    const res = await fetch("https://portfolio-backend-v2-4t2j.onrender.com/api/v1/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
      credentials: "include", // 👈 IMPORTANT: Allows Go to set the HttpOnly cookie
    });
    setLoading(false);
    if (res.ok) router.push("/admin/dashboard");
    else alert("Invalid OTP");
  };

  return (
    <div className="min-h-screen bg-black flex overflow-hidden font-sans">
      
      {/* LEFT SIDE: IMAGE/BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
        <img 
          src={loginImage} 
          alt="Login Background" 
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-60"
        />
        <div className="relative z-20 flex flex-col justify-end p-16">
          <h1 className="text-5xl font-bold text-white mb-4">Admin Portal</h1>
          <p className="text-gray-400 text-lg max-w-md">
            Secure access to manage your portfolio, projects, and site analytics.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: AUTH FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-neutral-900/30">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-10"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              {step === 1 ? "Welcome Back" : "Security Check"}
            </h2>
            <p className="text-gray-500">
              {step === 1 ? "Please sign in to continue." : "Check your email for the 6-digit code."}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                      type="email" 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@swajan.com" 
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                      type="password" 
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500 transition-all"
                    />
                  </div>
                </div>


                <button 
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group"
                >
                  {loading ? "Authenticating..." : "Request OTP"}
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-purple-500/10 rounded-full text-purple-400 text-3xl">
                      <FiShield />
                    </div>
                  </div>
                  <label className="text-sm text-gray-400">Verification Code</label>
                  <input 
                    type="text" 
                    maxLength={6}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="000000" 
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-4 text-center text-3xl tracking-[1em] text-white focus:outline-none focus:border-green-500 transition-all font-mono"
                  />
                </div>

                <button 
                  onClick={handleVerify}
                  disabled={loading}
                  className="w-full bg-green-500 text-black font-bold py-3 rounded-xl hover:bg-green-400 transition-all"
                >
                  {loading ? "Verifying..." : "Verify & Access Dashboard"}
                </button>
                
                <button 
                  onClick={() => setStep(1)}
                  className="w-full text-gray-500 text-sm hover:text-white transition-colors"
                >
                  Back to login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}