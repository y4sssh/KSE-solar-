import Canvas from "./CanvasWrapper";
import { Suspense, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, RoundedBox, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import { epcWorkflow, scopeMatrix } from "../data";

const controlTowerInfo = [
  { label: "Engineering Output", value: "Layout, SLD, BOM and string design" },
  { label: "Procurement Control", value: "Tier-1 equipment with vendor traceability" },
  { label: "Site Quality", value: "Pre-commissioning and stage-wise inspection" },
  { label: "Handover Pack", value: "As-built drawings, reports and monitoring access" },
];

function ScanField({ stage }: { stage: number }) {
  const scan = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!scan.current) return;
    scan.current.position.z = -1.8 + ((state.clock.elapsedTime * 0.8) % 3.6);
    const material = scan.current.material as THREE.MeshBasicMaterial;
    material.opacity = stage <= 1 ? 0.45 : 0.18;
  });

  return (
    <mesh ref={scan} position={[0, 0.035, -1.4]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4.8, 0.08]} />
      <meshBasicMaterial color="#38e1ff" transparent opacity={0.42} depthWrite={false} />
    </mesh>
  );
}

function EnergyPath({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.9, 0.42, -0.75),
      new THREE.Vector3(-0.8, 0.58, 0.12),
      new THREE.Vector3(0.45, 0.42, 0.55),
      new THREE.Vector3(1.75, 0.26, 0.92),
      new THREE.Vector3(2.35, 0.4, 0.18),
    ]);
    return new THREE.TubeGeometry(curve, 64, 0.018, 10, false);
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const material = ref.current.material as THREE.MeshBasicMaterial;
    material.opacity = active ? 0.42 + Math.sin(state.clock.elapsedTime * 5) * 0.2 : 0.05;
  });

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshBasicMaterial color="#ffb800" transparent opacity={0.2} depthWrite={false} />
    </mesh>
  );
}

function SolarArray({ stage }: { stage: number }) {
  const visiblePanels = stage >= 4 ? 24 : stage >= 3 ? 8 : 0;
  return (
    <group position={[-0.72, 0.28, -0.25]} rotation={[-0.42, 0, 0]}>
      {Array.from({ length: 24 }).map((_, i) => {
        const row = Math.floor(i / 8);
        const col = i % 8;
        const active = i < visiblePanels;
        return (
          <group key={i} position={[-1.4 + col * 0.4, 0, -0.45 + row * 0.42]} scale={active ? 1 : 0.001}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.34, 0.03, 0.32]} />
              <meshStandardMaterial color="#12305f" emissive="#1d63ff" emissiveIntensity={stage >= 5 ? 0.85 : 0.45} metalness={0.95} roughness={0.1} />
            </mesh>
            <group position={[0, 0.025, 0]}>
              <mesh position={[0, 0, 0.18]}><boxGeometry args={[0.38, 0.012, 0.018]} /><meshStandardMaterial color="#d5dde7" metalness={0.86} roughness={0.2} /></mesh>
              <mesh position={[0, 0, -0.18]}><boxGeometry args={[0.38, 0.012, 0.018]} /><meshStandardMaterial color="#d5dde7" metalness={0.86} roughness={0.2} /></mesh>
              <mesh position={[0.19, 0, 0]}><boxGeometry args={[0.018, 0.012, 0.36]} /><meshStandardMaterial color="#d5dde7" metalness={0.86} roughness={0.2} /></mesh>
              <mesh position={[-0.19, 0, 0]}><boxGeometry args={[0.018, 0.012, 0.36]} /><meshStandardMaterial color="#d5dde7" metalness={0.86} roughness={0.2} /></mesh>
            </group>
          </group>
        );
      })}
      {stage >= 3 && Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-1.4 + i * 0.4, -0.18, 0.02]} castShadow>
          <cylinderGeometry args={[0.018, 0.025, 0.45, 10]} />
          <meshStandardMaterial color="#a4afba" metalness={0.8} roughness={0.22} />
        </mesh>
      ))}
    </group>
  );
}

