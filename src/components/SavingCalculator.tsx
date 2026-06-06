import Canvas from "./CanvasWrapper";
import { Suspense, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, RoundedBox } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";

function GableRoof({ width, depth, height, position }: { width: number; depth: number; height: number; position: [number, number, number] }) {
  const geometry = useMemo(() => {
    const w = width / 2;
    const d = depth / 2;
    const vertices = new Float32Array([
      -w, 0, -d, w, 0, -d, -w, 0, d, w, 0, d, -w, height, 0, w, height, 0,
    ]);
    const indices = [0, 1, 5, 0, 5, 4, 2, 4, 5, 2, 5, 3, 0, 4, 2, 1, 3, 5, 0, 2, 3, 0, 3, 1];
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [width, depth, height]);

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <primitive object={geometry} attach="geometry" />
        <meshStandardMaterial color="#1c2636" metalness={0.42} roughness={0.26} />
      </mesh>
      <mesh position={[0, -0.02, depth / 2 + 0.035]} castShadow>
        <boxGeometry args={[width + 0.22, 0.08, 0.1]} />
        <meshStandardMaterial color="#e5e8df" roughness={0.36} />
      </mesh>
      <mesh position={[0, -0.02, -depth / 2 - 0.035]} castShadow>
        <boxGeometry args={[width + 0.22, 0.08, 0.1]} />
        <meshStandardMaterial color="#e5e8df" roughness={0.36} />
      </mesh>
      <mesh position={[0, height + 0.02, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.026, 0.026, width + 0.08, 16]} />
        <meshStandardMaterial color="#0e1520" metalness={0.55} roughness={0.28} />
      </mesh>
      <group position={[0, height * 0.45, depth * 0.26]} rotation={[-Math.atan(height / (depth / 2)), 0, 0]}>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[-width / 2 + 0.32 + i * (width - 0.64) / 11, 0.018, 0]} castShadow>
            <boxGeometry args={[0.012, 0.014, depth * 0.52]} />
            <meshStandardMaterial color="#26354a" metalness={0.55} roughness={0.24} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Window({ position, wide = false }: { position: [number, number, number]; wide?: boolean }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[wide ? 0.62 : 0.38, 0.46, 0.035]} />
        <meshStandardMaterial color="#111923" emissive="#ffbd66" emissiveIntensity={0.32} toneMapped={false} metalness={0.25} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0, 0.032]}>
        <boxGeometry args={[wide ? 0.72 : 0.48, 0.55, 0.035]} />
        <meshStandardMaterial color="#f4f1e6" roughness={0.34} />
      </mesh>
      <mesh position={[0, 0, 0.055]}>
        <boxGeometry args={[wide ? 0.62 : 0.38, 0.46, 0.03]} />
        <meshPhysicalMaterial color="#c9efff" transparent opacity={0.26} transmission={0.18} roughness={0.02} />
      </mesh>
      <mesh position={[0, 0, 0.025]}>
        <boxGeometry args={[0.035, 0.52, 0.035]} />
        <meshStandardMaterial color="#f1ead8" roughness={0.34} />
      </mesh>
      <mesh position={[0, 0, 0.06]} rotation={[0, 0, -0.35]}>
        <planeGeometry args={[wide ? 0.42 : 0.24, 0.09]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.16} depthWrite={false} />
      </mesh>
    </group>
  );
}

function ExteriorDetailing() {
  return (
    <group>
      {/* Facade trim and siding lines make the house read as an architectural model. */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`siding-${i}`} position={[0.1, -0.9 + i * 0.17, 1.105]}>
          <boxGeometry args={[2.65, 0.012, 0.018]} />
          <meshStandardMaterial color="#d9dfd8" roughness={0.5} />
        </mesh>
      ))}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={`garage-siding-${i}`} position={[-1.98, -0.9 + i * 0.16, 1.115]}>
          <boxGeometry args={[1.55, 0.012, 0.018]} />
          <meshStandardMaterial color="#d9dfd8" roughness={0.5} />
        </mesh>
      ))}
      {[-1.22, 1.52, -2.83, -1.12, 1.03, 2.28].map((x) => (
        <mesh key={x} position={[x, -0.55, x > 1.1 ? 0.92 : 1.1]} castShadow>
          <boxGeometry args={[0.075, 0.96, 0.07]} />
          <meshStandardMaterial color="#ffffff" roughness={0.36} />
        </mesh>
      ))}
      <mesh position={[0.1, -0.02, 1.12]} castShadow>
        <boxGeometry args={[2.9, 0.08, 0.09]} />
        <meshStandardMaterial color="#f4f1e6" roughness={0.34} />
      </mesh>
      <mesh position={[-1.98, -0.16, 1.13]} castShadow>
        <boxGeometry args={[1.82, 0.075, 0.085]} />
        <meshStandardMaterial color="#f4f1e6" roughness={0.34} />
      </mesh>
    </group>
  );
}

