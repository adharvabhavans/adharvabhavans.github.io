import { FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full py-6 bg-black/90 border-t border-cyan-400/20 flex flex-col items-center gap-2 animate-fade-in">
      <div className="flex gap-4 mb-1">
        <a href="https://github.com/" target="_blank" rel="noopener" className="text-cyan-400 hover:text-cyan-200 transition text-xl"><FaGithub /></a>
        <a href="https://twitter.com/" target="_blank" rel="noopener" className="text-cyan-400 hover:text-cyan-200 transition text-xl"><FaTwitter /></a>
        <a href="https://instagram.com/" target="_blank" rel="noopener" className="text-cyan-400 hover:text-cyan-200 transition text-xl"><FaInstagram /></a>
      </div>
      <div className="text-cyan-200 text-sm">&copy; {new Date().getFullYear()} Galaxy Fest. All rights reserved.</div>
    </footer>
  );
} 