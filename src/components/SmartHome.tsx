import Canvas from "./CanvasWrapper";
import { Suspense, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Float, RoundedBox } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";

const appliances = [
  { id: "ac", name: "Air Conditioner", icon: "AC", draw: 1.5, pos: [-0.95, 0.52, 0.68] as [number, number, number] },
  { id: "fridge", name: "Refrigerator", icon: "FR", draw: 0.35, pos: [0.86, 0.32, 0.68] as [number, number, number] },
  { id: "ev", name: "EV Charger", icon: "EV", draw: 3.2, pos: [1.2, -0.62, -0.62] as [number, number, number] },
  { id: "heater", name: "Water Heater", icon: "WH", draw: 2.0, pos: [-1.15, -0.55, -0.46] as [number, number, number] },
];

const homeIntelligence = [
  { label: "Priority Logic", value: "Solar first, battery second, grid last" },
  { label: "Critical Loads", value: "Lighting, refrigeration, router and backup circuits" },
  { label: "EV Strategy", value: "Charge during peak generation windows" },
  { label: "Monitoring", value: "Room-wise load visibility and alerts" },
];

function MiniGableRoof({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const geometry = new THREE.BufferGeometry();
  const w = 1.8 * scale;
  const d = 1.15 * scale;
  const h = 0.5 * scale;
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
    -w, 0, -d, w, 0, -d, -w, 0, d, w, 0, d, -w, h, 0, w, h, 0,
  ]), 3));
  geometry.setIndex([0, 1, 5, 0, 5, 4, 2, 4, 5, 2, 5, 3, 0, 4, 2, 1, 3, 5, 0, 2, 3, 0, 3, 1]);
  geometry.computeVertexNormals();
  return (
    <mesh position={position} castShadow receiveShadow>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color="#162135" metalness={0.48} roughness={0.24} transparent opacity={0.88} />
    </mesh>
  );
}

function ApplianceModel({ id, on, position }: { id: string; on: boolean; position: [number, number, number] }) {
  const color = on ? "#ffb800" : "#314057";
  if (id === "ev") {
    return (
      <group position={position}>
        <RoundedBox args={[0.58, 0.2, 0.3]} radius={0.05} smoothness={3} castShadow>
          <meshStandardMaterial color={color} emissive={on ? "#ffb800" : "#000000"} emissiveIntensity={on ? 1.4 : 0} metalness={0.55} roughness={0.22} />
        </RoundedBox>
        <mesh position={[-0.18, -0.12, 0.13]}><torusGeometry args={[0.06, 0.018, 8, 18]} /><meshStandardMaterial color="#101722" metalness={0.6} roughness={0.3} /></mesh>
        <mesh position={[0.18, -0.12, 0.13]}><torusGeometry args={[0.06, 0.018, 8, 18]} /><meshStandardMaterial color="#101722" metalness={0.6} roughness={0.3} /></mesh>
      </group>
    );
  }

  return (
    <group position={position}>
      <RoundedBox args={id === "ac" ? [0.46, 0.18, 0.18] : [0.22, 0.46, 0.2]} radius={0.035} smoothness={3} castShadow>
        <meshStandardMaterial color={color} emissive={on ? "#ffb800" : "#000000"} emissiveIntensity={on ? 1.25 : 0} toneMapped={false} metalness={0.45} roughness={0.23} />
      </RoundedBox>
      <mesh position={[0, 0.05, 0.11]}>
        <boxGeometry args={id === "ac" ? [0.32, 0.035, 0.02] : [0.12, 0.18, 0.02]} />
        <meshBasicMaterial color={on ? "#fff3c2" : "#38e1ff"} transparent opacity={on ? 0.72 : 0.22} />
      </mesh>
    </group>
  );
}

function EnergyBeam({ to, active }: { to: [number, number, number]; active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const from: [number, number, number] = [0, 1.5, 0];
  const mid = new THREE.Vector3((from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2);
  const dir = new THREE.Vector3(to[0] - from[0], to[1] - from[1], to[2] - from[2]);
  const len = dir.length();
  useFrame((s) => {
    if (ref.current) {
      const m = ref.current.material as THREE.MeshBasicMaterial;
      m.opacity = active ? 0.7 + Math.sin(s.clock.elapsedTime * 6) * 0.3 : 0;
    }
  });
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  return (
    <group>
      <mesh ref={ref} position={mid} quaternion={quaternion}>
        <cylinderGeometry args={[0.026, 0.026, len, 12]} />
        <meshBasicMaterial color="#ffb800" transparent opacity={0} depthWrite={false} />
      </mesh>
      {active && Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[mid.x + Math.sin(i) * 0.08, mid.y, mid.z + Math.cos(i) * 0.08]} quaternion={quaternion}>
          <cylinderGeometry args={[0.006, 0.006, len, 8]} />
          <meshBasicMaterial color="#38e1ff" transparent opacity={0.45} depthWrite={false} />
        </mesh>
      ))}
      {active && Array.from({ length: 4 }).map((_, i) => <EnergyPacket key={`packet-${i}`} from={from} to={to} delay={i * 0.22} />)}
    </group>
  );
}

