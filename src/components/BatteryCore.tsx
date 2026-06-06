import Canvas from "./CanvasWrapper";
import { Suspense, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, RoundedBox, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";

const modes = [
  { id: "charge", label: "Charge", color: "#38e1ff", dir: 1, desc: "Surplus solar energy floods the cells — ions stream upward as the core charges." },
  { id: "discharge", label: "Discharge", color: "#ffb800", dir: -1, desc: "Stored power releases to your home — energy particles cascade outward to the load." },
  { id: "backup", label: "Backup", color: "#ff4d4d", dir: -1, desc: "Grid outage detected. The core instantly delivers seamless backup power." },
  { id: "night", label: "Night", color: "#7c9bff", dir: -1, desc: "Sun is down. The home runs entirely on banked daytime solar energy." },
  { id: "independence", label: "Grid Independence", color: "#34d399", dir: 1, desc: "Hybrid control isolates critical loads and keeps essential circuits running from solar plus storage." },
];

const batterySpecs = [
  { label: "Battery Chemistry", value: "LFP-grade safety profile" },
  { label: "BMS Protection", value: "Thermal, surge and overload monitoring" },
  { label: "Backup Use Case", value: "Critical load continuity" },
  { label: "Integration", value: "Solar, inverter and grid ready" },
];

function BatteryCabinet({ color }: { color: string }) {
  const display = useRef<THREE.Mesh>(null);
  const fans = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (display.current) {
      const material = display.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.45 + Math.sin(state.clock.elapsedTime * 3) * 0.18;
    }
    fans.current?.children.forEach((fan) => {
      fan.rotation.z += dt * 4.2;
    });
  });

  return (
    <group>
      {/* Professional battery cabinet shell */}
      <RoundedBox args={[2.15, 3.05, 0.82]} radius={0.08} smoothness={4} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#0d1524" emissive={color} emissiveIntensity={0.08} metalness={0.72} roughness={0.24} />
      </RoundedBox>
      <RoundedBox args={[1.85, 2.55, 0.08]} radius={0.035} smoothness={3} position={[0, 0.04, 0.44]} castShadow>
        <meshPhysicalMaterial color="#152236" transparent opacity={0.38} transmission={0.12} roughness={0.06} metalness={0.35} />
      </RoundedBox>

      {/* Stack of serviceable battery modules */}
      {Array.from({ length: 6 }).map((_, i) => (
        <group key={i} position={[0, -1.02 + i * 0.38, 0.5]}>
          <RoundedBox args={[1.62, 0.26, 0.14]} radius={0.025} smoothness={3} castShadow>
            <meshStandardMaterial color="#101c2d" emissive={color} emissiveIntensity={0.12 + i * 0.015} metalness={0.55} roughness={0.22} />
          </RoundedBox>
          <mesh position={[-0.64, 0, 0.08]}><boxGeometry args={[0.12, 0.08, 0.015]} /><meshBasicMaterial color={color} transparent opacity={0.8} /></mesh>
          <mesh position={[0.64, 0, 0.08]}><boxGeometry args={[0.12, 0.08, 0.015]} /><meshBasicMaterial color="#ffb800" transparent opacity={0.6} /></mesh>
          <mesh position={[0, 0.15, 0.04]}><boxGeometry args={[1.48, 0.012, 0.018]} /><meshStandardMaterial color="#637181" metalness={0.7} roughness={0.24} /></mesh>
        </group>
      ))}

      {/* BMS display and status rail */}
      <mesh ref={display} position={[0, 1.18, 0.52]}>
        <boxGeometry args={[1.28, 0.38, 0.025]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, 1.49, 0.53]}>
        <boxGeometry args={[1.7, 0.035, 0.02]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
      </mesh>

      {/* Copper busbars */}
      {[-0.86, 0.86].map((x) => (
        <mesh key={x} position={[x, -0.04, 0.56]} castShadow>
          <boxGeometry args={[0.055, 2.2, 0.04]} />
          <meshStandardMaterial color="#b87333" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Cooling fans */}
      <group ref={fans} position={[0, -1.37, 0.53]}>
        {[-0.48, 0.48].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[0.17, 0.012, 8, 32]} />
            <meshStandardMaterial color="#7d8792" metalness={0.65} roughness={0.22} />
          </mesh>
        ))}
      </group>

      {/* Energy spine */}
      <mesh position={[0, 0, 0.66]}>
        <cylinderGeometry args={[0.028, 0.028, 2.65, 18]} />
        <meshBasicMaterial color={color} transparent opacity={0.55} />
      </mesh>
      <pointLight position={[0, 0.4, 0.75]} intensity={12} color={color} distance={4} />
    </group>
  );
}

