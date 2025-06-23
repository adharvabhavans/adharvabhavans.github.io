"use client";
import { FaRocket, FaMusic, FaTheaterMasks, FaPalette } from "react-icons/fa";
import { motion } from "framer-motion";

const events = [
  {
    name: "Stellar Quiz",
    desc: "Test your cosmic knowledge in a battle of wits across the universe!",
    icon: <FaRocket className="text-4xl text-cyan-300" />,
  },
  {
    name: "Galactic Dance",
    desc: "Move to the rhythm of the stars in this interstellar dance-off.",
    icon: <FaMusic className="text-4xl text-pink-400" />,
  },
  {
    name: "Nebula Drama",
    desc: "Experience drama that transcends space and time.",
    icon: <FaTheaterMasks className="text-4xl text-yellow-300" />,
  },
  {
    name: "Cosmic Art",
    desc: "Create art inspired by the wonders of the universe.",
    icon: <FaPalette className="text-4xl text-purple-400" />,
  },
];

export default function Events() {
  return (
    <section id="events" className="py-20 px-4 bg-black/80">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-5xl font-bold text-cyan-400 mb-12 text-center"
        >
          Events
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {events.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
              className="bg-gradient-to-br from-gray-900/80 via-indigo-900/80 to-black/80 p-8 rounded-2xl relative hover:ring-2 hover:ring-cyan-400 transition-shadow duration-200 cursor-pointer shadow-2xl flex flex-col gap-4 items-center glassy-card backdrop-blur-md group"
              whileHover={{ scale: 1.04, boxShadow: "0 0 32px #00ffe7aa" }}
            >
              <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gradient-to-br from-cyan-900 via-indigo-900 to-black rounded-full shadow-lg group-hover:shadow-cyan-400/40 transition-shadow duration-300">
                {event.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2 text-cyan-200 text-center">{event.name}</h3>
              <p className="text-base opacity-90 text-center">{event.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 