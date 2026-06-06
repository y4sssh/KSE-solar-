import Canvas from "./CanvasWrapper";
import { Suspense, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

const steps = [
  { icon: "☀️", title: "The Sun Emits Photons", desc: "Every second, the sun radiates particles of light energy toward Earth — more in one hour than humanity uses in a year." },
  { icon: "🔆", title: "Photon Hits the Solar Cell", desc: "Photons strike the N-Type TOPCon silicon wafer, energising electrons within the bifacial cell." },
  { icon: "⚛️", title: "Electrons Flow Through Circuits", desc: "Excited electrons break free and stream through the cell's circuitry, creating direct current (DC)." },
  { icon: "🔌", title: "Power Reaches the Inverter", desc: "The 3.3 KVA string inverter converts DC into clean, grid-ready AC at 98% efficiency." },
  { icon: "🔋", title: "Battery Stores Excess Energy", desc: "Surplus generation is banked in storage for evenings, cloudy days and grid backup." },
  { icon: "🏠", title: "The House Lights Up", desc: "Clean solar power flows through your home — appliances run, lights glow, the grid spins backward." },
];

function PhotonScene({ active }: { active: number }) {
  const beam = useRef<THREE.Mesh>(null);
  const cell = useRef<THREE.Mesh>(null);
  const electron = useRef<THREE.Mesh>(null);
  const house = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (beam.current) {
      (beam.current.material as THREE.MeshBasicMaterial).opacity =
        active >= 0 ? 0.6 + Math.sin(t * 4) * 0.2 : 0;
    }
    if (cell.current) {
      const mat = cell.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = active >= 1 ? 0.8 + Math.sin(t * 3) * 0.4 : 0.15;
    }
    if (electron.current) {
      electron.current.visible = active >= 2;
      electron.current.position.x = -1.5 + ((t * 1.5) % 3);
    }
    if (house.current) {
      const target = active >= 5 ? 1 : 0.15;
      house.current.children.forEach((c) => {
        const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial;
        if (m && m.emissiveIntensity !== undefined) {
          m.emissiveIntensity += (target - m.emissiveIntensity) * 0.05;
        }
      });
    }
  });

  return (
    <group>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 4, 3]} intensity={40} color="#ffb347" />
      <pointLight position={[-3, 2, 2]} intensity={20} color="#38e1ff" />

      {/* Sun */}
      <mesh position={[-3, 2.2, -1]}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial emissive="#ff9a1f" emissiveIntensity={2.5} color="#ffcf6b" toneMapped={false} />
      </mesh>

      {/* Light beam */}
      <mesh ref={beam} position={[-1.6, 1.1, -0.5]} rotation={[0, 0, -0.7]}>
        <cylinderGeometry args={[0.04, 0.18, 3, 12]} />
        <meshBasicMaterial color="#ffd27a" transparent opacity={0.5} />
      </mesh>

      {/* Solar cell */}
      <Float speed={1.5} floatIntensity={0.4} rotationIntensity={0.2}>
        <mesh ref={cell} position={[0.2, 0, 0]} rotation={[-0.4, 0.3, 0]}>
          <boxGeometry args={[1.8, 0.08, 1.2]} />
          <meshStandardMaterial color="#13305f" emissive="#1c4f9c" emissiveIntensity={0.15} metalness={0.9} roughness={0.2} />
        </mesh>
      </Float>

      {/* Electron */}
      <mesh ref={electron} position={[0, 0.4, 0.8]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#38e1ff" emissive="#38e1ff" emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* House */}
      <group ref={house} position={[2.6, -0.6, 0]} scale={0.8}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.2, 1, 1]} />
          <meshStandardMaterial color="#1a2540" emissive="#ffd27a" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[0, 0.75, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.95, 0.6, 4]} />
          <meshStandardMaterial color="#26344f" emissive="#ff7a18" emissiveIntensity={0.15} />
        </mesh>
      </group>
    </group>
  );
}

export default function JourneyPhoton() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            setActive(idx);
          }
        });
      },
      { threshold: 0.6 }
    );
    refs.current.forEach((r) => r && obs.observe(r));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="journey" className="relative bg-[#03060f]">
      <div className="mx-auto max-w-7xl px-6 pt-28 text-center md:px-10">
        <p className="text-xs uppercase tracking-[0.4em] text-amber-400">Section 02</p>
        <h2 className="font-display mt-3 text-4xl font-black text-white md:text-6xl">
          Journey of a <span className="text-gradient-solar">Photon</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-slate-400">
          Follow a single particle of sunlight as it transforms into the power that lights your home.
        </p>
      </div>

      <div className="relative mx-auto mt-12 grid max-w-7xl grid-cols-1 gap-8 px-6 md:grid-cols-2 md:px-10">
        {/* Sticky 3D canvas */}
        <div className="sticky top-0 hidden h-screen items-center md:flex">
          <div className="h-[70vh] w-full overflow-hidden rounded-3xl glass">
            <Canvas camera={{ position: [0, 0.5, 6], fov: 50 }} dpr={[1, 2]}>
              <color attach="background" args={["#05080f"]} />
              <Suspense fallback={null}>
                <PhotonScene active={active} />
              </Suspense>
            </Canvas>
          </div>
        </div>

        {/* Mobile canvas */}
        <div className="sticky top-16 z-10 h-[42vh] overflow-hidden rounded-3xl glass md:hidden">
          <Canvas camera={{ position: [0, 0.5, 6], fov: 50 }} dpr={[1, 2]}>
            <color attach="background" args={["#05080f"]} />
            <Suspense fallback={null}>
              <PhotonScene active={active} />
            </Suspense>
          </Canvas>
        </div>

        {/* Steps */}
        <div className="space-y-[40vh] py-[20vh]">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              data-idx={i}
              ref={(el) => { refs.current[i] = el; }}
              className={`rounded-2xl border p-7 transition-all duration-500 ${
                active === i
                  ? "glass-gold scale-105 border-amber-400/40"
                  : "glass border-white/5 opacity-60"
              }`}
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="text-3xl">{s.icon}</span>
                <span className="text-xs font-bold tracking-widest text-amber-400">
                  STEP {i + 1}/6
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-slate-300">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
