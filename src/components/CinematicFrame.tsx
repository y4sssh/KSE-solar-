import Canvas from "./CanvasWrapper";
import { motion, useScroll, useSpring } from "framer-motion";

export default function CinematicFrame() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <div className="pointer-events-none fixed inset-0 z-[45] hidden overflow-hidden md:block" aria-hidden="true">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 to-transparent" />
      <div className="absolute left-6 top-1/2 h-[52vh] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent" />
      <div className="absolute right-6 top-1/2 h-[52vh] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-amber-300/30 to-transparent" />

      <div className="absolute left-8 top-28 font-mono text-[10px] uppercase tracking-[0.35em] text-cyan-200/45">
        KSE WebGL Energy Experience
      </div>
      <div className="absolute bottom-8 right-8 font-mono text-[10px] uppercase tracking-[0.35em] text-amber-200/45">
        Solar EPC // Digital Twin // Impact Engine
      </div>

      <motion.div className="absolute bottom-0 left-0 h-px w-full origin-left bg-gradient-to-r from-amber-400 via-cyan-300 to-transparent" style={{ scaleX }} />
      <div className="cinematic-scanline absolute inset-0" />
    </div>
  );
}