function RoofHardware() {
  return (
    <group>
      <mesh position={[-1.65, 0.7, -0.42]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.46, 16]} />
        <meshStandardMaterial color="#2e3946" metalness={0.45} roughness={0.32} />
      </mesh>
      <mesh position={[1.25, 0.9, -0.52]} castShadow>
        <boxGeometry args={[0.28, 0.58, 0.28]} />
        <meshStandardMaterial color="#38414a" roughness={0.62} metalness={0.08} />
      </mesh>
      <mesh position={[1.25, 1.22, -0.52]} castShadow>
        <boxGeometry args={[0.38, 0.08, 0.38]} />
        <meshStandardMaterial color="#1b222b" roughness={0.4} />
      </mesh>
      {[[-1.95, 0.12, 1.46], [2.1, 0.12, 1.46]].map(([x, y, z]) => (
        <mesh key={x} position={[x, y, z]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 0.9, 12]} />
          <meshStandardMaterial color="#c8d0d8" metalness={0.72} roughness={0.22} />
        </mesh>
      ))}
    </group>
  );
}

function Landscaping() {
  return (
    <group>
      {[-2.6, -2.1, 2.2, 2.65].map((x, i) => (
        <mesh key={`shrub-${i}`} position={[x, -1.04, 1.45 + (i % 2) * 0.22]} castShadow>
          <sphereGeometry args={[0.24 + (i % 2) * 0.04, 16, 16]} />
          <meshStandardMaterial color={i % 2 ? "#2f6a3a" : "#245a31"} roughness={0.88} />
        </mesh>
      ))}
      {[-3.1, 3.2].map((x) => (
        <group key={x} position={[x, -1.02, -1.2]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.06, 0.09, 0.55, 9]} />
            <meshStandardMaterial color="#47311d" />
          </mesh>
          <mesh position={[0, 0.48, 0]} castShadow>
            <sphereGeometry args={[0.42, 18, 18]} />
            <meshStandardMaterial color="#224f2f" roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function PremiumLotBackground() {
  return (
    <group>
      <mesh position={[0, -1.2, -1.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[11, 7]} />
        <meshStandardMaterial color="#18311f" roughness={0.94} />
      </mesh>
      <mesh position={[0, -1.195, 2.65]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 2.2]} />
        <meshStandardMaterial color="#535c5e" roughness={0.82} />
      </mesh>
      {[-4.6, -3.7, 3.65, 4.5].map((x, i) => (
        <group key={x} position={[x, -1.02, -1.8 - (i % 2) * 0.6]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.12, 0.72, 9]} />
            <meshStandardMaterial color="#46301d" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.62, 0]} castShadow>
            <sphereGeometry args={[0.55, 18, 18]} />
            <meshStandardMaterial color="#244f2f" roughness={0.86} />
          </mesh>
        </group>
      ))}
      {[-3.2, -2.65, 2.7, 3.25].map((x, i) => (
        <mesh key={`front-shrub-${x}`} position={[x, -1.02, 1.38 + (i % 2) * 0.16]} castShadow>
          <sphereGeometry args={[0.22 + (i % 2) * 0.04, 16, 16]} />
          <meshStandardMaterial color="#2f6a3a" roughness={0.88} />
        </mesh>
      ))}
    </group>
  );
}

function FrontPorch() {
  return (
    <group position={[1.65, -0.52, 1.15]}>
      <mesh position={[0, -0.45, 0.06]} receiveShadow castShadow>
        <boxGeometry args={[1.45, 0.08, 0.85]} />
        <meshStandardMaterial color="#626b68" roughness={0.78} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, -0.52 - i * 0.035, 0.53 + i * 0.16]} receiveShadow castShadow>
          <boxGeometry args={[1.25 - i * 0.16, 0.055, 0.16]} />
          <meshStandardMaterial color="#6d7673" roughness={0.8} />
        </mesh>
      ))}
      {[-0.58, 0.58].map((x) => (
        <mesh key={x} position={[x, 0.05, -0.18]} castShadow>
          <cylinderGeometry args={[0.045, 0.055, 0.86, 18]} />
          <meshStandardMaterial color="#f4f1e6" roughness={0.34} />
        </mesh>
      ))}
      <mesh position={[0, 0.48, -0.18]} castShadow>
        <boxGeometry args={[1.42, 0.08, 0.18]} />
        <meshStandardMaterial color="#f4f1e6" roughness={0.36} />
      </mesh>
    </group>
  );
}