function Core({ color, dir }: { color: string; dir: number }) {
  const points = useRef<THREE.Points>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  const { positions, speeds, radii, angles } = useMemo(() => {
    const n = 400;
    const positions = new Float32Array(n * 3);
    const speeds = new Float32Array(n);
    const radii = new Float32Array(n);
    const angles = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      radii[i] = Math.random() * 0.85;
      angles[i] = Math.random() * Math.PI * 2;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      speeds[i] = 0.5 + Math.random() * 1.2;
    }
    return { positions, speeds, radii, angles };
  }, []);

  useFrame((state, dt) => {
    const pos = points.current?.geometry.attributes.position as THREE.BufferAttribute;
    if (pos) {
      for (let i = 0; i < speeds.length; i++) {
        let y = pos.getY(i) + dir * speeds[i] * dt;
        if (y > 1.5) y = -1.5;
        if (y < -1.5) y = 1.5;
        const a = angles[i] + state.clock.elapsedTime * 0.5;
        pos.setX(i, Math.cos(a) * radii[i]);
        pos.setY(i, y);
        pos.setZ(i, Math.sin(a) * radii[i]);
      }
      pos.needsUpdate = true;
    }
    if (ring1.current) ring1.current.rotation.z += dt * 0.6;
    if (ring2.current) ring2.current.rotation.z -= dt * 0.4;
  });

  return (
    <group>
      <ambientLight intensity={0.4} />
      <Environment preset="night" />
      <pointLight position={[0, 0, 4]} intensity={30} color={color} />
      <pointLight position={[0, 3, 0]} intensity={15} color="#ffffff" />
      <Stars radius={32} depth={18} count={700} factor={2.5} fade speed={0.4} />

      <BatteryCabinet color={color} />

      {/* Energy rings */}
      <mesh ref={ring1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.03, 16, 64]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} toneMapped={false} />
      </mesh>
      {[0.9, 1.55, -0.9, -1.55].map((y, i) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, i * 0.4]}>
          <torusGeometry args={[0.82 + (i % 2) * 0.28, 0.012, 12, 80]} />
          <meshBasicMaterial color={i % 2 ? "#ffffff" : color} transparent opacity={0.42} />
        </mesh>
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[Math.cos(i) * 0.55, -1.15 + i * 0.25, Math.sin(i) * 0.55]} rotation={[Math.PI / 2, 0, i * 0.7]}>
          <torusGeometry args={[0.18 + (i % 3) * 0.05, 0.004, 8, 28]} />
          <meshBasicMaterial color={color} transparent opacity={0.34} />
        </mesh>
      ))}
      <PlasmaWaves color={color} />
      <ElectricArcs color={color} />
      <mesh ref={ring2} position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.25, 0.02, 16, 64]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={1.5} toneMapped={false} />
      </mesh>

      {/* Particles */}
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.06} color={color} transparent opacity={0.9} toneMapped={false} />
      </points>
      <EffectComposer>
        <Bloom intensity={1.75} luminanceThreshold={0.08} luminanceSmoothing={0.75} mipmapBlur />
        <Vignette offset={0.2} darkness={0.62} />
      </EffectComposer>
    </group>
  );
}

