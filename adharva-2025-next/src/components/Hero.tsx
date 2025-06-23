"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const glitchChars = ["█", "▓", "▒", "░", " "];

function useParallax(ref: React.RefObject<HTMLDivElement>) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      setOffset({ x, y });
    };
    const node = ref.current;
    if (node) node.addEventListener("mousemove", handleMouseMove);
    return () => node && node.removeEventListener("mousemove", handleMouseMove);
  }, [ref]);
  return offset;
}

export default function Hero() {
  const [glitch, setGlitch] = useState(false);
  const [typeIdx, setTypeIdx] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const offset = useParallax(ref as React.RefObject<HTMLDivElement>);
  const controls = useAnimation();
  const text = "Welcome to ADHARVA ";

  // Typewriter effect
  useEffect(() => {
    if (typeIdx < text.length) {
      const timeout = setTimeout(() => setTypeIdx(typeIdx + 1), 60);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => setGlitch(true), 400);
    }
  }, [typeIdx, text.length]);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((c) => !c), 500);
    return () => clearInterval(interval);
  }, []);

  // Glitch effect
  const [glitchChar, setGlitchChar] = useState("█");
  useEffect(() => {
    if (!glitch) return;
    const interval = setInterval(() => {
      setGlitchChar(glitchChars[Math.floor(Math.random() * glitchChars.length)]);
    }, 80);
    return () => clearInterval(interval);
  }, [glitch]);

  // Animate in
  useEffect(() => {
    controls.start({ opacity: 1, y: 0, transition: { duration: 1.2, ease: "easeOut" } });
  }, [controls]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden select-none"
      style={{ fontFamily: 'Space Mono, monospace' }}
    >
      {/* SVG Noise/Lines BG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" style={{zIndex:1}}>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" fill="#111" />
        <g stroke="#222" strokeWidth="0.5">
          {[...Array(20)].map((_, i) => (
            <line key={i} x1={0} y1={i*40+10} x2="100%" y2={i*40+10} />
          ))}
        </g>
      </svg>
      {/* Logo/Wordmark */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={controls}
        style={{
          zIndex: 2,
          transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`
        }}
        className="flex flex-col items-center gap-6"
      >
        <div className="text-[2.5rem] sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-glow animate-glitch relative">
          <span className="relative">
            ADHARVA
            <span className="absolute left-0 top-0 w-full h-full pointer-events-none mix-blend-difference opacity-40 animate-glitch" aria-hidden>ADHARVA</span>
          </span>
        </div>
        <div className="mt-2 text-lg sm:text-2xl text-gray-400 font-mono tracking-widest flex items-center gap-2">
          <span className="whitespace-pre">{text.slice(0, typeIdx)}</span>
          {typeIdx < text.length ? (
            <span className="text-blue-500 animate-flicker">{showCursor ? "|" : " "}</span>
          ) : (
            <span className="text-blue-500 animate-glitch text-2xl ml-1">{glitchChar}</span>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.08, filter: "contrast(1.5) brightness(1.2)", x: [0, -2, 2, 0] }}
          className="mt-10 px-10 py-4 rounded-full border-2 border-blue-500 text-white font-bold text-lg bg-black/80 hover:bg-blue-500 hover:text-black transition-all duration-200 shadow-lg tracking-widest relative overflow-hidden animate-glitch"
          style={{ zIndex: 2 }}
        >
          <span className="relative z-10">ENTER</span>
          <span className="absolute left-0 top-0 w-full h-full pointer-events-none mix-blend-difference opacity-30 animate-glitch" aria-hidden>ENTER</span>
        </motion.button>
      </motion.div>
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none z-0" />
    </section>
  );
} 