function SiteHardware() {
  return (
    <group>
      {/* Outdoor AC condenser */}
      <group position={[-2.18, -0.82, -1.34]}>
        <RoundedBox args={[0.42, 0.34, 0.32]} radius={0.035} smoothness={3} castShadow receiveShadow>
          <meshStandardMaterial color="#c9d1d6" metalness={0.42} roughness={0.34} />
        </RoundedBox>
        <mesh position={[0, 0.02, 0.17]}>
          <torusGeometry args={[0.13, 0.008, 8, 32]} />
          <meshStandardMaterial color="#1a2530" metalness={0.6} roughness={0.28} />
        </mesh>
      </group>

      {/* Utility meter and conduit */}
      <group position={[-2.08, -0.44, 1.32]}>
        <RoundedBox args={[0.22, 0.34, 0.04]} radius={0.018} smoothness={2} castShadow>
          <meshStandardMaterial color="#e5e7df" roughness={0.38} metalness={0.05} />
        </RoundedBox>
        <mesh position={[0, 0.04, 0.03]}>
          <circleGeometry args={[0.07, 24]} />
          <meshBasicMaterial color="#101824" />
        </mesh>
        <mesh position={[0, -0.28, 0.02]}>
          <cylinderGeometry args={[0.012, 0.012, 0.55, 8]} />
          <meshStandardMaterial color="#8f9aa4" metalness={0.7} roughness={0.24} />
        </mesh>
      </group>

      {/* Low boundary fence */}
      {[-3.25, -2.55, -1.85, 1.85, 2.55, 3.25].map((x) => (
        <mesh key={`post-${x}`} position={[x, -0.92, -1.92]} castShadow>
          <boxGeometry args={[0.055, 0.5, 0.055]} />
          <meshStandardMaterial color="#596267" roughness={0.55} metalness={0.12} />
        </mesh>
      ))}
      {[-1, 1].map((y) => (
        <mesh key={`rail-${y}`} position={[0, -0.92 + y * 0.12, -1.92]} castShadow>
          <boxGeometry args={[6.8, 0.035, 0.04]} />
          <meshStandardMaterial color="#596267" roughness={0.55} metalness={0.12} />
        </mesh>
      ))}
    </group>
  );
}

function GarageDetail() {
  return (
    <group position={[-1.98, -0.68, 1.12]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.18, 0.62, 0.05]} />
        <meshStandardMaterial color="#dfe5e6" roughness={0.36} metalness={0.05} />
      </mesh>
      {[-0.2, 0, 0.2].map((y) => (
        <mesh key={y} position={[0, y, 0.03]}>
          <boxGeometry args={[1.08, 0.014, 0.018]} />
          <meshStandardMaterial color="#9aa5ac" roughness={0.45} />
        </mesh>
      ))}
      {[-0.36, 0, 0.36].map((x) => (
        <mesh key={x} position={[x, 0, 0.032]}>
          <boxGeometry args={[0.014, 0.54, 0.018]} />
          <meshStandardMaterial color="#aeb7bd" roughness={0.42} />
        </mesh>
      ))}
    </group>
  );
}

function SolarWiringHarness() {
  const cable = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.9, 0.88, 0.9),
      new THREE.Vector3(1.65, 0.45, 1.25),
      new THREE.Vector3(2.2, -0.1, 1.22),
      new THREE.Vector3(2.68, -0.35, 0.55),
    ]);
    return new THREE.TubeGeometry(curve, 40, 0.01, 8, false);
  }, []);
  return (
    <mesh geometry={cable}>
      <meshStandardMaterial color="#10151d" metalness={0.35} roughness={0.45} />
    </mesh>
  );
}