function ControlTower({ stage }: { stage: number }) {
  return (
    <group position={[2.2, 0.18, 0.2]} scale={stage >= 5 ? 1 : 0.78}>
      <RoundedBox args={[0.55, 0.9, 0.42]} radius={0.04} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color="#081322" emissive="#38e1ff" emissiveIntensity={stage >= 5 ? 0.55 : 0.15} metalness={0.5} roughness={0.24} />
      </RoundedBox>
      <mesh position={[0, 0.2, 0.23]}>
        <boxGeometry args={[0.38, 0.25, 0.025]} />
        <meshBasicMaterial color="#38e1ff" transparent opacity={stage >= 5 ? 0.72 : 0.22} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <torusGeometry args={[0.32, 0.008, 8, 64]} />
        <meshBasicMaterial color="#ffb800" transparent opacity={stage >= 5 ? 0.65 : 0.2} />
      </mesh>
      <pointLight position={[0, 0.6, 0.2]} intensity={stage >= 5 ? 8 : 1} color="#38e1ff" distance={3} />
    </group>
  );
}

function SurveyDrone({ stage }: { stage: number }) {
  const drone = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!drone.current) return;
    drone.current.position.x = Math.sin(state.clock.elapsedTime * 0.9) * 1.4;
    drone.current.position.z = -0.7 + Math.cos(state.clock.elapsedTime * 0.75) * 0.9;
    drone.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.35;
  });

  return (
    <group ref={drone} position={[0, stage <= 1 ? 1.45 : 0.9, -0.6]} scale={stage <= 1 ? 1 : 0.65}>
      <mesh>
        <boxGeometry args={[0.34, 0.08, 0.22]} />
        <meshStandardMaterial color="#0e1724" emissive="#38e1ff" emissiveIntensity={0.35} metalness={0.65} roughness={0.2} />
      </mesh>
      {[-0.28, 0.28].map((x) => [-0.18, 0.18].map((z) => (
        <mesh key={`${x}-${z}`} position={[x, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.09, 0.006, 8, 24]} />
          <meshBasicMaterial color="#38e1ff" transparent opacity={0.55} />
        </mesh>
      )))}
      <mesh position={[0, -0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.18, 0.8, 32, 1, true]} />
        <meshBasicMaterial color="#38e1ff" transparent opacity={stage <= 1 ? 0.16 : 0.05} depthWrite={false} />
      </mesh>
    </group>
  );
}

function EPCSiteTwin({ stage }: { stage: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.08;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.035;
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.34} />
      <Environment preset="city" />
      <Stars radius={32} depth={14} count={550} factor={2.5} fade speed={0.4} />
      <directionalLight position={[4, 5, 3]} intensity={2.6} color="#fff3d0" castShadow />
      <pointLight position={[-3, 2, 3]} intensity={22} color="#38e1ff" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.4, 4.6]} />
        <meshStandardMaterial color="#07101d" metalness={0.28} roughness={0.55} />
      </mesh>
      <gridHelper args={[6.4, 16, "#1c5a8c", "#0f2337"]} position={[0, 0.012, 0]} />
      <ScanField stage={stage} />
      <SurveyDrone stage={stage} />

      {stage >= 1 && (
        <group>
          {[-2.2, 2.2].map((x) => (
            <mesh key={x} position={[x, 0.055, -1.55]}>
              <cylinderGeometry args={[0.035, 0.035, 0.16, 16]} />
              <meshBasicMaterial color="#ffb800" transparent opacity={0.8} />
            </mesh>
          ))}
          <mesh position={[0, 0.08, -1.55]} rotation={[Math.PI / 2, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.008, 0.008, 4.4, 8]} />
            <meshBasicMaterial color="#ffb800" transparent opacity={0.55} />
          </mesh>
        </group>
      )}

      {stage >= 2 && (
        <group position={[-2.55, 0.34, 1.25]}>
          {Array.from({ length: 3 }).map((_, i) => (
            <RoundedBox key={i} args={[0.55, 0.74, 0.035]} radius={0.015} smoothness={2} position={[i * 0.18, i * 0.04, i * -0.02]} rotation={[0.12, -0.32, -0.08]}>
              <meshStandardMaterial color="#dbe7f5" emissive="#38e1ff" emissiveIntensity={0.08} roughness={0.32} />
            </RoundedBox>
          ))}
        </group>
      )}

      {stage >= 3 && (
        <group position={[-0.72, 0.08, -0.25]}>
          {Array.from({ length: 4 }).map((_, r) =>
            Array.from({ length: 8 }).map((_, c) => (
              <mesh key={`${r}-${c}`} position={[-1.4 + c * 0.4, 0, -0.63 + r * 0.42]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.32, 0.03]} />
                <meshBasicMaterial color="#a4afba" transparent opacity={0.65} />
              </mesh>
            ))
          )}
        </group>
      )}

      <SolarArray stage={stage} />
      <ControlTower stage={stage} />
      <EnergyPath active={stage >= 5} />

      {stage >= 4 && (
        <group position={[1.45, 0.18, 1.1]}>
          <RoundedBox args={[0.62, 0.82, 0.38]} radius={0.04} smoothness={3} castShadow receiveShadow>
            <meshStandardMaterial color="#0f1724" emissive="#ffb800" emissiveIntensity={0.18} metalness={0.55} roughness={0.22} />
          </RoundedBox>
          <mesh position={[0, 0.18, 0.2]}>
            <boxGeometry args={[0.42, 0.18, 0.025]} />
            <meshBasicMaterial color="#ffb800" transparent opacity={0.45} />
          </mesh>
        </group>
      )}

      <ContactShadows position={[0, -0.02, 0]} scale={7} opacity={0.32} blur={2.5} far={4} />
      <EffectComposer>
        <Bloom intensity={1.25} luminanceThreshold={0.1} luminanceSmoothing={0.8} mipmapBlur />
        <Vignette offset={0.2} darkness={0.6} />
      </EffectComposer>
    </group>
  );
}

