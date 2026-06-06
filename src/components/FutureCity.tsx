import Canvas from "./CanvasWrapper";
import { Suspense, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, RoundedBox, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";

type CityBlock = {
  pos: [number, number, number];
  size: [number, number, number];
  kind: "tower" | "office" | "factory" | "villa";
  color: string;
};

const cityBlocks: CityBlock[] = [
  { pos: [-4.8, 0, -3.5], size: [0.9, 2.8, 0.9], kind: "tower", color: "#0f1a30" },
  { pos: [-3.2, 0, -3.6], size: [1.1, 1.8, 0.95], kind: "office", color: "#12233d" },
  { pos: [-1.6, 0, -3.4], size: [1.4, 1.15, 1.1], kind: "factory", color: "#1a2734" },
  { pos: [0.3, 0, -3.45], size: [0.95, 3.4, 0.95], kind: "tower", color: "#111c34" },
  { pos: [2.0, 0, -3.5], size: [1.15, 2.1, 1.0], kind: "office", color: "#14223a" },
  { pos: [4.2, 0, -3.4], size: [1.7, 1.0, 1.2], kind: "factory", color: "#1d2934" },
  { pos: [-5.0, 0, -1.2], size: [1.0, 1.6, 1.0], kind: "office", color: "#132641" },
  { pos: [-3.0, 0, -1.1], size: [0.9, 3.1, 0.9], kind: "tower", color: "#0d1930" },
  { pos: [-1.0, 0, -1.2], size: [1.15, 2.4, 0.95], kind: "office", color: "#132036" },
  { pos: [1.1, 0, -1.1], size: [0.85, 4.0, 0.85], kind: "tower", color: "#0d1830" },
  { pos: [3.0, 0, -1.15], size: [1.2, 1.9, 1.0], kind: "office", color: "#14233b" },
  { pos: [5.0, 0, -1.15], size: [1.2, 1.1, 1.1], kind: "villa", color: "#1a2734" },
  { pos: [-4.7, 0, 1.35], size: [1.4, 1.0, 1.2], kind: "factory", color: "#1c2a34" },
  { pos: [-2.7, 0, 1.2], size: [1.05, 2.2, 0.95], kind: "office", color: "#11213a" },
  { pos: [-0.7, 0, 1.35], size: [0.9, 3.5, 0.9], kind: "tower", color: "#0f1a30" },
  { pos: [1.2, 0, 1.25], size: [1.4, 1.25, 1.1], kind: "factory", color: "#1d2c38" },
  { pos: [3.25, 0, 1.35], size: [1.0, 2.6, 0.95], kind: "office", color: "#13243e" },
  { pos: [5.0, 0, 1.25], size: [0.9, 3.1, 0.9], kind: "tower", color: "#101b32" },
  { pos: [-3.8, 0, 3.65], size: [1.2, 1.05, 1.0], kind: "villa", color: "#1a2734" },
  { pos: [-1.7, 0, 3.55], size: [1.5, 1.2, 1.1], kind: "factory", color: "#1d2b36" },
  { pos: [0.7, 0, 3.55], size: [1.1, 2.25, 0.95], kind: "office", color: "#13233b" },
  { pos: [2.7, 0, 3.55], size: [0.9, 3.0, 0.9], kind: "tower", color: "#0f1b33" },
  { pos: [4.5, 0, 3.65], size: [1.25, 1.15, 1.0], kind: "villa", color: "#1a2734" },
];

function WindowGrid({ size, night, seed }: { size: [number, number, number]; night: number; seed: number }) {
  const [w, h, d] = size;
  const rows = Math.max(2, Math.floor(h / 0.32));
  const cols = Math.max(2, Math.floor(w / 0.22));
  return (
    <group position={[0, 0, d / 2 + 0.006]}>
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: cols }).map((_, col) => {
          const glow = night * (((row + col + seed) % 4 === 0 ? 0.72 : 0.34));
          return (
            <mesh key={`${row}-${col}`} position={[-w / 2 + 0.16 + col * ((w - 0.32) / Math.max(1, cols - 1)), -h / 2 + 0.2 + row * 0.31, 0]}>
              <planeGeometry args={[0.09, 0.13]} />
              <meshBasicMaterial color={glow > 0.45 ? "#ffcf84" : "#6bdcff"} transparent opacity={0.1 + glow * 0.62} />
            </mesh>
          );
        })
      )}
    </group>
  );
}

