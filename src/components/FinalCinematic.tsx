import Canvas from "./CanvasWrapper";
import { Suspense, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

function GlowingEarth() {
  const earth = useRef<THREE.Mesh>(null);
  const lights = useRef<THREE.Points>(null);
  useFrame((_s, dt) => {
    if (earth.current) earth.current.rotation.y += dt * 0.1;
    if (lights.current) lights.current.rotation.y += dt * 0.1;
  });

  const cityLights = useMemo(() => {
    const n = 600;
    const p = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = new THREE.Vector3();
      const phi = Math.acos(-1 + (2 * i) / n);
      const theta = Math.sqrt(n * Math.PI) * phi;
      v.setFromSphericalCoords(2.02, phi, theta);
      p[i * 3] = v.x; p[i * 3 + 1] = v.y; p[i * 3 + 2] = v.z;
    }
    return p;
  }, []);

  return (
    <group>
      <mesh ref={earth}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial color="#0a2247" emissive="#08305c" emissiveIntensity={0.4} roughness={0.6} metalness={0.3} />
      </mesh>
      <points ref={lights}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[cityLights, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#ffcf6b" transparent opacity={0.95} toneMapped={false} />
      </points>
      <mesh>
        <sphereGeometry args={[2.18, 48, 48]} />
        <meshBasicMaterial color="#38e1ff" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.5, 48, 48]} />
        <meshBasicMaterial color="#ffb800" transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function CameraPullback() {
  const t = useRef(0);
  useFrame((state, dt) => {
    t.current += dt;
    const z = 5 + Math.min(3, t.current * 0.15);
    state.camera.position.z += (z - state.camera.position.z) * 0.02;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function FinalCinematic() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]}>
          <color attach="background" args={["#02030a"]} />
          <ambientLight intensity={0.3} />
          <pointLight position={[6, 4, 6]} intensity={50} color="#fff0d0" />
          <pointLight position={[-6, -3, 2]} intensity={20} color="#38e1ff" />
          <Suspense fallback={null}>
            <Stars radius={80} depth={50} count={4000} factor={5} fade speed={1} />
            <GlowingEarth />
            <CameraPullback />
          </Suspense>
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#02030a] via-transparent to-[#02030a]" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="text-xs uppercase tracking-[0.5em] text-amber-400">
          Kaustubh Solar Evolution
        </motion.p>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} className="font-display mt-4 max-w-4xl text-5xl font-black leading-tight text-white md:text-7xl">
          One Sun. <span className="text-gradient-solar">Infinite</span> Possibilities.
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} className="mt-6 max-w-xl text-slate-400">
          As the camera pulls away, city lights keep glowing — powered entirely by the sun.
        </motion.p>
        <motion.a initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.7 }} href="#contact" className="mt-9 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-9 py-4 text-sm font-bold text-black transition hover:scale-105 hover:shadow-[0_0_35px_-2px_rgba(255,150,20,0.8)]">
          Start Your Solar Journey
        </motion.a>
      </div>
    </section>
  );
}