export default function CommandCenter() {
  const [stage, setStage] = useState(0);
  const active = epcWorkflow[stage];
  const metrics = [
    { label: "Execution Phases", value: "6" },
    { label: "Scope Blocks", value: "5" },
    { label: "QA Gates", value: "12+" },
    { label: "Lifecycle", value: "30Y" },
  ];

  return (
    <section id="command" className="relative overflow-hidden section-pad bg-[#03060f]">
      <div className="pointer-events-none absolute inset-0 grid-floor opacity-25" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-400">Section 04</p>
          <h2 className="font-display mt-3 text-3xl font-black text-white sm:text-4xl md:text-6xl">
            EPC Project <span className="text-gradient-cyan">Control Tower</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            A professional project feature that visualizes how Kaustubh Solar Evolution converts a roof or site into a commissioned solar asset.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-5"
        >
          <div className="scene-layer h-[44vh] min-h-[320px] overflow-hidden rounded-3xl glass sm:h-[52vh] lg:col-span-3 lg:h-[62vh]">
            <Canvas
              shadows
              camera={{ position: [0, 3.1, 6.4], fov: 52 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, powerPreference: "high-performance" }}
              onCreated={({ gl }) => {
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.08;
              }}
            >
              <color attach="background" args={["#04070f"]} />
              <fog attach="fog" args={["#050d19", 7, 14]} />
              <Suspense fallback={null}>
                <EPCSiteTwin stage={stage} />
              </Suspense>
            </Canvas>
            <div className="interactive-layer absolute left-5 top-5 rounded-full glass-gold px-4 py-2 text-xs font-bold uppercase tracking-widest text-amber-300">
              Phase {active.phase} Active
            </div>
          </div>

          <div className="interactive-layer lg:col-span-2">
            <motion.div key={stage} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl glass-gold p-6">
              <div className="text-xs uppercase tracking-widest text-amber-300">Current Execution Phase</div>
              <h3 className="mt-2 text-2xl font-black text-white md:text-3xl">{active.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{active.desc}</p>
            </motion.div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl glass p-4 text-center">
                  <div className="text-2xl font-black text-gradient-cyan">{metric.value}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">{metric.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {controlTowerInfo.map((item) => (
                <div key={item.label} className="rounded-2xl glass p-4">
                  <div className="text-[10px] uppercase tracking-wider text-cyan-300">{item.label}</div>
                  <div className="mt-1 text-sm font-semibold text-white">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 max-h-[420px] space-y-2 overflow-y-auto pr-1 lg:max-h-none lg:overflow-visible lg:pr-0">
              {epcWorkflow.map((step, i) => (
                <button
                  key={step.phase}
                  type="button"
                  onClick={() => setStage(i)}
                  aria-pressed={stage === i}
                  className={`w-full rounded-2xl border p-4 text-left transition ${stage === i ? "glass-gold border-amber-400/40" : "glass border-white/5 opacity-75 hover:opacity-100"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${stage === i ? "bg-amber-400 text-black" : "bg-white/5 text-cyan-300"}`}>
                      {step.phase}
                    </span>
                    <span className="font-semibold text-white">{step.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-5">
          {scopeMatrix.map((scope, i) => (
            <motion.div key={scope.category} custom={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl glass p-4">
              <div className="font-bold text-white">{scope.category}</div>
              <div className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-400">{scope.items}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}