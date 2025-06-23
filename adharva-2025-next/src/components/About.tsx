"use client";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="w-full bg-black py-20 px-4 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
      {/* Left: Text */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex-1 max-w-xl"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white font-mono mb-6 tracking-tight">What is <span className="text-blue-500">Adharva</span>?</h2>
        <p className="text-lg md:text-xl text-gray-300 font-mono leading-relaxed">
          <span className="text-white">Adharva</span> is the ultimate convergence of technology, culture, and innovation. Experience a festival where code meets creativity, and tradition fuses with the future. From electrifying performances and mind-bending hackathons to immersive workshops and star-studded guest talks, Adharva is a celebration of ideas, talent, and the spirit of progress. Step into a world where the terminal is your stage, and every keystroke sparks a revolution.
        </p>
      </motion.div>
      {/* Right: Animated SVG/Cyberpunk Graphic */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        className="flex-1 flex items-center justify-center w-full max-w-md"
      >
        <svg width="320" height="320" viewBox="0 0 320 320" className="w-64 h-64 md:w-80 md:h-80" fill="none">
          <g stroke="#3b82f6" strokeWidth="1.5" opacity="0.7">
            <rect x="20" y="20" width="280" height="280" rx="24" className="animate-pulse" />
            <path d="M60 60 L260 60 L260 260 L60 260 Z" className="animate-glitch" />
            <circle cx="160" cy="160" r="80" className="animate-flicker" />
            <line x1="160" y1="40" x2="160" y2="280" className="animate-glitch" />
            <line x1="40" y1="160" x2="280" y2="160" className="animate-glitch" />
          </g>
          <g stroke="#fff" strokeWidth="0.5" opacity="0.2">
            {[...Array(12)].map((_, i) => (
              <line key={i} x1={40 + i * 20} y1={40} x2={40 + i * 20} y2={280} />
            ))}
            {[...Array(12)].map((_, i) => (
              <line key={i} x1={40} y1={40 + i * 20} x2={280} y2={40 + i * 20} />
            ))}
          </g>
        </svg>
      </motion.div>
    </section>
  );
} 