function GrowingPanel({ position, delay }: { position: [number, number, number]; delay: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const target = THREE.MathUtils.clamp((state.clock.elapsedTime - delay) * 1.8, 0, 1);
    const eased = THREE.MathUtils.smoothstep(target, 0, 1);
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, eased, 0.08));
  });
  return (
    <group ref={ref} position={position} scale={0.01}>
      <mesh castShadow>
        <boxGeometry args={[0.44, 0.035, 0.36]} />
        <meshStandardMaterial color="#08265f" emissive="#174c9f" emissiveIntensity={0.28} metalness={0.84} roughness={0.14} />
      </mesh>
      <group position={[0, 0.024, 0]}>
        <mesh position={[0, 0, 0.205]}><boxGeometry args={[0.5, 0.014, 0.018]} /><meshStandardMaterial color="#dce5ee" metalness={0.86} roughness={0.18} /></mesh>
        <mesh position={[0, 0, -0.205]}><boxGeometry args={[0.5, 0.014, 0.018]} /><meshStandardMaterial color="#dce5ee" metalness={0.86} roughness={0.18} /></mesh>
        <mesh position={[0.25, 0, 0]}><boxGeometry args={[0.018, 0.014, 0.42]} /><meshStandardMaterial color="#dce5ee" metalness={0.86} roughness={0.18} /></mesh>
        <mesh position={[-0.25, 0, 0]}><boxGeometry args={[0.018, 0.014, 0.42]} /><meshStandardMaterial color="#dce5ee" metalness={0.86} roughness={0.18} /></mesh>
        <mesh position={[0, 0.01, 0]}><boxGeometry args={[0.012, 0.012, 0.34]} /><meshStandardMaterial color="#edf7ff" metalness={0.65} roughness={0.28} /></mesh>
      </group>
      <mesh position={[0.04, 0.04, -0.04]} rotation={[-Math.PI / 2, 0, -0.15]}>
        <planeGeometry args={[0.36, 0.1]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} depthWrite={false} />
      </mesh>
    </group>
  );
}

function RoofSolarMount({ count, capacity }: { count: number; capacity: number }) {
  const cols = 5;
  const visualPanels = Math.min(20, Math.max(10, count));
  const panels = useMemo(() => Array.from({ length: visualPanels }), [visualPanels]);
  return (
    <group position={[-0.1, 0.98, 1.04]} rotation={[0.48, 0, 0]}>
      {[-0.58, 0.48].map((z) => (
        <mesh key={z} position={[0, -0.025, z]} castShadow>
          <boxGeometry args={[3.0, 0.04, 0.04]} />
          <meshStandardMaterial color="#bac5ce" metalness={0.9} roughness={0.18} />
        </mesh>
      ))}
      <mesh position={[0, -0.01, -0.04]} castShadow receiveShadow>
        <boxGeometry args={[3.08, 0.03, 1.58]} />
        <meshStandardMaterial color="#050914" metalness={0.5} roughness={0.2} />
      </mesh>
      {panels.map((_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        return <GrowingPanel key={`${visualPanels}-${i}`} position={[-1.08 + c * 0.54, 0.06, -0.58 + r * 0.43]} delay={i * 0.018} />;
      })}
      <mesh position={[0.2, 0.112, -0.05]} rotation={[-Math.PI / 2, 0, -0.1]}>
        <planeGeometry args={[2.25, 0.48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.14 + Math.min(capacity, 8) * 0.006} depthWrite={false} />
      </mesh>
    </group>
  );
}

function EnergyLine() {
  const ref = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.9, 0.9),
      new THREE.Vector3(1.2, 0.45, 1.2),
      new THREE.Vector3(2.2, -0.25, 1.15),
      new THREE.Vector3(2.7, -0.55, 0.45),
    ]);
    return new THREE.TubeGeometry(curve, 48, 0.014, 8, false);
  }, []);

  useFrame((state) => {
    if (ref.current) {
      const material = ref.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.42 + Math.sin(state.clock.elapsedTime * 4) * 0.18;
    }
  });

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshBasicMaterial color="#ffb800" transparent opacity={0.55} depthWrite={false} />
    </mesh>
  );
}

