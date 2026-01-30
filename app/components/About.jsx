"use client";
import React from "react";
import { motion } from "motion/react";
import { FiDownload, FiUser, FiCpu, FiBookOpen, FiAward, FiTarget, FiTrendingUp } from "react-icons/fi";
import logo from "../images/logo.jpg";
import aiubLogo from "../images/aiub.png";
import swajanDP from "../images/swajan_1.jpg"

export default function About() {
    return (
        <section className="py-24 px-6 bg-black text-white" id="about">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6"
                >

                    {/* 1. HERO BIO CARD */}
                    <div className="col-span-1 md:col-span-8 bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="p-2 bg-blue-500/20 text-blue-400 rounded-lg text-xl"><FiUser /></span>
                            <h2 className="text-3xl font-bold">Who I Am</h2>
                        </div>
                        {/* Replace the existing <p> tags inside the "Who I Am" card with this: */}


                        <p className="text-gray-400 text-lg leading-relaxed mb-6">
                            I am a <span className="text-white font-semibold">Computer Science student</span> and <span className="text-white font-semibold">Backend Developer</span> passionate about creating high-performing, scalable systems.
                            From low-level algorithms in <span className="text-cyan-400">C++ and Go</span> to modern web frameworks like <span className="text-cyan-400">NestJS, Next.js, and .NET Core</span>, my experience covers the full software lifecycle.
                        </p>

                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            I design database architectures across <span className="text-blue-400">Relational, Non-Relational, and Serverless</span> environments, supported by a strong foundation in <span className="text-emerald-400">Data Structures & Algorithms</span>.
                            Beyond backend, I have practical expertise in full-stack mobile and web programming, allowing me to build complete, end-to-end applications.
                        </p>

                        <motion.a
                            href="/resume.pdf"               // 1. Points to public/resume.pdf
                            download="Swajan_Resume.pdf"     // 2. The name of the file when downloaded
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-fit flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                            <FiDownload /> Download Resume
                        </motion.a>
                    </div>

                    {/* 2. PROFILE IMAGE CARD */}
                    <div className="col-span-1 md:col-span-4 relative overflow-hidden rounded-3xl border border-white/10 group">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                        <img
                            src={swajanDP.src}
                            alt="Profile"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                        />
                    </div>

                    {/* 3. EDUCATION CARD */}
                    <div className="col-span-1 md:col-span-6 bg-gradient-to-br from-blue-900/20 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                        <div className="flex justify-between items-center relative z-10">
                            <div className="pr-4">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="p-2 bg-blue-500/20 text-blue-400 rounded-lg text-xl"><FiBookOpen /></span>
                                    <h3 className="text-xl font-bold">Education</h3>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-2xl font-bold text-white">B.Sc. in CSE</h4>
                                    <p className="text-gray-400 text-sm">American International<br />University-Bangladesh (AIUB)</p>
                                </div>
                            </div>
                            <div className="bg-white p-3 rounded-2xl h-50 w-50 flex items-center justify-center shrink-0 shadow-lg">
                                <img src={aiubLogo.src} alt="AIUB" className="w-full h-full object-contain" />
                            </div>
                        </div>
                    </div>

                    {/* 4. TECH FOCUS CARD */}
                    <div className="col-span-1 md:col-span-6 bg-neutral-900/50 border border-white/10 rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="p-2 bg-purple-500/20 text-purple-400 rounded-lg text-xl"><FiCpu /></span>
                            <h3 className="text-xl font-bold">The Tech</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {// Replace the old array with this one:
                                // Updated list with Firebase and Git
                                ['Golang', 'NextJS', 'NestJS', '.NET Core', 'PostgreSQL', 'Firebase', 'Kotlin', 'Git'].map((tag) => (
                                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
                                        {tag}
                                    </span>
                                ))}
                        </div>
                    </div>

                    {/* 5. STATS CARD (Compact) */}
                    <div className="col-span-1 md:col-span-4 bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 flex flex-col justify-between">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="p-2 bg-gray-500/20 text-gray-400 rounded-lg text-xl"><FiTrendingUp /></span>
                            <h3 className="text-xl font-bold">Stats</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-3xl font-bold text-white">15+</h3>
                                <p className="text-gray-500 text-xs uppercase">Projects</p>
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-white">600+</h3>
                                <p className="text-gray-500 text-xs uppercase">DSA Solved</p>
                            </div>
                        </div>
                    </div>

                    {/* --- NEW SECTION: COMPETITIVE HIGHLIGHTS --- */}
                    {/* Replaces the old "Goal" card with a larger, detailed card */}
                    <div className="col-span-1 md:col-span-8 bg-gradient-to-br from-yellow-900/20 to-black border border-white/10 rounded-3xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="p-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-xl"><FiAward /></span>
                            <h3 className="text-xl font-bold">Competitive Career</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Highlight 1 */}
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-yellow-500/50 transition-colors">
                                <div className="text-sm text-gray-400 mb-1">Codeforces</div>
                                <div className="text-2xl font-bold text-white mb-1">Max 1162</div>

                            </div>

                            {/* Highlight 2 */}
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-yellow-500/50 transition-colors">
                                <div className="text-sm text-gray-400 mb-1">LeetCode</div>
                                <div className="text-2xl font-bold text-white mb-1">50+</div>
                                <div className="text-xs text-green-400">Problems Solved</div>
                            </div>

                            {/* Highlight 3 */}
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-yellow-500/50 transition-colors">
                                <div className="text-sm text-gray-400 mb-1">Programming Contest</div>
                                <div className="text-2xl font-bold text-white mb-1">17th</div>
                                <div className="text-xs text-blue-400">AIUB CS Fest 2024</div>
                            </div>
                        </div>
                    </div>

                </motion.div>
            </div>
        </section>
    );
}