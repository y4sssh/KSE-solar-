import Canvas from "./CanvasWrapper";
import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";

const countries = [
  { name: "India", lat: 21, lon: 78, installs: "180+", co2: "8.2K T", energy: "11.4 GWh", trees: "369K", segment: "Rooftop + EPC growth market" },
  { name: "USA", lat: 38, lon: -97, installs: "60", co2: "2.1K T", energy: "3.1 GWh", trees: "94K", segment: "Residential storage and EV charging" },
  { name: "Germany", lat: 51, lon: 10, installs: "45", co2: "1.4K T", energy: "2.2 GWh", trees: "63K", segment: "Commercial decarbonisation" },
  { name: "Australia", lat: -25, lon: 134, installs: "70", co2: "1.8K T", energy: "2.8 GWh", trees: "81K", segment: "Hybrid storage leadership" },
  { name: "UAE", lat: 24, lon: 54, installs: "35", co2: "900 T", energy: "1.5 GWh", trees: "40K", segment: "Industrial solar and cooling loads" },
  { name: "Japan", lat: 36, lon: 138, installs: "30", co2: "700 T", energy: "1.1 GWh", trees: "31K", segment: "High-efficiency rooftop systems" },
];

function latLonToVec3(lat: number, lon: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

function AtmosphereRings() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_s, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.045;
  });
  return (
    <group ref={ref}>
      {[2.18, 2.38, 2.58].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2 + i * 0.2, i * 0.55, 0]}>
          <torusGeometry args={[r, 0.006, 8, 128]} />
          <meshBasicMaterial color={i % 2 ? "#ffb800" : "#38e1ff"} transparent opacity={0.2} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Globe({ onSelect }: { onSelect: (i: number) => void }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_s, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.12;
  });

  const dots = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    const n = 800;
    for (let i = 0; i < n; i++) {
      const phi = Math.acos(-1 + (2 * i) / n);
      const theta = Math.sqrt(n * Math.PI) * phi;
      const v = new THREE.Vector3();
      v.setFromSphericalCoords(2, phi, theta);
      arr.push(v);
    }
    return arr;
  }, []);

  const dotPositions = useMemo(() => {
    const p = new Float32Array(dots.length * 3);
    dots.forEach((d, i) => { p[i * 3] = d.x; p[i * 3 + 1] = d.y; p[i * 3 + 2] = d.z; });
    return p;
  }, [dots]);

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.98, 48, 48]} />
        <meshStandardMaterial color="#08172e" metalness={0.4} roughness={0.7} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.08, 48, 48]} />
        <meshBasicMaterial color="#38e1ff" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>
      <AtmosphereRings />
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dotPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.035} color="#2e6ea8" transparent opacity={0.8} />
      </points>

      {countries.map((c, i) => {
        const pos = latLonToVec3(c.lat, c.lon, 2.05);
        return (
          <group key={c.name} position={pos}>
            <mesh
              onPointerOver={(e) => { e.stopPropagation(); onSelect(i); document.body.style.cursor = "pointer"; }}
              onClick={(e) => { e.stopPropagation(); onSelect(i); }}
              onPointerOut={() => { document.body.style.cursor = "auto"; }}
            >
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial color="#ffb800" emissive="#ffb800" emissiveIntensity={2} toneMapped={false} />
            </mesh>
            <Pulse />
          </group>
        );
      })}
      {countries.slice(1).map((c, i) => (
        <EnergyArc key={c.name} from={countries[0]} to={c} delay={i * 0.4} />
      ))}
    </group>
  );
}

function EnergyArc({ from, to, delay }: { from: typeof countries[number]; to: typeof countries[number]; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const a = latLonToVec3(from.lat, from.lon, 2.08);
    const b = latLonToVec3(to.lat, to.lon, 2.08);
    const mid = a.clone().add(b).normalize().multiplyScalar(3.0);
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    return new THREE.TubeGeometry(curve, 42, 0.012, 8, false);
  }, [from, to]);

  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.16 + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.12;
  });

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshBasicMaterial color="#ffb800" transparent opacity={0.2} depthWrite={false} />
    </mesh>
  );
}