function EnergyPacket({ from, to, delay }: { from: [number, number, number]; to: [number, number, number]; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = (state.clock.elapsedTime * 0.65 + delay) % 1;
    const eased = THREE.MathUtils.smoothstep(t, 0, 1);
    ref.current.position.set(
      THREE.MathUtils.lerp(from[0], to[0], eased),
      THREE.MathUtils.lerp(from[1], to[1], eased),
      THREE.MathUtils.lerp(from[2], to[2], eased)
    );
    const s = 0.07 + Math.sin(state.clock.elapsedTime * 8 + delay) * 0.015;
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshBasicMaterial color="#ffcf6b" transparent opacity={0.95} depthWrite={false} />
    </mesh>
  );
}

function RoofSolarArray() {
  return (
    <Float speed={1} floatIntensity={0.08}>
      <group position={[0, 1.52, 0.62]} rotation={[-0.62, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.95, 0.045, 0.92]} />
          <meshStandardMaterial color="#071026" metalness={0.8} roughness={0.14} />
        </mesh>
        {Array.from({ length: 3 }).map((_, r) =>
          Array.from({ length: 6 }).map((_, c) => (
            <mesh key={`${r}-${c}`} position={[-0.78 + c * 0.31, 0.04, -0.28 + r * 0.28]}>
              <boxGeometry args={[0.25, 0.014, 0.23]} />
              <meshStandardMaterial color="#0c3270" emissive="#1c4f9c" emissiveIntensity={0.55} metalness={0.9} roughness={0.1} />
            </mesh>
          ))
        )}
      </group>
    </Float>
  );
}

function UtilityCore({ active }: { active: string[] }) {
  const load = active.length;
  return (
    <group position={[0, -0.62, 1.12]}>
      <RoundedBox args={[0.42, 0.72, 0.18]} radius={0.035} smoothness={3} position={[-0.34, 0, 0]} castShadow>
        <meshStandardMaterial color="#0b1320" emissive="#38e1ff" emissiveIntensity={0.18 + load * 0.1} metalness={0.55} roughness={0.22} />
      </RoundedBox>
      <RoundedBox args={[0.42, 0.72, 0.18]} radius={0.035} smoothness={3} position={[0.34, 0, 0]} castShadow>
        <meshStandardMaterial color="#111826" emissive="#ffb800" emissiveIntensity={0.1 + load * 0.08} metalness={0.55} roughness={0.22} />
      </RoundedBox>
      <mesh position={[-0.34, 0.12, 0.1]}><boxGeometry args={[0.26, 0.12, 0.018]} /><meshBasicMaterial color="#38e1ff" transparent opacity={0.65} /></mesh>
      <mesh position={[0.34, 0.12, 0.1]}><boxGeometry args={[0.26, 0.12, 0.018]} /><meshBasicMaterial color="#ffb800" transparent opacity={0.55} /></mesh>
    </group>
  );
}