function RooftopSolar({ size, night }: { size: [number, number, number]; night: number }) {
  const [w, h, d] = size;
  const cols = Math.max(2, Math.floor(w / 0.42));
  const rows = Math.max(1, Math.floor(d / 0.44));
  return (
    <group position={[0, h / 2 + 0.035, 0]}>
      <mesh position={[0, -0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w * 0.86, d * 0.86]} />
        <meshStandardMaterial color="#050914" metalness={0.45} roughness={0.24} />
      </mesh>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <group key={`${r}-${c}`} position={[-w / 2 + 0.24 + c * 0.42, 0.014, -d / 2 + 0.25 + r * 0.44]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.34, 0.024, 0.36]} />
              <meshStandardMaterial color="#0b2b63" emissive="#1d63ff" emissiveIntensity={0.36 + (1 - night) * 0.5} metalness={0.88} roughness={0.1} />
            </mesh>
            <group position={[0, 0.014, 0]}>
              <mesh position={[0, 0, 0.2]}><boxGeometry args={[0.38, 0.008, 0.012]} /><meshStandardMaterial color="#dce5ee" metalness={0.85} roughness={0.18} /></mesh>
              <mesh position={[0, 0, -0.2]}><boxGeometry args={[0.38, 0.008, 0.012]} /><meshStandardMaterial color="#dce5ee" metalness={0.85} roughness={0.18} /></mesh>
              <mesh position={[0.19, 0, 0]}><boxGeometry args={[0.012, 0.008, 0.4]} /><meshStandardMaterial color="#dce5ee" metalness={0.85} roughness={0.18} /></mesh>
              <mesh position={[-0.19, 0, 0]}><boxGeometry args={[0.012, 0.008, 0.4]} /><meshStandardMaterial color="#dce5ee" metalness={0.85} roughness={0.18} /></mesh>
            </group>
          </group>
        ))
      )}
    </group>
  );
}

function ResidentialSolarVilla({ night }: { night: number }) {
  return (
    <group position={[3.9, 0.62, 4.15]} rotation={[0, -0.55, 0]} scale={1.28}>
      <RoundedBox args={[1.5, 0.8, 1.1]} radius={0.03} smoothness={3} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#dfe4de" roughness={0.58} />
      </RoundedBox>
      <mesh position={[0, 0.58, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.15, 0.58, 4]} />
        <meshStandardMaterial color="#1b2638" metalness={0.35} roughness={0.26} />
      </mesh>
      <group position={[0, 0.9, 0.42]} rotation={[0.58, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.45, 0.04, 0.72]} />
          <meshStandardMaterial color="#050914" metalness={0.45} roughness={0.18} />
        </mesh>
        {Array.from({ length: 3 }).map((_, r) =>
          Array.from({ length: 5 }).map((_, c) => (
            <mesh key={`${r}-${c}`} position={[-0.52 + c * 0.26, 0.035, -0.24 + r * 0.24]}>
              <boxGeometry args={[0.22, 0.022, 0.2]} />
              <meshStandardMaterial color="#0b2b63" emissive="#1d63ff" emissiveIntensity={0.32 + (1 - night) * 0.42} metalness={0.86} roughness={0.12} />
            </mesh>
          ))
        )}
        <mesh position={[0.08, 0.06, -0.02]} rotation={[-Math.PI / 2, 0, -0.12]}>
          <planeGeometry args={[1.05, 0.22]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.16} depthWrite={false} />
        </mesh>
      </group>
      <mesh position={[-0.35, -0.1, 0.57]}><boxGeometry args={[0.24, 0.32, 0.025]} /><meshStandardMaterial color="#111923" emissive="#ffbd66" emissiveIntensity={night * 0.8} /></mesh>
      <mesh position={[0.15, -0.1, 0.57]}><boxGeometry args={[0.24, 0.32, 0.025]} /><meshStandardMaterial color="#111923" emissive="#ffbd66" emissiveIntensity={night * 0.8} /></mesh>
    </group>
  );
}

