export default function Contact() {
  return (
    <section id="contact" className="py-20 px-4 flex justify-center items-center bg-black/80">
      <div className="w-full max-w-lg bg-black/60 rounded-2xl shadow-2xl p-8 border border-cyan-400/30 backdrop-blur-md glassy-card animate-fade-in">
        <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center drop-shadow-glow">Contact Us</h2>
        <form className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Your Name"
            className="px-5 py-3 rounded-lg bg-black/40 border border-cyan-400/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all shadow-inner placeholder-cyan-300/60"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="px-5 py-3 rounded-lg bg-black/40 border border-cyan-400/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all shadow-inner placeholder-cyan-300/60"
          />
          <textarea
            placeholder="Your Message"
            rows={5}
            className="px-5 py-3 rounded-lg bg-black/40 border border-cyan-400/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all shadow-inner placeholder-cyan-300/60 resize-none"
          />
          <button
            type="submit"
            className="mt-2 px-8 py-3 rounded-full bg-cyan-400/90 text-black font-bold shadow-lg hover:bg-cyan-300 transition-all border-2 border-cyan-300/60 animate-pulse-glow text-lg"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
} 