"use client";
import Image from "next/image";
import { useState } from "react";
import { FaBars, FaTimes, FaMapMarkedAlt } from "react-icons/fa";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Events", href: "#events" },
  { name: "Schedule", href: "#schedule" },
  { name: "Team", href: "#team" },
  { name: "Contact", href: "#contact" },
  { name: "Map", href: "https://maps.app.goo.gl/2Qw6Qw2Qw6Qw2Qw6A" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b-2 border-blue-500/40 shadow-lg flex items-center justify-between px-4 md:px-10 py-2 font-mono overflow-hidden neon-border">
      {/* Scanline/Noise Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 mix-blend-soft-light opacity-30 navbar-scanlines" aria-hidden="true" />
      {/* Logo & Title */}
      <div className="flex items-center gap-3 select-none relative z-10 group">
        <Image src="/assets/Adharva-logo-monchrome.svg" alt="Adharva Logo" width={40} height={40} className="w-10 h-10 drop-shadow-glow group-hover:glitch" priority />
        <span className="text-white font-bold text-lg md:text-xl tracking-widest drop-shadow-glow group-hover:glitch relative">
          ADHARVA 2025
          <span className="ml-1 text-blue-400 animate-blink-cursor">█</span>
        </span>
      </div>
      {/* Desktop Nav */}
      <ul className="hidden md:flex gap-7 text-base font-mono relative z-10">
        {navLinks.map((link) => (
          <li key={link.name}>
            <a
              href={link.href}
              target={link.name === "Map" ? "_blank" : undefined}
              rel={link.name === "Map" ? "noopener noreferrer" : undefined}
              className="relative px-2 py-1 text-gray-200 hover:text-blue-400 transition group flex items-center"
            >
              <span className="text-blue-500 mr-2 select-none">&gt;</span>
              <span className="z-10 relative">{link.name === "Map" ? <span className="inline-flex items-center gap-1">Map <FaMapMarkedAlt className="inline text-blue-400 mb-0.5" /></span> : link.name}</span>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left rounded-full blur-sm opacity-80 neon-underline" />
            </a>
          </li>
        ))}
      </ul>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden text-blue-400 text-2xl p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 relative z-10"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>
      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-black/95 border-l border-blue-500/40 shadow-2xl z-50 flex flex-col gap-8 pt-24 px-8 transition-transform duration-300 font-mono neon-border ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <ul className="flex flex-col gap-6 text-lg">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                target={link.name === "Map" ? "_blank" : undefined}
                rel={link.name === "Map" ? "noopener noreferrer" : undefined}
                className="block w-full px-2 py-2 rounded text-gray-200 hover:text-blue-400 hover:bg-blue-500/10 transition group flex items-center"
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-blue-500 mr-2 select-none">&gt;</span>
                <span className="z-10 relative">{link.name === "Map" ? <span className="inline-flex items-center gap-1">Map <FaMapMarkedAlt className="inline text-blue-400 mb-0.5" /></span> : link.name}</span>
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-right group-hover:origin-left rounded-full blur-sm opacity-80 neon-underline" />
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
      )}
      {/* Extra styles for scanlines, glitch, neon border, and blinking cursor */}
      <style jsx global>{`
        .navbar-scanlines {
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.04) 0px,
            rgba(255,255,255,0.04) 1px,
            transparent 1.5px,
            transparent 4px
          );
        }
        .animate-blink-cursor {
          animation: blink-cursor 1.1s steps(1) infinite;
        }
        @keyframes blink-cursor {
          0%, 60% { opacity: 1; }
          61%, 100% { opacity: 0; }
        }
        .neon-border {
          box-shadow: 0 0 0 1.5px #3b82f6, 0 0 8px 0 #3b82f6cc;
        }
        .neon-underline {
          box-shadow: 0 0 6px 1px #3b82f6cc;
        }
        .glitch {
          position: relative;
          animation: glitch 1.2s infinite linear alternate-reverse;
        }
        @keyframes glitch {
          0% { text-shadow: 2px 0 #3b82f6, -2px 0 #fff, 0 2px #fff; }
          20% { text-shadow: -2px 0 #fff, 2px 0 #3b82f6, 0 -2px #fff; }
          40% { text-shadow: 2px 2px #3b82f6, -2px -2px #fff; }
          60% { text-shadow: -2px 2px #fff, 2px -2px #3b82f6; }
          80% { text-shadow: 0 0 8px #3b82f6, 0 0 2px #fff; }
          100% { text-shadow: 2px 0 #fff, -2px 0 #3b82f6; }
        }
      `}</style>
    </nav>
  );
} 