function InstallDrone({ count }: { count: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const phase = state.clock.elapsedTime * 0.55;
    ref.current.position.x = -1.6 + ((phase % 1) * 3.2);
    ref.current.position.z = 0.15 + Math.sin(phase * 3) * 0.28;
    ref.current.position.y = 1.55 + Math.sin(state.clock.elapsedTime * 2) * 0.04;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.35;
  });
  return (
    <group ref={ref} visible={count > 6}>
      <mesh><boxGeometry args={[0.28, 0.07, 0.18]} /><meshStandardMaterial color="#0b1320" emissive="#38e1ff" emissiveIntensity={0.35} metalness={0.6} roughness={0.25} /></mesh>
      {[-0.22, 0.22].map((x) => [-0.14, 0.14].map((z) => (
        <mesh key={`${x}-${z}`} position={[x, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.06, 0.004, 8, 18]} />
          <meshBasicMaterial color="#38e1ff" transparent opacity={0.5} />
        </mesh>
      )))}
      <mesh position={[0, -0.34, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.16, 0.7, 32, 1, true]} />
        <meshBasicMaterial color="#38e1ff" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  );
}

function RoofMeasurementGrid({ capacity }: { capacity: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, i) => {
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 1.6 + i) * 0.04;
    });
  });
  return (
    <group ref={ref} position={[-0.1, 0.98, 1.04]} rotation={[0.48, 0, 0]}>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`x-${i}`} position={[-1.55 + i * 0.62, 0.02, 0]}>
          <boxGeometry args={[0.012, 0.012, 1.35]} />
          <meshBasicMaterial color={capacity > 4 ? "#ffb800" : "#38e1ff"} transparent opacity={0.12} />
        </mesh>
      ))}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={`z-${i}`} position={[0, 0.02, -0.66 + i * 0.44]}>
          <boxGeometry args={[3.2, 0.012, 0.012]} />
          <meshBasicMaterial color={capacity > 4 ? "#ffb800" : "#38e1ff"} transparent opacity={0.12} />
        </mesh>
      ))}
    </group>
  );
}

function SunPath({ capacity }: { capacity: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.18;
  });
  return (
    <group ref={ref} position={[0, 1.45, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.35, 0.008, 8, 96, Math.PI]} />
        <meshBasicMaterial color="#ffb800" transparent opacity={0.28} depthWrite={false} />
      </mesh>
      <mesh position={[-1.2 + capacity * 0.12, 0.8, 0]}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshBasicMaterial color="#ffb800" transparent opacity={0.85} toneMapped={false} />
      </mesh>
    </group>
  );
}