function PlasmaWaves({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    group.current?.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const t = (state.clock.elapsedTime * 0.65 + i * 0.25) % 1;
      mesh.scale.setScalar(0.55 + t * 2.2);
      const material = mesh.material as THREE.MeshBasicMaterial;
      material.opacity = 0.24 * (1 - t);
    });
  });
  return (
    <group ref={group}>
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.6]}>
          <torusGeometry args={[0.35, 0.008, 8, 64]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function ElectricArcs({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);
  const arcs = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const a = i * 0.9;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(Math.cos(a) * 0.28, -1.25, Math.sin(a) * 0.28),
        new THREE.Vector3(Math.cos(a + 0.4) * 0.72, -0.35, Math.sin(a + 0.4) * 0.72),
        new THREE.Vector3(Math.cos(a + 0.8) * 0.38, 0.45, Math.sin(a + 0.8) * 0.38),
        new THREE.Vector3(Math.cos(a + 1.1) * 0.78, 1.25, Math.sin(a + 1.1) * 0.78),
      ]);
      return new THREE.TubeGeometry(curve, 28, 0.006, 6, false);
    });
  }, []);
  useFrame((state) => {
    group.current?.children.forEach((child, i) => {
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = 0.05 + Math.max(0, Math.sin(state.clock.elapsedTime * 4 + i)) * 0.32;
    });
  });
  return (
    <group ref={group}>
      {arcs.map((geometry, i) => (
        <mesh key={i} geometry={geometry}>
          <meshBasicMaterial color={i % 2 ? "#ffffff" : color} transparent opacity={0.15} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

export default function BatteryCore() {
  const [mode, setMode] = useState(modes[0]);
  return (
    <section id="battery" className="relative overflow-hidden section-pad bg-[#03060f]">
      <div className="pointer-events-none absolute inset-0 grid-floor opacity-20" />
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-400">Section 06</p>
          <h2 className="font-display mt-3 text-3xl font-black text-white sm:text-4xl md:text-6xl">
            Battery <span className="text-gradient-cyan">Energy Core</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            A sci-fi storage reactor. Switch modes to watch energy particles flow through the cells.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="relative h-[44vh] min-h-[320px] overflow-hidden rounded-3xl glass sm:h-[52vh] lg:h-[60vh]">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] transition-colors duration-700"
              style={{ background: `${mode.color}33` }}
            />
            <Canvas camera={{ position: [0, 0, 6.3], fov: 54 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "high-performance" }}>
              <color attach="background" args={["#04060e"]} />
              <Suspense fallback={null}>
                <Core color={mode.color} dir={mode.dir} />
              </Suspense>
            </Canvas>
          </div>

          <div className="interactive-layer">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {modes.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMode(m)}
                  aria-pressed={mode.id === m.id}
                  className={`rounded-2xl border p-4 text-left transition ${
                    mode.id === m.id ? "glass border-white/20 scale-[1.02]" : "glass border-white/5 opacity-70"
                  }`}
                  style={mode.id === m.id ? { boxShadow: `0 0 30px -8px ${m.color}` } : {}}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ background: m.color, boxShadow: `0 0 10px ${m.color}` }} />
                    <span className="font-bold text-white">{m.label}</span>
                  </div>
                </button>
              ))}
            </div>
            <motion.div key={mode.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-2xl glass p-6">
              <p className="text-lg text-slate-200">{mode.desc}</p>
              <div className="mt-5 grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
                <Stat label="Capacity" value="10 kWh" />
                <Stat label="Cycles" value="6000+" />
                <Stat label="Backup" value="< 20ms" />
              </div>
            </motion.div>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {batterySpecs.map((spec) => (
                <div key={spec.label} className="rounded-2xl glass p-4">
                  <div className="text-[10px] uppercase tracking-wider text-cyan-300">{spec.label}</div>
                  <div className="mt-1 text-sm font-semibold text-white">{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-black/30 p-3">
      <div className="text-lg font-black text-white">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  );
}