function ForegroundSolarHomes({ night }: { night: number }) {
  return (
    <group position={[-0.4, 0.35, 5.45]} rotation={[0, 0.08, 0]}>
      {[-1.7, 0, 1.7].map((x, homeIndex) => (
        <group key={x} position={[x, 0, 0]} scale={0.78}>
          <RoundedBox args={[1.25, 0.62, 0.9]} radius={0.03} smoothness={3} position={[0, 0, 0]} castShadow receiveShadow>
            <meshStandardMaterial color="#dde5dd" roughness={0.58} />
          </RoundedBox>
          <mesh position={[0, 0.48, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
            <coneGeometry args={[0.98, 0.5, 4]} />
            <meshStandardMaterial color="#1b2638" metalness={0.35} roughness={0.26} />
          </mesh>
          <group position={[0, 0.78, 0.34]} rotation={[0.58, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.18, 0.035, 0.56]} />
              <meshStandardMaterial color="#050914" metalness={0.5} roughness={0.18} />
            </mesh>
            {Array.from({ length: 2 }).map((_, r) =>
              Array.from({ length: 4 }).map((_, c) => (
                <mesh key={`${r}-${c}`} position={[-0.42 + c * 0.28, 0.035, -0.16 + r * 0.3]}>
                  <boxGeometry args={[0.23, 0.022, 0.25]} />
                  <meshStandardMaterial color="#0b2b63" emissive="#1d63ff" emissiveIntensity={0.35 + (1 - night) * 0.45} metalness={0.88} roughness={0.1} />
                </mesh>
              ))
            )}
            <mesh position={[0.08, 0.06, -0.03]} rotation={[-Math.PI / 2, 0, -0.15]}>
              <planeGeometry args={[0.9, 0.18]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.18} depthWrite={false} />
            </mesh>
          </group>
          <mesh position={[-0.26, -0.08, 0.47]}><boxGeometry args={[0.2, 0.26, 0.025]} /><meshStandardMaterial color="#111923" emissive="#ffbd66" emissiveIntensity={night * 0.7} /></mesh>
          <mesh position={[0.22, -0.08, 0.47]}><boxGeometry args={[0.2, 0.26, 0.025]} /><meshStandardMaterial color="#111923" emissive="#ffbd66" emissiveIntensity={night * 0.7} /></mesh>
          <mesh position={[0, -0.32, 0.7]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[1.1, 0.7]} />
            <meshStandardMaterial color={homeIndex % 2 ? "#27313a" : "#303a42"} roughness={0.76} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function RooftopEquipment({ size, kind }: { size: [number, number, number]; kind: CityBlock["kind"] }) {
  const [w, h, d] = size;
  if (kind === "villa") return null;
  return (
    <group position={[0, h / 2 + 0.08, 0]}>
      <mesh position={[w * 0.25, 0, -d * 0.25]} castShadow>
        <boxGeometry args={[0.24, 0.12, 0.18]} />
        <meshStandardMaterial color="#2c3440" metalness={0.55} roughness={0.28} />
      </mesh>
      <mesh position={[w * 0.25, 0.075, -d * 0.25]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.1, 0.008, 8, 24]} />
        <meshBasicMaterial color="#7ccfff" transparent opacity={0.28} />
      </mesh>
      {kind === "tower" && (
        <mesh position={[-w * 0.28, 0.18, d * 0.18]} castShadow>
          <cylinderGeometry args={[0.035, 0.04, 0.42, 12]} />
          <meshStandardMaterial color="#aab4bd" metalness={0.7} roughness={0.24} />
        </mesh>
      )}
    </group>
  );
}

function Building({ block, index, night }: { block: CityBlock; index: number; night: number }) {
  const [w, h, d] = block.size;
  return (
    <group position={[block.pos[0], h / 2, block.pos[2]]}>
      <RoundedBox args={block.size} radius={block.kind === "tower" ? 0.04 : 0.025} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color={block.color} emissive={night > 0.55 ? "#0a1020" : "#061a2b"} emissiveIntensity={0.1 + night * 0.08} metalness={0.45} roughness={0.34} />
      </RoundedBox>
      {block.kind !== "villa" && Array.from({ length: Math.max(2, Math.floor(w / 0.28)) }).map((_, i) => (
        <mesh key={`fin-${i}`} position={[-w / 2 + 0.18 + i * 0.28, 0, d / 2 + 0.012]}>
          <boxGeometry args={[0.012, h * 0.92, 0.018]} />
          <meshStandardMaterial color="#26384e" metalness={0.62} roughness={0.22} />
        </mesh>
      ))}
      <WindowGrid size={block.size} night={night} seed={index} />
      <RooftopSolar size={block.size} night={night} />
      <RooftopEquipment size={block.size} kind={block.kind} />
      {block.kind === "factory" && (
        <>
          <mesh position={[w * 0.34, h / 2 + 0.32, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 0.7, 18]} />
            <meshStandardMaterial color="#2a3440" metalness={0.35} roughness={0.42} />
          </mesh>
          <mesh position={[w * 0.34, h / 2 + 0.72, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color="#38e1ff" transparent opacity={0.18 + night * 0.22} />
          </mesh>
        </>
      )}
      {block.kind === "tower" && (
        <mesh position={[0, h / 2 + 0.28, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.56, 8]} />
          <meshBasicMaterial color="#38e1ff" transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  );
}

function SolarFarm({ night }: { night: number }) {
  return (
    <group position={[-5.25, 0.08, 4.7]} rotation={[0, 0.16, 0]}>
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 7 }).map((_, c) => (
          <group key={`${r}-${c}`} position={[c * 0.32, 0, r * 0.34]}>
            <mesh position={[0, 0.08, 0]} rotation={[-0.55, 0, 0]} castShadow>
              <boxGeometry args={[0.25, 0.02, 0.28]} />
              <meshStandardMaterial color="#12305f" emissive="#1d63ff" emissiveIntensity={0.42 + (1 - night) * 0.55} metalness={0.92} roughness={0.1} />
            </mesh>
            <mesh position={[0, -0.06, 0]} castShadow>
              <cylinderGeometry args={[0.01, 0.015, 0.28, 8]} />
              <meshStandardMaterial color="#9aa5ad" metalness={0.75} roughness={0.24} />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
}

function SidewalksAndCurbs() {
  return (
    <group>
      {[0.34, -0.34].map((offset) => (
        <mesh key={`road-sidewalk-${offset}`} position={[0, 0.044, offset]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[14.5, 0.12]} />
          <meshStandardMaterial color="#27313a" roughness={0.72} metalness={0.08} />
        </mesh>
      ))}
      {[-4.1, 0, 4.1].map((x) => (
        <mesh key={`intersection-${x}`} position={[x, 0.047, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.48, 0.48]} />
          <meshStandardMaterial color="#121b25" roughness={0.6} metalness={0.12} />
        </mesh>
      ))}
    </group>
  );
}

function CommercialSolarCanopy({ night }: { night: number }) {
  return (
    <group position={[-2.1, 0.1, 5.1]} rotation={[0, 0.12, 0]}>
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0.28, 0]} castShadow>
          <cylinderGeometry args={[0.025, 0.035, 0.62, 10]} />
          <meshStandardMaterial color="#a8b2bb" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      <mesh position={[0, 0.62, 0]} rotation={[-0.24, 0, 0]} castShadow>
        <boxGeometry args={[1.8, 0.045, 0.95]} />
        <meshStandardMaterial color="#050914" metalness={0.45} roughness={0.18} />
      </mesh>
      {Array.from({ length: 2 }).map((_, r) =>
        Array.from({ length: 5 }).map((_, c) => (
          <mesh key={`${r}-${c}`} position={[-0.72 + c * 0.36, 0.66, -0.27 + r * 0.34]} rotation={[-0.24, 0, 0]}>
            <boxGeometry args={[0.3, 0.018, 0.28]} />
            <meshStandardMaterial color="#0b2b63" emissive="#1d63ff" emissiveIntensity={0.22 + (1 - night) * 0.35} metalness={0.86} roughness={0.12} />
          </mesh>
        ))
      )}
    </group>
  );
}

function SubstationFence() {
  return (
    <group position={[-5.1, 0.08, -5.1]}>
      {[-0.95, 0.95].map((x) => (
        <mesh key={`fence-x-${x}`} position={[x, 0.24, 0]}>
          <boxGeometry args={[0.035, 0.38, 1.35]} />
          <meshStandardMaterial color="#87919a" metalness={0.65} roughness={0.28} />
        </mesh>
      ))}
      {[-0.67, 0.67].map((z) => (
        <mesh key={`fence-z-${z}`} position={[0, 0.24, z]}>
          <boxGeometry args={[1.95, 0.38, 0.035]} />
          <meshStandardMaterial color="#87919a" metalness={0.65} roughness={0.28} />
        </mesh>
      ))}
    </group>
  );
}

function EVChargingHub({ night }: { night: number }) {
  return (
    <group position={[4.45, 0.05, 4.65]} rotation={[0, -0.18, 0]}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.1, 1.35]} />
        <meshStandardMaterial color="#101820" metalness={0.32} roughness={0.52} />
      </mesh>
      <mesh position={[0, 0.56, 0]} castShadow>
        <boxGeometry args={[2.0, 0.06, 1.1]} />
        <meshStandardMaterial color="#12305f" emissive="#1d63ff" emissiveIntensity={0.25 + (1 - night) * 0.45} metalness={0.9} roughness={0.12} />
      </mesh>
      {[-0.7, 0, 0.7].map((x) => (
        <group key={x} position={[x, 0.18, 0.32]}>
          <mesh castShadow><boxGeometry args={[0.16, 0.36, 0.12]} /><meshStandardMaterial color="#0b1320" emissive="#38e1ff" emissiveIntensity={night * 0.45 + 0.18} metalness={0.55} roughness={0.24} /></mesh>
          <mesh position={[0, 0.03, 0.07]}><boxGeometry args={[0.09, 0.12, 0.012]} /><meshBasicMaterial color="#38e1ff" transparent opacity={0.65} /></mesh>
        </group>
      ))}
      <mesh position={[-0.7, 0.12, -0.25]} castShadow><boxGeometry args={[0.42, 0.14, 0.24]} /><meshStandardMaterial color="#0e1724" metalness={0.5} roughness={0.25} /></mesh>
      <mesh position={[0.65, 0.12, -0.22]} castShadow><boxGeometry args={[0.42, 0.14, 0.24]} /><meshStandardMaterial color="#1b1208" metalness={0.5} roughness={0.25} /></mesh>
      <pointLight position={[0, 0.6, 0]} intensity={night * 8} color="#38e1ff" distance={2.5} />
    </group>
  );
}

function GridSubstation({ night }: { night: number }) {
  return (
    <group position={[-5.1, 0.06, -5.1]}>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1.8, 1.25]} />
        <meshStandardMaterial color="#101820" roughness={0.58} metalness={0.3} />
      </mesh>
      {[-0.5, 0, 0.5].map((x) => (
        <group key={x} position={[x, 0.22, 0]}>
          <mesh castShadow><boxGeometry args={[0.18, 0.34, 0.2]} /><meshStandardMaterial color="#27313d" metalness={0.55} roughness={0.28} /></mesh>
          <mesh position={[0, 0.22, 0]}><torusGeometry args={[0.13, 0.008, 8, 24]} /><meshBasicMaterial color="#ffb800" transparent opacity={0.25 + night * 0.25} /></mesh>
        </group>
      ))}
      <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 1.45, 8]} />
        <meshBasicMaterial color="#ffb800" transparent opacity={0.45} />
      </mesh>
    </group>
  );
}

function UrbanTrees() {
  return (
    <group>
      {[-6, -4.5, -2.8, 2.4, 4.2, 5.8].map((x, i) => (
        <group key={x} position={[x, 0.08, 5.3 - (i % 2) * 0.35]}>
          <mesh castShadow><cylinderGeometry args={[0.04, 0.06, 0.42, 8]} /><meshStandardMaterial color="#4a311e" /></mesh>
          <mesh position={[0, 0.38, 0]} castShadow><sphereGeometry args={[0.28, 14, 14]} /><meshStandardMaterial color="#285a32" roughness={0.88} /></mesh>
        </group>
      ))}
    </group>
  );
}

function RoadsAndTraffic({ night }: { night: number }) {
  const carA = useRef<THREE.Group>(null);
  const carB = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (carA.current) carA.current.position.x = ((state.clock.elapsedTime * 2.2) % 14) - 7;
    if (carB.current) carB.current.position.z = ((state.clock.elapsedTime * 1.7) % 10) - 5;
  });
  return (
    <group>
      {[0, -2.35, 2.35].map((z) => (
        <mesh key={`h-${z}`} position={[0, 0.035, z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[14.5, 0.34]} />
          <meshStandardMaterial color="#07101d" metalness={0.32} roughness={0.48} />
        </mesh>
      ))}
      {[-4.1, 0, 4.1].map((x) => (
        <mesh key={`v-${x}`} position={[x, 0.036, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} receiveShadow>
          <planeGeometry args={[10.6, 0.34]} />
          <meshStandardMaterial color="#07101d" metalness={0.32} roughness={0.48} />
        </mesh>
      ))}
      {Array.from({ length: 16 }).map((_, i) => (
        <mesh key={i} position={[-7 + i * 0.9, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.34, 0.025]} />
          <meshBasicMaterial color="#f7f3d0" transparent opacity={0.38 + night * 0.25} />
        </mesh>
      ))}
      <group ref={carA} position={[-6, 0.16, 0]}>
        <mesh castShadow><boxGeometry args={[0.36, 0.12, 0.2]} /><meshStandardMaterial color="#0b1724" emissive="#38e1ff" emissiveIntensity={night * 1.6} metalness={0.5} roughness={0.25} /></mesh>
        <pointLight position={[0.2, 0, 0]} intensity={night * 6} color="#38e1ff" distance={1.5} />
      </group>
      <group ref={carB} position={[0, 0.16, -4]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow><boxGeometry args={[0.36, 0.12, 0.2]} /><meshStandardMaterial color="#1b1208" emissive="#ffb800" emissiveIntensity={night * 1.4} metalness={0.5} roughness={0.25} /></mesh>
        <pointLight position={[0.2, 0, 0]} intensity={night * 5} color="#ffb800" distance={1.4} />
      </group>
    </group>
  );
}

function EnergyNetwork({ night }: { night: number }) {
  const network = useRef<THREE.Group>(null);
  const curves = useMemo(() => {
    const lines: THREE.TubeGeometry[] = [];
    for (let i = 0; i < 6; i++) {
      const start = new THREE.Vector3(-5.2 + i * 1.7, 0.18, 4.5);
      const end = new THREE.Vector3(-4 + i * 1.5, 1.1 + (i % 3) * 0.45, -3.4 + (i % 2) * 2.2);
      const mid = start.clone().add(end).multiplyScalar(0.5).add(new THREE.Vector3(0, 1.2 + i * 0.08, 0));
      lines.push(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(start, mid, end), 36, 0.012, 8, false));
    }
    return lines;
  }, []);

  useFrame((state) => {
    network.current?.children.forEach((child, i) => {
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = 0.1 + night * 0.24 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.05;
    });
  });

  return (
    <group ref={network}>
      {curves.map((geometry, i) => (
        <mesh key={i} geometry={geometry}>
          <meshBasicMaterial color={i % 2 ? "#38e1ff" : "#ffb800"} transparent opacity={0.22} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function CityAtmosphere({ night }: { night: number }) {
  const cloud = useRef<THREE.Group>(null);
  const drone = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (cloud.current) cloud.current.position.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.7;
    if (drone.current) {
      drone.current.position.x = Math.sin(state.clock.elapsedTime * 0.45) * 4.2;
      drone.current.position.z = Math.cos(state.clock.elapsedTime * 0.38) * 2.5;
      drone.current.rotation.y = state.clock.elapsedTime * 0.45;
    }
  });
  return (
    <group>
      <group ref={cloud} position={[0, 4.1, -5.6]}>
        {[-2.2, -0.8, 0.8, 2.3].map((x, i) => (
          <mesh key={x} position={[x, Math.sin(i) * 0.18, 0]}>
            <sphereGeometry args={[0.7 + i * 0.08, 18, 18]} />
            <meshBasicMaterial color={night > 0.5 ? "#19263a" : "#dce9f2"} transparent opacity={night > 0.5 ? 0.08 : 0.18} depthWrite={false} />
          </mesh>
        ))}
      </group>
      <group ref={drone} position={[0, 2.5, 0]}>
        <mesh><boxGeometry args={[0.24, 0.08, 0.18]} /><meshStandardMaterial color="#0b1320" emissive="#38e1ff" emissiveIntensity={0.3 + night * 0.4} metalness={0.6} roughness={0.25} /></mesh>
        {[-0.22, 0.22].map((x) => [-0.18, 0.18].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.07, 0.004, 8, 18]} />
            <meshBasicMaterial color="#38e1ff" transparent opacity={0.45 + night * 0.25} />
          </mesh>
        )))}
      </group>
    </group>
  );
}

function StreetLights({ night }: { night: number }) {
  return (
    <group>
      {[-5.8, -3.4, -1, 1.4, 3.8, 5.8].map((x) => (
        <group key={x} position={[x, 0.02, -0.42]}>
          <mesh castShadow><cylinderGeometry args={[0.025, 0.03, 0.62, 10]} /><meshStandardMaterial color="#2c3440" metalness={0.55} roughness={0.25} /></mesh>
          <mesh position={[0, 0.36, 0.08]}><sphereGeometry args={[0.07, 14, 14]} /><meshStandardMaterial color="#ffe2a5" emissive="#ffb15f" emissiveIntensity={night * 1.8} toneMapped={false} /></mesh>
          <pointLight position={[0, 0.34, 0.12]} intensity={night * 3.2} color="#ffbd66" distance={1.4} />
        </group>
      ))}
    </group>
  );
}

function CityScene({ night }: { night: number }) {
  const cam = useRef(0);
  useFrame((state, dt) => {
    cam.current += dt * 0.12;
    state.camera.position.x = Math.sin(cam.current) * 8.8;
    state.camera.position.z = Math.cos(cam.current) * 8.8;
    state.camera.position.y = 3.2 + Math.sin(cam.current * 0.7) * 0.9;
    state.camera.lookAt(0.2, 0.9, 0.2);
  });

  const sky = new THREE.Color().lerpColors(new THREE.Color("#8ec5ff"), new THREE.Color("#03060f"), night);
  const fog = new THREE.Color().lerpColors(new THREE.Color("#9eb9d1"), new THREE.Color("#07101e"), night);

  return (
    <group>
      <color attach="background" args={[sky.getStyle()]} />
      <fog attach="fog" args={[fog.getStyle(), 8, 26]} />
      <ambientLight intensity={0.34 + (1 - night) * 0.48} />
      <Environment preset={night > 0.5 ? "night" : "sunset"} />
      <directionalLight position={[5, 8, 5]} intensity={(1 - night) * 3.1} color="#ffd9a0" castShadow />
      <pointLight position={[0, 5, 0]} intensity={night * 26} color="#38e1ff" />
      {night > 0.2 && <Stars radius={45} depth={20} count={1300} factor={3} fade speed={0.5} />}

      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#050b14" metalness={0.35} roughness={0.58} />
      </mesh>
      <gridHelper args={[40, 40, "#1c5a8c", "#0c2440"]} position={[0, 0.012, 0]} />
      <RoadsAndTraffic night={night} />
      <SidewalksAndCurbs />
      <StreetLights night={night} />
      <SolarFarm night={night} />
      <CommercialSolarCanopy night={night} />
      <EVChargingHub night={night} />
      <GridSubstation night={night} />
      <SubstationFence />
      <ResidentialSolarVilla night={night} />
      <ForegroundSolarHomes night={night} />
      <UrbanTrees />
      <EnergyNetwork night={night} />
      <CityAtmosphere night={night} />
      {cityBlocks.map((block, i) => <Building key={i} block={block} index={i} night={night} />)}

      <mesh position={[8, 6 - night * 4, -8]}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial color={night > 0.5 ? "#cfe0ff" : "#ffcf6b"} toneMapped={false} />
      </mesh>
      <ContactShadows position={[0, 0.02, 0]} scale={15} opacity={0.22} blur={2.5} far={8} />
      <EffectComposer>
        <Bloom intensity={1.15 + night * 0.95} luminanceThreshold={0.12} luminanceSmoothing={0.75} mipmapBlur />
        <Vignette offset={0.22} darkness={0.58} />
      </EffectComposer>
    </group>
  );
}

export default function FutureCity() {
  const [night, setNight] = useState(0);
  return (
    <section id="city" className="relative section-pad bg-[#03060f]">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-400">Section 08</p>
          <h2 className="font-display mt-3 text-3xl font-black text-white sm:text-4xl md:text-6xl">
            Future <span className="text-gradient-cyan">Solar City</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            A cinematic clean-energy district with towers, solar rooftops, industrial loads, EV traffic and battery-backed night lighting.
          </p>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="scene-layer mt-10 h-[46vh] min-h-[330px] overflow-hidden rounded-3xl glass sm:h-[54vh] lg:h-[65vh]">
          <Canvas
            shadows
            camera={{ position: [8.8, 3.8, 8.8], fov: 52 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.05;
            }}
          >
            <Suspense fallback={null}>
              <CityScene night={night} />
            </Suspense>
          </Canvas>

          <div className="interactive-layer absolute bottom-4 left-1/2 w-[92%] max-w-lg -translate-x-1/2 rounded-2xl glass p-4 sm:bottom-6 sm:p-5">
            <div className="mb-2 flex items-center justify-between text-sm font-semibold">
              <span className="text-amber-300">Day generation</span>
              <span className="text-cyan-300">Night storage</span>
            </div>
            <input type="range" min={0} max={1} step={0.01} value={night} onChange={(e) => setNight(parseFloat(e.target.value))} className="w-full cursor-pointer accent-amber-400" />
            <div className="mt-3 text-center text-xs text-slate-300">
              {night < 0.5 ? "Solar rooftops charge the city-wide battery network" : "Stored solar energy powers buildings, roads and EV mobility"}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}