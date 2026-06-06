import Canvas from "./CanvasWrapper";
import { Suspense, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { products } from "../data";

function ProductModel({ id, color }: { id: string; color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_s, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.4;
  });
  return (
    <Float speed={1.5} floatIntensity={0.6} rotationIntensity={0.3}>
      <group ref={ref}>
        <mesh position={[0, -1.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.7, 0.01, 10, 100]} />
          <meshBasicMaterial color="#38e1ff" transparent opacity={0.28} />
        </mesh>
        {id === "modules" && (
          <group rotation={[-0.4, 0, 0]}>
            <mesh><boxGeometry args={[2.4, 0.08, 1.6]} /><meshStandardMaterial color="#0a1024" metalness={0.7} roughness={0.3} /></mesh>
            {Array.from({ length: 4 }).map((_, r) => Array.from({ length: 6 }).map((_, c) => (
              <mesh key={`${r}-${c}`} position={[-1 + c * 0.4, 0.06, -0.6 + r * 0.4]}>
                <boxGeometry args={[0.35, 0.02, 0.35]} />
                <meshStandardMaterial color={color} emissive="#1c4f9c" emissiveIntensity={0.5} metalness={0.9} roughness={0.15} />
              </mesh>
            )))}
          </group>
        )}
        {id === "inverter" && (
          <group>
            <mesh><boxGeometry args={[1.2, 1.8, 0.5]} /><meshStandardMaterial color={color} metalness={0.6} roughness={0.4} /></mesh>
            <mesh position={[0, 0.4, 0.27]}><boxGeometry args={[0.9, 0.5, 0.05]} /><meshStandardMaterial color="#020a08" emissive="#38e1ff" emissiveIntensity={0.6} /></mesh>
            {Array.from({ length: 5 }).map((_, i) => (
              <mesh key={i} position={[0, -0.5, 0.26]}><boxGeometry args={[0.8, 0.04, 0.02]} /></mesh>
            ))}
          </group>
        )}
        {id === "mounting" && (
          <group>
            {[-0.8, 0.8].map((x) => (<mesh key={x} position={[x, 0, 0]} rotation={[0, 0, 0.2]}><boxGeometry args={[0.1, 2, 0.1]} /><meshStandardMaterial color={color} metalness={0.8} roughness={0.3} /></mesh>))}
            <mesh position={[0, 0.8, 0]} rotation={[0, 0, 0.2]}><boxGeometry args={[2, 0.1, 0.1]} /><meshStandardMaterial color={color} metalness={0.8} roughness={0.3} /></mesh>
            <mesh position={[0, -0.4, 0]} rotation={[0, 0, 0.2]}><boxGeometry args={[2, 0.1, 0.1]} /><meshStandardMaterial color={color} metalness={0.8} roughness={0.3} /></mesh>
          </group>
        )}
        {(id === "cables" || id === "protection" || id === "acdb") && (
          <group>
            <mesh><torusKnotGeometry args={[0.7, 0.22, 100, 16]} /><meshStandardMaterial color={color} metalness={0.7} roughness={0.3} emissive={color} emissiveIntensity={0.2} /></mesh>
          </group>
        )}
      </group>
    </Float>
  );
}

function ProductGalaxy({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_s, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.08;
  });
  return (
    <group ref={ref}>
      <Stars radius={30} depth={16} count={650} factor={2.4} fade speed={0.5} />
      {[1.5, 2.05, 2.55].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2 + i * 0.22, i * 0.35, 0]}>
          <torusGeometry args={[r, 0.006, 8, 96]} />
          <meshBasicMaterial color={i % 2 ? color : "#38e1ff"} transparent opacity={0.22} />
        </mesh>
      ))}
      {Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 2.25, Math.sin(i) * 0.25, Math.sin(a) * 1.25]}>
            <sphereGeometry args={[0.055, 14, 14]} />
            <meshBasicMaterial color={i % 2 ? color : "#ffb800"} transparent opacity={0.75} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function Products() {
  const [sel, setSel] = useState(0);
  const p = products[sel];
  return (
    <section id="products" className="relative section-pad bg-[#03060f]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-400">Our Products</p>
          <h2 className="font-display mt-3 text-3xl font-black text-white sm:text-4xl md:text-6xl">
            Engineered <span className="text-gradient-solar">Components</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Every Kaustubh system is built from tier-1, proven equipment — powered by WAAREE.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* 3D viewer */}
          <div className="scene-layer h-[44vh] min-h-[320px] overflow-hidden rounded-3xl glass sm:h-[52vh] lg:h-[55vh]">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" style={{ background: `${p.color}44` }} />
            <Canvas shadows camera={{ position: [0, 0, 5.6], fov: 54 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "high-performance" }}>
              <color attach="background" args={["#04070f"]} />
              <ambientLight intensity={0.45} />
              <Environment preset="city" />
              <pointLight position={[4, 4, 4]} intensity={50} color="#ffffff" />
              <pointLight position={[-4, -2, 2]} intensity={20} color="#38e1ff" />
              <Suspense fallback={null}>
                <ProductGalaxy color={p.color} />
                <ProductModel key={p.id} id={p.id} color={p.color} />
                <ContactShadows position={[0, -1.55, 0]} scale={5} opacity={0.28} blur={2.2} far={4} />
                <EffectComposer>
                  <Bloom intensity={1.25} luminanceThreshold={0.12} luminanceSmoothing={0.76} mipmapBlur />
                  <Vignette offset={0.2} darkness={0.6} />
                </EffectComposer>
              </Suspense>
            </Canvas>
            <div className="interactive-layer absolute bottom-5 left-5 rounded-full glass-gold px-4 py-2 text-xs font-bold text-amber-300">
              {p.make}
            </div>
          </div>

          {/* details */}
          <div className="interactive-layer">
            <AnimatePresence mode="wait">
              <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                <h3 className="text-3xl font-black text-white">{p.name}</h3>
                <p className="mt-1 text-amber-400">{p.spec}</p>
                <p className="mt-4 text-slate-300">{p.desc}</p>
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Spec label="Efficiency" value={p.efficiency} />
                  <Spec label="Technology" value={p.technology} />
                  <Spec label="Material" value={p.material} />
                  <Spec label="Warranty" value={p.warranty} />
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex flex-wrap gap-2">
              {products.map((pr, i) => (
                <button
                  type="button"
                  key={pr.id}
                  onClick={() => setSel(i)}
                  aria-pressed={sel === i}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    sel === i ? "glass-gold border-amber-400/40 text-white" : "glass border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  {pr.name.split(" ").slice(0, 2).join(" ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl glass p-4">
      <div className="text-[10px] uppercase tracking-wider text-amber-400/80">{label}</div>
      <div className="mt-1 font-semibold text-white">{value}</div>
    </div>
  );
}