function PremiumHomeSystem({ count, capacity }: { count: number; capacity: number }) {
  const group = useRef<THREE.Group>(null);
  const scale = THREE.MathUtils.clamp(0.92 + capacity / 35, 0.95, 1.18);

  useFrame((state, dt) => {
    if (!group.current) return;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -0.18 + Math.sin(state.clock.elapsedTime * 0.25) * 0.12, 2.6, dt);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.035;
  });

  return (
    <group ref={group} scale={scale} position={[0, -0.34, 0]}>
      <ambientLight intensity={0.34} />
      <Environment preset="sunset" />
      <hemisphereLight args={["#ffe7be", "#172133", 0.55]} />
      <directionalLight position={[3.5, 5, 4]} intensity={2.3} color="#ffd9a0" castShadow />
      <pointLight position={[-3, 2, 2]} intensity={9} color="#8fdcff" />

      <PremiumLotBackground />
      {/* Proper architectural massing: garage wing, main living volume and raised entry bay. */}
      <RoundedBox args={[2.65, 1.05, 2.2]} radius={0.035} smoothness={3} position={[0.15, -0.62, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#eef1eb" roughness={0.55} />
      </RoundedBox>
      <RoundedBox args={[1.72, 0.95, 2.0]} radius={0.035} smoothness={3} position={[-1.85, -0.72, 0.1]} castShadow receiveShadow>
        <meshStandardMaterial color="#e7ebe4" roughness={0.58} />
      </RoundedBox>
      <RoundedBox args={[1.35, 1.32, 1.8]} radius={0.035} smoothness={3} position={[1.72, -0.48, 0.06]} castShadow receiveShadow>
        <meshStandardMaterial color="#f1f2ed" roughness={0.54} />
      </RoundedBox>
      <RoundedBox args={[1.45, 0.58, 0.16]} radius={0.025} smoothness={3} position={[1.72, -0.82, 1.0]} castShadow receiveShadow>
        <meshStandardMaterial color="#7b8179" roughness={0.75} />
      </RoundedBox>
      <ExteriorDetailing />
      <GableRoof width={3.05} depth={2.55} height={0.76} position={[0.15, -0.02, 0]} />
      <GableRoof width={1.98} depth={2.38} height={0.62} position={[-1.85, -0.2, 0.08]} />
      <GableRoof width={1.58} depth={2.15} height={0.68} position={[1.72, 0.22, 0.06]} />
      <RoofHardware />

      <Window position={[-0.62, -0.62, 1.1]} wide />
      <Window position={[0.18, -0.62, 1.1]} wide />
      <Window position={[0.92, -0.62, 1.1]} />
      <Window position={[1.65, -0.32, 0.92]} />
      <GarageDetail />
      <mesh position={[1.65, -0.64, 0.94]}>
        <boxGeometry args={[0.44, 0.62, 0.04]} />
        <meshStandardMaterial color="#14202c" emissive="#ffbd66" emissiveIntensity={0.45} roughness={0.22} metalness={0.25} />
      </mesh>
      <mesh position={[1.82, -0.63, 0.975]}>
        <sphereGeometry args={[0.032, 12, 12]} />
        <meshStandardMaterial color="#d6a45f" metalness={0.82} roughness={0.18} />
      </mesh>
      <FrontPorch />
      <mesh position={[1.65, -1.04, 1.35]} receiveShadow>
        <boxGeometry args={[1.25, 0.08, 0.55]} />
        <meshStandardMaterial color="#606968" roughness={0.78} />
      </mesh>

      <RoofSolarMount count={count} capacity={capacity} />
      <SolarWiringHarness />
      <RoofMeasurementGrid capacity={capacity} />
      <InstallDrone count={count} />

      <group position={[2.7, -0.55, 0.45]}>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.9, 0.34]} />
          <meshStandardMaterial color="#0e1724" emissive="#38e1ff" emissiveIntensity={0.55} metalness={0.55} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.18, 0.18]}>
          <boxGeometry args={[0.28, 0.24, 0.035]} />
          <meshBasicMaterial color="#38e1ff" transparent opacity={0.7} />
        </mesh>
      </group>
      <EnergyLine />
      <SunPath capacity={capacity} />

      <mesh position={[0, -1.18, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[7, 5]} />
        <meshStandardMaterial color="#18311f" roughness={0.92} />
      </mesh>
      <mesh position={[-2.45, -1.16, 1.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.5, 2.7]} />
        <meshStandardMaterial color="#555f60" roughness={0.82} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`drive-paver-${i}`} position={[-2.45, -1.145, 0.1 + i * 0.45]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.35, 0.018]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.05} depthWrite={false} />
        </mesh>
      ))}
      <Landscaping />
      <SiteHardware />
      <ContactShadows position={[0, -1.16, 0]} scale={7} opacity={0.35} blur={2.6} far={4} />
      <EffectComposer>
        <Bloom intensity={1.18} luminanceThreshold={0.12} luminanceSmoothing={0.76} mipmapBlur />
        <Vignette offset={0.2} darkness={0.58} />
      </EffectComposer>
    </group>
  );
}

