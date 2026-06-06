import Canvas from "./CanvasWrapper";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { xrayLayers } from "../data";

function HoloParticles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 340;
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 9;
      p[i * 3 + 1] = (Math.random() - 0.5) * 5;
      p[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return p;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.035;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#66e8ff" size={0.025} transparent opacity={0.45} depthWrite={false} />
    </points>
  );
}

function LayerShell({ index, y, hovered, setHovered }: { index: number; y: number; hovered: number; setHovered: (n: number) => void }) {
  const layer = xrayLayers[index];
  const isCells = index === 2;
  const isHover = hovered === index;

  return (
    <group position={[0, y, 0]} scale={isHover ? 1.055 : 1}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setHovered(index); }}
        onPointerOut={() => setHovered(-1)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[3.8, isCells ? 0.12 : 0.055, 2.35]} />
        <meshPhysicalMaterial
          color={layer.color}
          metalness={isCells ? 0.82 : 0.18}
          roughness={isCells ? 0.18 : 0.04}
          transmission={isCells ? 0 : 0.35}
          thickness={0.25}
          transparent
          opacity={isCells ? 1 : 0.5}
          emissive={isHover ? "#ffb800" : isCells ? "#173a7a" : "#103147"}
          emissiveIntensity={isHover ? 0.85 : isCells ? 0.18 : 0.08}
        />
      </mesh>

      {isCells && (
        <group position={[0, 0.085, 0]}>
          {Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 10 }).map((_, c) => (
              <mesh key={`${r}-${c}`} position={[-1.64 + c * 0.365, 0.02, -0.86 + r * 0.345]}>
                <boxGeometry args={[0.31, 0.018, 0.29]} />
                <meshStandardMaterial color="#081a3a" emissive="#1f5dff" emissiveIntensity={0.44} metalness={0.94} roughness={0.12} />
              </mesh>
            ))
          )}
        </group>
      )}

      {index === 4 && (
        <group position={[0, -0.02, 0]}>
          <mesh position={[0, 0, 1.23]}><boxGeometry args={[4.15, 0.09, 0.12]} /><meshStandardMaterial color="#a9b2bd" metalness={0.7} roughness={0.22} /></mesh>
          <mesh position={[0, 0, -1.23]}><boxGeometry args={[4.15, 0.09, 0.12]} /><meshStandardMaterial color="#a9b2bd" metalness={0.7} roughness={0.22} /></mesh>
          <mesh position={[2.06, 0, 0]}><boxGeometry args={[0.12, 0.09, 2.5]} /><meshStandardMaterial color="#a9b2bd" metalness={0.7} roughness={0.22} /></mesh>
          <mesh position={[-2.06, 0, 0]}><boxGeometry args={[0.12, 0.09, 2.5]} /><meshStandardMaterial color="#a9b2bd" metalness={0.7} roughness={0.22} /></mesh>
        </group>
      )}
    </group>
  );
}

function Layers({ progress, hovered, setHovered }: { progress: number; hovered: number; setHovered: (n: number) => void }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.11;
    group.current.rotation.x = -0.48 + Math.sin(state.clock.elapsedTime * 0.35) * 0.04;
  });

  return (
    <group ref={group} rotation={[-0.48, 0, 0]}>
      {xrayLayers.map((layer, i) => {
        const spread = THREE.MathUtils.smoothstep(progress, 0.06, 0.92) * 2.75;
        const y = layer.y * (0.22 + spread);
        return <LayerShell key={layer.name} index={i} y={y} hovered={hovered} setHovered={setHovered} />;
      })}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.05, 0.006, 12, 96]} />
        <meshBasicMaterial color="#38e1ff" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

export default function SolarXray() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(-1);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setProgress(total > 0 ? scrolled / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeIdx = hovered >= 0 ? hovered : Math.min(xrayLayers.length - 1, Math.floor(progress * xrayLayers.length));
  const layer = xrayLayers[activeIdx];

  return (
    <section id="xray" ref={sectionRef} className="relative h-[280vh] bg-gradient-to-b from-[#03060f] via-[#060a16] to-[#03060f]">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="z-10 px-6 pt-24 text-center md:px-10">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-400">Premium Module Deconstruction</p>
          <h2 className="font-display mt-3 text-4xl font-black text-white md:text-6xl">
            Solar Panel <span className="text-gradient-cyan">X-Ray</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
            Scroll to separate the Waaree bifacial module into precision-engineered layers.
          </p>
        </div>

        <div className="scene-layer flex flex-1 items-center">
          <div className="absolute inset-0">
            <Canvas shadows camera={{ position: [0, 1.15, 6.6], fov: 46 }} dpr={[1, 1.8]} gl={{ antialias: true, powerPreference: "high-performance" }}>
              <color attach="background" args={["#03060f"]} />
              <fog attach="fog" args={["#031021", 7, 16]} />
              <ambientLight intensity={0.34} />
              <Environment preset="city" />
              <pointLight position={[5, 5, 5]} intensity={70} color="#ffffff" />
              <pointLight position={[-5, -2, 3]} intensity={38} color="#38e1ff" />
              <Suspense fallback={null}>
                <HoloParticles />
                <Layers progress={progress} hovered={hovered} setHovered={setHovered} />
                <ContactShadows position={[0, -3.2, 0]} opacity={0.32} scale={9} blur={2.8} far={6} />
                <EffectComposer>
                  <Bloom intensity={1.2} luminanceThreshold={0.16} luminanceSmoothing={0.7} mipmapBlur />
                  <Vignette offset={0.18} darkness={0.65} />
                </EffectComposer>
              </Suspense>
            </Canvas>
          </div>

          <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 w-[90%] max-w-md -translate-x-1/2 md:left-10 md:translate-x-0">
            <div className="glass-gold rounded-2xl p-6 shadow-[0_0_50px_-28px_rgba(255,184,0,0.9)]">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-black">LAYER {activeIdx + 1}</span>
                <h3 className="text-xl font-bold text-white">{layer.name}</h3>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Info label="Material" value={layer.material} />
                <Info label="Efficiency" value={layer.efficiency} />
                <Info label="Technology" value={layer.tech} />
                <Info label="Warranty" value={layer.warranty} />
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-3 md:flex">
            {xrayLayers.map((l, i) => (
              <div key={l.name} className="flex items-center gap-2">
                <span className={`text-xs ${activeIdx === i ? "text-amber-400" : "text-slate-600"}`}>{l.name}</span>
                <span className={`h-2 w-2 rounded-full transition ${activeIdx === i ? "bg-amber-400 shadow-[0_0_12px_#ffb800]" : "bg-slate-700"}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-black/35 p-3">
      <div className="text-[10px] uppercase tracking-wider text-amber-400/80">{label}</div>
      <div className="mt-0.5 font-semibold text-white">{value}</div>
    </div>
  );
}