import Canvas from "./CanvasWrapper";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const chapters = [
  { id: "hero", label: "Awakening" },
  { id: "xray", label: "X-Ray" },
  { id: "command", label: "EPC" },
  { id: "battery", label: "Core" },
  { id: "impact", label: "Globe" },
  { id: "calculator", label: "ROI" },
];

export default function CinematicAtmosphere() {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      setMouse({ x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100 });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { threshold: [0.25, 0.45, 0.65] }
    );
    chapters.forEach((chapter) => {
      const el = document.getElementById(chapter.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="cinema-grain pointer-events-none fixed inset-0 z-[55]" />
      <div className="cinema-letterbox pointer-events-none fixed inset-0 z-[54]" />
      <motion.div
        className="pointer-events-none fixed inset-0 z-[53] opacity-70 mix-blend-screen"
        animate={{
          background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(255,184,0,0.12), rgba(56,225,255,0.05) 24%, transparent 48%)`,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />

      <nav className="fixed right-5 top-1/2 z-[58] hidden -translate-y-1/2 flex-col gap-3 lg:flex" aria-label="Experience scenes">
        {chapters.map((chapter) => {
          const isActive = active === chapter.id;
          return (
            <a key={chapter.id} href={`#${chapter.id}`} className="group flex items-center justify-end gap-3">
              <span className={`text-[10px] uppercase tracking-[0.25em] transition ${isActive ? "text-amber-300" : "text-slate-600 group-hover:text-slate-300"}`}>
                {chapter.label}
              </span>
              <span className={`h-2.5 w-2.5 rounded-full border transition ${isActive ? "border-amber-300 bg-amber-300 shadow-[0_0_16px_rgba(255,184,0,0.9)]" : "border-slate-600 bg-slate-900 group-hover:border-cyan-300"}`} />
            </a>
          );
        })}
      </nav>
    </>
  );
}

export function SceneFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-[#03060f]">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 animate-spinSlow rounded-full border border-amber-400/20 border-t-amber-400" />
        <div className="absolute inset-4 rounded-full bg-amber-400 shadow-[0_0_28px_rgba(255,184,0,0.7)]" />
      </div>
    </div>
  );
}