function HouseScene({ active }: { active: string[] }) {
  const group = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.2) * 0.28;
      group.current.rotation.x = Math.sin(s.clock.elapsedTime * 0.13) * 0.04;
      group.current.position.y = Math.sin(s.clock.elapsedTime * 0.55) * 0.04;
    }
  });
  return (
    <group ref={group} scale={1.08}>
      <ambientLight intensity={0.32} />
      <Environment preset="city" />
      <pointLight position={[3, 4, 3]} intensity={55} color="#fff0d0" />
      <pointLight position={[-3, 2, -2]} intensity={28} color="#38e1ff" />

      <mesh position={[0, -1.08, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[5.7, 3.8]} />
        <meshStandardMaterial color="#071326" metalness={0.35} roughness={0.5} />
      </mesh>
      <gridHelper args={[5.7, 12, "#38e1ff", "#13253d"]} position={[0, -1.03, 0]} />

      {/* Transparent architectural shell */}
      <RoundedBox args={[3.6, 2.06, 2.18]} radius={0.04} smoothness={3} position={[0, 0.02, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#9edcff" transparent opacity={0.12} transmission={0.32} roughness={0.04} metalness={0.1} />
      </RoundedBox>
      <MiniGableRoof position={[0, 1.08, 0]} scale={1.03} />

      {/* Interior rooms */}
      {[
        [-0.86, -0.28, 0.58, "#143661"],
        [0.86, -0.28, 0.58, "#193d2d"],
        [-0.86, 0.55, -0.48, "#30204f"],
        [0.86, 0.55, -0.48, "#463114"],
      ].map(([x, y, z, color], i) => (
        <RoundedBox key={i} args={[1.35, 0.68, 0.82]} radius={0.03} smoothness={3} position={[x as number, y as number, z as number]}>
          <meshStandardMaterial color={color as string} transparent opacity={0.35} emissive={color as string} emissiveIntensity={0.08} />
        </RoundedBox>
      ))}

      {[-0.86, 0.86].map((x) => (
        <mesh key={`wall-${x}`} position={[x, 0.12, 0]}>
          <boxGeometry args={[0.035, 1.75, 2.08]} />
          <meshStandardMaterial color="#dceeff" transparent opacity={0.18} roughness={0.16} />
        </mesh>
      ))}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[3.52, 1.75, 0.035]} />
        <meshStandardMaterial color="#dceeff" transparent opacity={0.16} roughness={0.16} />
      </mesh>

      <RoofSolarArray />
      <UtilityCore active={active} />

      {/* Appliance nodes */}
      {appliances.map((a) => {
        const on = active.includes(a.id);
        return (
          <group key={a.id}>
            <ApplianceModel id={a.id} on={on} position={a.pos} />
            <mesh position={a.pos}>
              <sphereGeometry args={[0.22, 24, 24]} />
              <meshBasicMaterial color={on ? "#ffb800" : "#38e1ff"} transparent opacity={on ? 0.18 : 0.05} />
            </mesh>
            <EnergyBeam to={a.pos} active={on} />
          </group>
        );
      })}
      <mesh position={[0, -0.05, 1.13]}>
        <boxGeometry args={[3.55, 1.4, 0.035]} />
        <meshPhysicalMaterial color="#b9e7ff" transparent opacity={0.12} transmission={0.28} roughness={0.04} />
      </mesh>
      <ContactShadows position={[0, -1.08, 0]} scale={6} opacity={0.32} blur={2.5} far={4} />
      <EffectComposer>
        <Bloom intensity={1.25} luminanceThreshold={0.12} luminanceSmoothing={0.7} mipmapBlur />
        <Vignette offset={0.2} darkness={0.58} />
      </EffectComposer>
    </group>
  );
}

export default function SmartHome() {
  const [active, setActive] = useState<string[]>(["fridge"]);
  const toggle = (id: string) => setActive((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const totalDraw = appliances.filter((a) => active.includes(a.id)).reduce((s, a) => s + a.draw, 0);
  const solarAvailable = 3.3;
  const batterySupport = Math.max(0, totalDraw - solarAvailable);
  const solarCoverage = Math.min(100, (solarAvailable / Math.max(totalDraw, 0.1)) * 100);

  return (
    <section id="twin" className="relative section-pad bg-gradient-to-b from-[#03060f] to-[#060a16]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-400">Section 05</p>
          <h2 className="font-display mt-3 text-3xl font-black text-white sm:text-4xl md:text-6xl">
            Smart Home <span className="text-gradient-solar">Digital Twin</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            A premium cutaway villa showing rooftop generation, energy routing, appliance load behavior, battery support and EV charging in real time.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="scene-layer h-[44vh] min-h-[320px] overflow-hidden rounded-3xl glass sm:h-[52vh] lg:col-span-3 lg:h-[55vh]">
            <Canvas shadows camera={{ position: [0, 0.5, 6.4], fov: 54 }} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "high-performance" }}>
              <color attach="background" args={["#05080f"]} />
              <Suspense fallback={null}>
                <HouseScene active={active} />
              </Suspense>
            </Canvas>
          </div>

          <div className="interactive-layer flex flex-col gap-4 lg:col-span-2">
            <div className="glass-gold rounded-2xl p-5">
              <div className="text-xs uppercase tracking-wider text-amber-400">Total Live Draw</div>
              <div className="mt-1 text-3xl font-black text-white md:text-4xl">{totalDraw.toFixed(2)} <span className="text-lg text-slate-400">kW</span></div>
              <div className="mt-2 text-xs text-emerald-400">
                {totalDraw <= solarAvailable ? "Fully covered by solar generation" : "Battery support engaged for peak load"}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl glass p-4 text-center">
                <div className="text-xl font-black text-amber-300">{solarAvailable.toFixed(1)}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">kW Solar</div>
              </div>
              <div className="rounded-2xl glass p-4 text-center">
                <div className="text-xl font-black text-cyan-300">{solarCoverage.toFixed(0)}%</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">Coverage</div>
              </div>
              <div className="rounded-2xl glass p-4 text-center">
                <div className="text-xl font-black text-emerald-300">{batterySupport.toFixed(1)}</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400">kW Backup</div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {appliances.map((a) => {
                const on = active.includes(a.id);
                return (
                  <motion.button
                    type="button"
                    key={a.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggle(a.id)}
                    aria-pressed={on}
                    className={`rounded-2xl border p-4 text-left transition ${
                      on ? "glass-gold border-amber-400/40" : "glass border-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{a.icon}</span>
                      <span className={`h-3 w-3 rounded-full ${on ? "bg-amber-400 shadow-[0_0_10px_#ffb800]" : "bg-slate-600"}`} />
                    </div>
                    <div className="mt-3 text-sm font-semibold text-white">{a.name}</div>
                    <div className="text-xs text-slate-400">{a.draw} kW</div>
                  </motion.button>
                );
              })}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {homeIntelligence.map((item) => (
                <div key={item.label} className="rounded-2xl glass p-4">
                  <div className="text-[10px] uppercase tracking-wider text-amber-300">{item.label}</div>
                  <div className="mt-1 text-sm font-semibold text-white">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