function Pulse() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ref.current) {
      const t = (s.clock.elapsedTime % 2) / 2;
      ref.current.scale.setScalar(1 + t * 3);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - t);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.07, 16, 16]} />
      <meshBasicMaterial color="#ffb800" transparent opacity={0.5} />
    </mesh>
  );
}

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver((e) => {
      if (e[0].isIntersecting) {
        let start = 0;
        const step = () => { start += target / 60; if (start < target) { setV(start); requestAnimationFrame(step); } else setV(target); };
        step();
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <div ref={ref} className="text-3xl font-black text-gradient-solar md:text-4xl">{Math.round(v).toLocaleString()}{suffix}</div>;
}

export default function ImpactGlobe() {
  const [sel, setSel] = useState(0);
  const c = countries[sel];
  return (
    <section id="impact" className="relative overflow-hidden section-pad bg-gradient-to-b from-[#060a16] to-[#03060f]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-400">Section 07</p>
          <h2 className="font-display mt-3 text-3xl font-black text-white sm:text-4xl md:text-6xl">
            Solar <span className="text-gradient-solar">Impact Globe</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Hover the glowing nodes to explore our clean-energy footprint across the world.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="h-[44vh] min-h-[320px] overflow-hidden rounded-3xl sm:h-[52vh] lg:h-[60vh]">
            <Canvas camera={{ position: [0, 0, 6.2], fov: 48 }} dpr={[1, 1.5]}>
              <color attach="background" args={["#03060f"]} />
              <ambientLight intensity={0.6} />
              <pointLight position={[5, 3, 5]} intensity={40} color="#ffffff" />
              <pointLight position={[-5, -2, -3]} intensity={15} color="#38e1ff" />
              <Suspense fallback={null}>
                <Stars radius={50} depth={30} count={1500} factor={3} fade />
                <Globe onSelect={setSel} />
                <EffectComposer>
                  <Bloom intensity={1.45} luminanceThreshold={0.08} luminanceSmoothing={0.8} mipmapBlur />
                  <Vignette offset={0.2} darkness={0.62} />
                </EffectComposer>
              </Suspense>
            </Canvas>
          </div>

          <div>
            <motion.div key={sel} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-gold rounded-3xl p-7">
              <div className="text-xs uppercase tracking-widest text-amber-400">Selected Region</div>
              <h3 className="mt-1 text-3xl font-black text-white">{c.name}</h3>
              <p className="mt-2 text-sm text-slate-300">{c.segment}</p>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-black/30 p-4">
                  <div className="text-2xl font-black text-white">{c.installs}</div>
                  <div className="text-xs text-slate-400">Installations</div>
                </div>
                <div className="rounded-xl bg-black/30 p-4">
                  <div className="text-2xl font-black text-emerald-400">{c.co2}</div>
                  <div className="text-xs text-slate-400">CO₂ Saved / yr</div>
                </div>
                <div className="rounded-xl bg-black/30 p-4">
                  <div className="text-2xl font-black text-cyan-300">{c.energy}</div>
                  <div className="text-xs text-slate-400">Clean Energy</div>
                </div>
                <div className="rounded-xl bg-black/30 p-4">
                  <div className="text-2xl font-black text-amber-300">{c.trees}</div>
                  <div className="text-xs text-slate-400">Trees Equivalent</div>
                </div>
              </div>
            </motion.div>

            <div className="mt-4 flex flex-wrap gap-2">
              {countries.map((country, i) => (
                <button
                  key={country.name}
                  type="button"
                  onClick={() => setSel(i)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${sel === i ? "glass-gold border-amber-400/40 text-white" : "glass border-white/5 text-slate-400 hover:text-white"}`}
                >
                  {country.name}
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
              <div className="glass rounded-2xl p-5"><Counter target={450} suffix="+" /><div className="mt-1 text-xs text-slate-400">Global Installs</div></div>
              <div className="glass rounded-2xl p-5"><Counter target={12800} suffix="T" /><div className="mt-1 text-xs text-slate-400">CO₂ Saved</div></div>
              <div className="glass rounded-2xl p-5"><Counter target={576000} suffix="" /><div className="mt-1 text-xs text-slate-400">Trees Equiv.</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
