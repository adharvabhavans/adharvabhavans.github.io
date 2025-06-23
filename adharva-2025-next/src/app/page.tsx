"use client";

import AnimatedStarsBG from "../components/AnimatedStarsBG";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Events from "../components/Events";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white font-mono overflow-x-hidden">
      <AnimatedStarsBG />
      <Navbar />
      <main className="relative z-10 flex flex-col items-center justify-center">
        <Hero />
        <Events />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

import { useEffect, useState } from "react";

function AnimatedCosmicBG() {
  const [stars, setStars] = useState<any[]>([]);

  useEffect(() => {
    // Only runs on client
    const generatedStars = Array.from({ length: 100 }).map(() => ({
      width: Math.random() * 2 + 1,
      height: Math.random() * 2 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.7 + 0.2,
      animationDelay: `${Math.random() * 3}s`,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 -z-20 pointer-events-none">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-cyan-300/80 blur-sm animate-twinkle"
          style={{
            width: `${star.width}px`,
            height: `${star.height}px`,
            top: `${star.top}%`,
            left: `${star.left}%`,
            opacity: star.opacity,
            animationDelay: star.animationDelay,
          }}
        />
      ))}
    </div>
  );
}