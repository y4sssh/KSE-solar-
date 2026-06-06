import Canvas from "./CanvasWrapper";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Company", href: "#company" },
  { label: "Solutions", href: "#decarbon" },
  { label: "Products", href: "#products" },
  { label: "Projects", href: "#projects" },
  { label: "Resources", href: "#resources" },
  { label: "People", href: "#people" },
  { label: "Investors", href: "#investors" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 ${
          scrolled ? "glass mx-4 md:mx-auto" : "bg-transparent"
        }`}
      >
        <a href="#hero" className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 glow-gold">
            <span className="text-lg font-black text-black">K</span>
            <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulseGlow rounded-full bg-cyan-300" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-wide text-white">KAUSTUBH</div>
            <div className="text-[10px] tracking-[0.3em] text-amber-400">SOLAR EVOLUTION</div>
          </div>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gradient-to-r from-amber-400 to-cyan-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#calculator"
            className="hidden rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:scale-105 hover:shadow-[0_0_25px_-2px_rgba(255,150,20,0.7)] md:block"
          >
            Saving Calculator
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-lg glass lg:hidden"
            aria-label="menu"
          >
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-4 mt-2 overflow-hidden rounded-2xl glass lg:hidden"
          >
            <div className="flex flex-col p-4">
              {[...links, { label: "Contact", href: "#contact" }, { label: "Saving Calculator", href: "#calculator" }].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