export default function SavingCalculator() {
  const [roof, setRoof] = useState(40);
  const [bill, setBill] = useState(3000);
  const [sun, setSun] = useState(5.2);

  const kw = Math.max(1, roof / 8);
  const panels = Math.min(64, Math.max(4, Math.round(kw * 1.8)));
  const annualGen = kw * sun * 365;
  const tariff = 8;
  const annualSavings = Math.min(annualGen * tariff, bill * 12 * 1.1);
  const systemCost = kw * 61200 - 78000;
  const payback = Math.max(2, systemCost / annualSavings);
  const co2 = annualGen * 0.82;
  const trees = co2 / 21;
  const performanceRatio = 82;
  const roofUtilization = Math.min(100, (panels * 1.9 / roof) * 100);

  return (
    <section id="calculator" className="relative overflow-hidden section-pad bg-gradient-to-b from-[#03060f] to-[#060a16]">
      <div className="pointer-events-none absolute inset-0 grid-floor opacity-20" />
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-amber-400">Section 09 · Saving Calculator</p>
          <h2 className="font-display mt-3 text-3xl font-black text-white sm:text-4xl md:text-6xl">
            ROI in <span className="text-gradient-solar">3D</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Adjust your roof, bill and location while the premium home model expands its rooftop solar system in real time.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="scene-layer h-[44vh] min-h-[320px] overflow-hidden rounded-3xl glass sm:h-[52vh] lg:h-[58vh]">
            <Canvas
              shadows
              camera={{ position: [0, 1.35, 6.9], fov: 52 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, powerPreference: "high-performance" }}
              onCreated={({ gl }) => {
                gl.toneMapping = THREE.ACESFilmicToneMapping;
                gl.toneMappingExposure = 1.08;
              }}
            >
              <color attach="background" args={["#05080f"]} />
              <fog attach="fog" args={["#061021", 7, 15]} />
              <Suspense fallback={null}>
                <PremiumHomeSystem count={panels} capacity={kw} />
              </Suspense>
            </Canvas>
          </div>

          <div className="interactive-layer space-y-5">
            <div className="glass rounded-3xl p-6">
              <Slider label="Roof Area" value={roof} min={15} max={150} unit="m2" onChange={setRoof} />
              <Slider label="Monthly Bill" value={bill} min={800} max={15000} step={100} unit="INR" onChange={setBill} />
              <Slider label="Daily Sun Hours" value={sun} min={3.5} max={6.5} step={0.1} unit="hrs" onChange={setSun} />
              <div className="mt-2 rounded-xl bg-black/30 p-4 text-center">
                <span className="text-sm text-slate-400">Recommended System</span>
                <div className="text-3xl font-black text-gradient-solar">{kw.toFixed(1)} kW · {panels} panels</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Result label="Annual Savings" value={`INR ${Math.round(annualSavings).toLocaleString()}`} color="text-amber-400" />
              <Result label="Payback" value={`${payback.toFixed(1)} yrs`} color="text-cyan-400" />
              <Result label="CO2 / yr" value={`${(co2 / 1000).toFixed(1)} T`} color="text-emerald-400" />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Result label="Performance Ratio" value={`${performanceRatio}%`} color="text-cyan-400" />
              <Result label="Roof Utilization" value={`${roofUtilization.toFixed(0)}%`} color="text-amber-400" />
              <Result label="Annual Generation" value={`${Math.round(annualGen).toLocaleString()} kWh`} color="text-emerald-400" />
            </div>
            <div className="glass-gold rounded-2xl p-5 text-center">
              <div className="text-sm text-slate-300">25-Year Lifetime Savings</div>
              <motion.div key={annualSavings} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-2xl font-black text-white sm:text-4xl">
                INR {Math.round(annualSavings * 25).toLocaleString()}
              </motion.div>
              <div className="mt-1 text-xs text-emerald-400">Equivalent to {Math.round(trees * 25).toLocaleString()} trees over system lifetime</div>
            </div>
            <div className="rounded-2xl glass p-5">
              <div className="text-xs uppercase tracking-wider text-amber-300">Calculation assumptions</div>
              <div className="mt-3 grid gap-2 text-sm text-slate-300">
                <div>Module sizing uses roof area, peak sun hours and WAAREE bifacial system assumptions.</div>
                <div>Commercial values are indicative and should be validated after site survey, DISCOM rules and shadow analysis.</div>
                <div>Final design includes structure, inverter sizing, cable routing, safety protection and net-metering feasibility.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({ label, value, min, max, step = 1, unit, onChange }: { label: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (n: number) => void }) {
  const display = unit === "INR" ? `INR ${value.toLocaleString()}` : `${value} ${unit}`;
  return (
    <div className="mb-5">
      <div className="mb-2 flex justify-between text-sm">
        <span className="text-slate-300">{label}</span>
        <span className="font-bold text-amber-400">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full cursor-pointer accent-amber-400" />
    </div>
  );
}

function Result({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="glass rounded-2xl p-4 text-center">
      <div className={`text-xl font-black ${color}`}>{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  );
}