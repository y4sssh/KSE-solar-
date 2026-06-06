import Canvas from "./CanvasWrapper";
import { Suspense, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { AdaptiveDpr, ContactShadows, Environment, Float, RoundedBox, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField, Vignette } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import * as THREE from "three";
import { company, stats } from "../data";

function PhotonRain({ night }: { night: number }) {
  const ref = useRef<THREE.Points>(null);
  const { positions, speeds } = useMemo(() => {
    const count = 520;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = 2 + Math.random() * 7;
      positions[i * 3 + 2] = -4 + Math.random() * 9;
      speeds[i] = 0.45 + Math.random() * 0.9;
    }
    return { positions, speeds };
  }, []);

  useFrame((_state, dt) => {
    const pos = ref.current?.geometry.attributes.position as THREE.BufferAttribute | undefined;
    if (!pos) return;
    for (let i = 0; i < speeds.length; i++) {
      let y = pos.getY(i) - speeds[i] * dt;
      let x = pos.getX(i) - speeds[i] * 0.18 * dt;
      if (y < -2.4) {
        y = 6.5 + Math.random() * 2;
        x = (Math.random() - 0.5) * 14;
      }
      pos.setX(i, x);
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        color={night > 0.5 ? "#7ccfff" : "#ffd36a"}
        transparent
        opacity={night > 0.5 ? 0.45 : 0.75}
        depthWrite={false}
      />
    </points>
  );
}

function PanelGrid({ position, rotation, scale = 1 }: { position: [number, number, number]; rotation: [number, number, number]; scale?: number }) {
  const columns = 8;
  const rows = 3;
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Raised rail system keeps panels visibly above the roof plane. */}
      {[-0.42, 0.42].map((z) => (
        <mesh key={`rail-${z}`} position={[0, -0.045, z]} castShadow>
          <boxGeometry args={[3.7, 0.045, 0.045]} />
          <meshStandardMaterial color="#aeb9c5" metalness={0.88} roughness={0.18} />
        </mesh>
      ))}

      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.65, 0.055, 1.44]} />
        <meshStandardMaterial color="#030816" metalness={0.72} roughness={0.16} />
      </mesh>

      <group position={[0, 0.055, 0]}>
        <mesh position={[0, 0, 0.74]} castShadow><boxGeometry args={[3.8, 0.05, 0.075]} /><meshStandardMaterial color="#d9e2ea" metalness={0.92} roughness={0.16} /></mesh>
        <mesh position={[0, 0, -0.74]} castShadow><boxGeometry args={[3.8, 0.05, 0.075]} /><meshStandardMaterial color="#d9e2ea" metalness={0.92} roughness={0.16} /></mesh>
        <mesh position={[1.9, 0, 0]} castShadow><boxGeometry args={[0.075, 0.05, 1.52]} /><meshStandardMaterial color="#d9e2ea" metalness={0.92} roughness={0.16} /></mesh>
        <mesh position={[-1.9, 0, 0]} castShadow><boxGeometry args={[0.075, 0.05, 1.52]} /><meshStandardMaterial color="#d9e2ea" metalness={0.92} roughness={0.16} /></mesh>
      </group>

      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: columns }).map((_, c) => (
          <mesh key={`${r}-${c}`} position={[-1.57 + c * 0.45, 0.064, -0.45 + r * 0.45]} castShadow>
            <boxGeometry args={[0.39, 0.024, 0.39]} />
            <meshStandardMaterial
              color="#0b2b63"
              emissive="#123f8c"
              emissiveIntensity={0.12}
              metalness={0.78}
              roughness={0.18}
            />
          </mesh>
        ))
      )}

      <mesh position={[0, 0.094, 0]} rotation={[-Math.PI / 2, 0, -0.08]}>
        <planeGeometry args={[3.35, 1.12]} />
        <meshPhysicalMaterial color="#e8fbff" transparent opacity={0.12} roughness={0.02} metalness={0.18} transmission={0.18} depthWrite={false} />
      </mesh>

      {Array.from({ length: columns + 1 }).map((_, i) => (
        <mesh key={`v-${i}`} position={[-1.8 + i * 0.45, 0.104, 0]}>
          <boxGeometry args={[0.012, 0.014, 1.22]} />
          <meshStandardMaterial color="#e4edf6" metalness={0.78} roughness={0.24} />
        </mesh>
      ))}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <mesh key={`h-${i}`} position={[0, 0.106, -0.675 + i * 0.45]}>
          <boxGeometry args={[3.48, 0.014, 0.012]} />
          <meshStandardMaterial color="#e4edf6" metalness={0.78} roughness={0.24} />
        </mesh>
      ))}

      <mesh position={[0.28, 0.116, -0.08]} rotation={[-Math.PI / 2, 0, -0.12]}>
        <planeGeometry args={[2.55, 0.42]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.14} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[3.8, 0.01, 1.56]} />
        <meshBasicMaterial color="#38e1ff" transparent opacity={0.025} depthWrite={false} />
      </mesh>
    </group>
  );
}

function GableRoof({
  position,
  width,
  depth,
  height,
  night,
}: {
  position: [number, number, number];
  width: number;
  depth: number;
  height: number;
  night: number;
}) {
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

  const roofColor = new THREE.Color("#263348").lerp(new THREE.Color("#0d121b"), night * 0.82).getStyle();
  const angle = Math.atan(height / (depth / 2));

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <primitive object={geometry} attach="geometry" />
        <meshStandardMaterial color={roofColor} metalness={0.35} roughness={0.28} />
      </mesh>
      <mesh position={[0, height + 0.025, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, width + 0.1, 16]} />
        <meshStandardMaterial color="#101722" metalness={0.45} roughness={0.32} />
      </mesh>
      {/* Subtle standing-seam ridges make the roof feel less procedural. */}
      <group position={[0, height * 0.47, depth * 0.265]} rotation={[-angle, 0, 0]}>
        {Array.from({ length: 13 }).map((_, i) => (
          <mesh key={i} position={[-width / 2 + 0.35 + i * (width - 0.7) / 12, 0.035, 0]} castShadow>
            <boxGeometry args={[0.018, 0.018, depth * 0.52]} />
            <meshStandardMaterial color="#1a2638" metalness={0.5} roughness={0.25} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Window({ position, width = 0.5, height = 0.56, night }: { position: [number, number, number]; width?: number; height?: number; night: number }) {
  const glow = 0.12 + night * 2.0;
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[width, height, 0.045]} />
        <meshStandardMaterial color="#101924" emissive="#ffc477" emissiveIntensity={glow} toneMapped={false} roughness={0.18} metalness={0.25} />
      </mesh>
      <mesh position={[0, height / 2 + 0.025, 0.018]}>
        <boxGeometry args={[width + 0.12, 0.055, 0.055]} />
        <meshStandardMaterial color="#f7f7ee" roughness={0.35} />
      </mesh>
      <mesh position={[0, -height / 2 - 0.025, 0.018]}>
        <boxGeometry args={[width + 0.12, 0.055, 0.055]} />
        <meshStandardMaterial color="#f7f7ee" roughness={0.35} />
      </mesh>
      <mesh position={[-width / 2 - 0.025, 0, 0.018]}>
        <boxGeometry args={[0.055, height + 0.1, 0.055]} />
        <meshStandardMaterial color="#f7f7ee" roughness={0.35} />
      </mesh>
      <mesh position={[width / 2 + 0.025, 0, 0.018]}>
        <boxGeometry args={[0.055, height + 0.1, 0.055]} />
        <meshStandardMaterial color="#f7f7ee" roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.022]}>
        <boxGeometry args={[0.035, height + 0.02, 0.05]} />
        <meshStandardMaterial color="#e8e6d7" roughness={0.38} />
      </mesh>
    </group>
  );
}

function PorchLight({ position, night }: { position: [number, number, number]; night: number }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffe3a6" emissive="#ffb15f" emissiveIntensity={0.2 + night * 2.8} toneMapped={false} />
      </mesh>
      <pointLight intensity={night * 6} distance={2.3} color="#ffbd66" />
    </group>
  );
}

function FacadeLines({ width, y, z, x = 0 }: { width: number; y: number; z: number; x?: number }) {
  return (
    <group>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[x, y + i * 0.16, z]}>
          <boxGeometry args={[width, 0.012, 0.018]} />
          <meshStandardMaterial color="#d7ddd8" roughness={0.5} metalness={0.02} />
        </mesh>
      ))}
    </group>
  );
}

function PathLights({ night }: { night: number }) {
  return (
    <group>
      {[-0.9, -0.25, 0.4, 1.05].map((x, i) => (
        <group key={x} position={[x, 0.08, 2.02 + (i % 2) * 0.16]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.025, 0.035, 0.24, 12]} />
            <meshStandardMaterial color="#151a20" metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <sphereGeometry args={[0.055, 14, 14]} />
            <meshStandardMaterial color="#ffe2a5" emissive="#ffb15f" emissiveIntensity={0.1 + night * 1.8} toneMapped={false} />
          </mesh>
          <pointLight position={[0, 0.18, 0]} intensity={night * 1.8} color="#ffbd66" distance={1.1} />
        </group>
      ))}
    </group>
  );
}

function LandscapeDepth({ night }: { night: number }) {
  const trees = useMemo(() => [-5.7, -4.8, -3.9, 4.1, 5.0, 5.8], []);
  const fog = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (fog.current) fog.current.position.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.28;
  });

  return (
    <group>
      {/* Rear tree silhouettes add photographic depth behind the home. */}
      {trees.map((x, i) => (
        <group key={x} position={[x, -0.02, -1.65 - (i % 2) * 0.38]} scale={0.8 + (i % 3) * 0.12}>
          <mesh castShadow>
            <cylinderGeometry args={[0.06, 0.1, 0.75, 9]} />
            <meshStandardMaterial color="#352719" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.65, 0]} castShadow>
            <sphereGeometry args={[0.56, 18, 18]} />
            <meshStandardMaterial color={night > 0.5 ? "#102116" : "#254d2f"} roughness={0.88} />
          </mesh>
          <mesh position={[0.23, 0.48, 0.05]} castShadow>
            <sphereGeometry args={[0.38, 16, 16]} />
            <meshStandardMaterial color={night > 0.5 ? "#132719" : "#2c5a36"} roughness={0.88} />
          </mesh>
        </group>
      ))}

      <group ref={fog} position={[0, -0.95, 2.35]}>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, i * 0.03, i * 0.48]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[3.4 + i * 1.1, 64]} />
            <meshBasicMaterial color={night > 0.5 ? "#b8c2cb" : "#fff2d8"} transparent opacity={0.035 + i * 0.012} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Villa({ night }: { night: number }) {
  const wallColor = new THREE.Color("#f3f5ef").lerp(new THREE.Color("#af9678"), night * 0.24).getStyle();
  const trimColor = new THREE.Color("#ffffff").lerp(new THREE.Color("#d3c7b5"), night * 0.2).getStyle();
  const stoneColor = new THREE.Color("#778078").lerp(new THREE.Color("#4b4740"), night * 0.35).getStyle();
  const slope = Math.atan(0.62 / 1.32);

  return (
    <group position={[0, -1.18, 0]} scale={0.96}>
      <mesh position={[0, -0.05, 0.2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 8.8]} />
        <meshStandardMaterial color="#18331f" roughness={0.95} />
      </mesh>
      <LandscapeDepth night={night} />

      {/* Main building masses */}
      <RoundedBox args={[5.3, 1.15, 2.0]} radius={0.035} smoothness={3} position={[0, 0.58, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={wallColor} roughness={0.58} metalness={0.03} />
      </RoundedBox>
      <RoundedBox args={[1.95, 0.95, 2.02]} radius={0.035} smoothness={3} position={[-3.25, 0.48, 0.08]} castShadow receiveShadow>
        <meshStandardMaterial color={wallColor} roughness={0.58} />
      </RoundedBox>
      <RoundedBox args={[2.05, 1.35, 2.12]} radius={0.035} smoothness={3} position={[2.7, 0.68, 0.08]} castShadow receiveShadow>
        <meshStandardMaterial color={wallColor} roughness={0.55} />
      </RoundedBox>
      <mesh position={[2.7, 0.2, 1.13]} castShadow receiveShadow>
        <boxGeometry args={[2.25, 0.38, 0.14]} />
        <meshStandardMaterial color={stoneColor} roughness={0.75} />
      </mesh>

      {/* Horizontal siding and architectural reveal lines on the visible facade. */}
      <FacadeLines width={5.0} x={-0.08} y={0.28} z={1.025} />
      <FacadeLines width={1.72} x={-3.25} y={0.22} z={1.12} />
      <FacadeLines width={1.72} x={2.7} y={0.34} z={1.18} />

      {/* Corner boards make the house look constructed rather than blocky. */}
      {[-2.7, 2.08, 3.72, -4.18].map((x, i) => (
        <mesh key={`corner-${i}`} position={[x, i < 2 ? 0.64 : 0.5, i < 2 ? 1.055 : 1.13]} castShadow>
          <boxGeometry args={[0.08, i < 2 ? 1.05 : 0.82, 0.08]} />
          <meshStandardMaterial color={trimColor} roughness={0.35} />
        </mesh>
      ))}

      {/* Subtle stone base and premium facade bands */}
      {[[-0.2, 0.05, 1.11, 5.45], [-3.25, 0.04, 1.16, 2.0], [2.7, 0.07, 1.2, 2.2]].map(([x, y, z, w]) => (
        <mesh key={`base-${x}`} position={[x, y, z]} castShadow receiveShadow>
          <boxGeometry args={[w, 0.18, 0.1]} />
          <meshStandardMaterial color={stoneColor} roughness={0.7} metalness={0.05} />
        </mesh>
      ))}

      {/* Trim/fascia lines */}
      {[[-0.15, 1.18, 1.05, 5.65], [-3.25, 0.95, 1.08, 2.1], [2.7, 1.36, 1.16, 2.25]].map(([x, y, z, w]) => (
        <mesh key={`${x}-${y}`} position={[x, y, z]} castShadow>
          <boxGeometry args={[w, 0.07, 0.08]} />
          <meshStandardMaterial color={trimColor} roughness={0.38} />
        </mesh>
      ))}

      <GableRoof position={[0, 1.12, 0]} width={5.95} depth={2.65} height={0.62} night={night} />
      <GableRoof position={[-3.25, 0.92, 0.08]} width={2.25} depth={2.6} height={0.56} night={night} />
      <GableRoof position={[2.7, 1.35, 0.08]} width={2.48} depth={2.75} height={0.68} night={night} />

      {/* Gutters, chimney and roof service details */}
      {[[-0.1, 1.12, 1.36, 6.0], [-3.25, 0.92, 1.42, 2.28], [2.7, 1.35, 1.5, 2.5]].map(([x, y, z, w]) => (
        <mesh key={`gutter-${x}`} position={[x, y, z]} castShadow>
          <boxGeometry args={[w, 0.045, 0.055]} />
          <meshStandardMaterial color="#d6dde4" metalness={0.78} roughness={0.2} />
        </mesh>
      ))}
      {[-2.92, 1.94, 3.82, -4.32].map((x, i) => (
        <mesh key={`downspout-${i}`} position={[x, 0.52, i < 2 ? 1.38 : 1.45]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.95, 12]} />
          <meshStandardMaterial color="#c8d0d8" metalness={0.75} roughness={0.22} />
        </mesh>
      ))}
      <group position={[1.15, 1.58, -0.55]}>
        <mesh castShadow>
          <boxGeometry args={[0.28, 0.72, 0.28]} />
          <meshStandardMaterial color="#38414a" roughness={0.62} metalness={0.08} />
        </mesh>
        <mesh position={[0, 0.39, 0]} castShadow>
          <boxGeometry args={[0.38, 0.08, 0.38]} />
          <meshStandardMaterial color="#1b222b" roughness={0.4} />
        </mesh>
      </group>

      {/* Flush-mounted roof solar arrays */}
      <PanelGrid position={[-0.62, 1.55, 0.9]} rotation={[slope, 0, 0]} scale={1.02} />
      <PanelGrid position={[2.0, 1.8, 0.94]} rotation={[slope, 0, 0]} scale={0.66} />
      <pointLight position={[0.1, 2.0, 1.25]} intensity={(1 - night) * 1.4 + night * 0.45} color="#8fdcff" distance={4.5} />

      {/* Garage door with horizontal panels */}
      <mesh position={[-3.25, 0.36, 1.11]} receiveShadow>
        <boxGeometry args={[1.42, 0.68, 0.06]} />
        <meshStandardMaterial color="#dfe4e6" roughness={0.32} metalness={0.08} />
      </mesh>
      {[-0.24, -0.08, 0.08, 0.24].map((y) => (
        <mesh key={y} position={[-3.25, 0.36 + y, 1.15]}>
          <boxGeometry args={[1.33, 0.018, 0.02]} />
          <meshStandardMaterial color="#9aa5ac" roughness={0.45} />
        </mesh>
      ))}
      {[-3.78, -3.25, -2.72].map((x) => (
        <mesh key={`garage-v-${x}`} position={[x, 0.36, 1.155]}>
          <boxGeometry args={[0.018, 0.6, 0.02]} />
          <meshStandardMaterial color="#aeb7bd" roughness={0.42} />
        </mesh>
      ))}
      <mesh position={[-2.66, 0.36, 1.17]}>
        <boxGeometry args={[0.055, 0.12, 0.025]} />
        <meshStandardMaterial color="#1f252b" metalness={0.5} roughness={0.25} />
      </mesh>

      <Window position={[-1.42, 0.55, 1.05]} width={0.5} night={night} />
      <Window position={[-0.7, 0.55, 1.05]} width={0.5} night={night} />
      <Window position={[0.05, 0.55, 1.05]} width={0.5} night={night} />
      <Window position={[0.8, 0.55, 1.05]} width={0.5} night={night} />
      <Window position={[1.45, 0.55, 1.05]} width={0.38} night={night} />
      <Window position={[2.22, 0.72, 1.14]} width={0.42} height={0.72} night={night} />
      <Window position={[3.18, 0.72, 1.14]} width={0.42} height={0.72} night={night} />

      {/* Premium glass reflections across facade */}
      {[-1.42, -0.7, 0.05, 0.8, 2.22, 3.18].map((x, i) => (
        <mesh key={`reflection-${i}`} position={[x + 0.04, i > 3 ? 0.82 : 0.63, i > 3 ? 1.172 : 1.083]} rotation={[0, 0, -0.35]}>
          <planeGeometry args={[0.12, i > 3 ? 0.6 : 0.42]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.13} depthWrite={false} />
        </mesh>
      ))}

      {/* Entry porch */}
      <mesh position={[2.7, 0.36, 1.18]}>
        <boxGeometry args={[0.72, 0.78, 0.08]} />
        <meshStandardMaterial color="#151b25" emissive="#ffb95c" emissiveIntensity={0.15 + night * 1.8} roughness={0.2} metalness={0.25} />
      </mesh>
      {[-0.19, 0.19].map((x) => (
        <mesh key={`door-glass-${x}`} position={[2.7 + x, 0.42, 1.225]}>
          <boxGeometry args={[0.16, 0.5, 0.02]} />
          <meshPhysicalMaterial color="#bfe9ff" transparent opacity={0.22} transmission={0.25} roughness={0.02} />
        </mesh>
      ))}
      <mesh position={[3.0, 0.35, 1.245]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#d6a45f" metalness={0.8} roughness={0.18} />
      </mesh>
      <mesh position={[2.7, -0.06, 1.47]} receiveShadow>
        <boxGeometry args={[1.55, 0.08, 0.9]} />
        <meshStandardMaterial color="#5e6665" roughness={0.72} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={`step-${i}`} position={[2.7, -0.1 - i * 0.035, 1.58 + i * 0.18]} receiveShadow>
          <boxGeometry args={[1.35 - i * 0.18, 0.055, 0.18]} />
          <meshStandardMaterial color="#6c7472" roughness={0.78} />
        </mesh>
      ))}
      {[2.0, 3.4].map((x) => (
        <mesh key={x} position={[x, 0.58, 1.28]} castShadow>
          <cylinderGeometry args={[0.055, 0.07, 1.05, 18]} />
          <meshStandardMaterial color={trimColor} roughness={0.35} />
        </mesh>
      ))}
      <mesh position={[2.7, 1.1, 1.28]} castShadow>
        <boxGeometry args={[1.65, 0.1, 0.16]} />
        <meshStandardMaterial color={trimColor} roughness={0.35} />
      </mesh>
      <PorchLight position={[2.05, 0.72, 1.32]} night={night} />
      <PorchLight position={[3.35, 0.72, 1.32]} night={night} />

      {[-0.8, 0, 0.8, 2.7].map((x) => (
        <pointLight key={x} position={[x, 0.75, 1.35]} intensity={night * 4.5} color="#ffbd66" distance={3} />
      ))}

      {/* Driveway, pathway and landscaping */}
      <mesh position={[-3.15, -0.025, 2.15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[2.15, 3.4]} />
        <meshStandardMaterial color="#586063" roughness={0.8} />
      </mesh>
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh key={`drive-line-${i}`} position={[-3.15, -0.017, 0.66 + i * 0.34]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.0, 0.012]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.05} depthWrite={false} />
        </mesh>
      ))}
      <mesh position={[1.65, -0.02, 2.05]} rotation={[-Math.PI / 2, 0, -0.1]} receiveShadow>
        <planeGeometry args={[1.0, 3.15]} />
        <meshStandardMaterial color="#464d4f" roughness={0.78} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`paver-${i}`} position={[1.2 + i * 0.18, -0.012, 1.14 + i * 0.34]} rotation={[-Math.PI / 2, 0, -0.1]} receiveShadow>
          <planeGeometry args={[0.52, 0.26]} />
          <meshStandardMaterial color={i % 2 ? "#555f5d" : "#626b68"} roughness={0.86} />
        </mesh>
      ))}
      <PathLights night={night} />
      {[-4.8, -4.1, 4.0, 4.75].map((x, i) => (
        <group key={x} position={[x, 0.07, 1.75 - (i % 2) * 0.75]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.08, 0.13, 0.52, 9]} />
            <meshStandardMaterial color="#47311d" />
          </mesh>
          <mesh position={[0, 0.48, 0]} castShadow>
            <sphereGeometry args={[0.52, 20, 20]} />
            <meshStandardMaterial color="#224f2f" roughness={0.82} />
          </mesh>
        </group>
      ))}
      {[-1.9, -1.4, 1.7, 3.8, 4.3].map((x, i) => (
        <mesh key={i} position={[x, 0.11, 1.38 + (i % 2) * 0.22]} castShadow>
          <sphereGeometry args={[0.25 + (i % 2) * 0.08, 16, 16]} />
          <meshStandardMaterial color="#2f6a3a" roughness={0.86} />
        </mesh>
      ))}
    </group>
  );
}

function EnergyRibbon({ night }: { night: number }) {
  const ribbons = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ribbons.current) return;
    ribbons.current.children.forEach((child, i) => {
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = 0.22 + Math.sin(state.clock.elapsedTime * 2.6 + i) * 0.08;
    });
  });

  return (
    <group ref={ribbons}>
      {[-0.5, 0, 0.5].map((offset, i) => (
        <mesh key={offset} position={[offset, -0.15, 1.35]} rotation={[0, 0, 0.22 - i * 0.16]}>
          <cylinderGeometry args={[0.015, 0.015, 4.2, 8]} />
          <meshBasicMaterial color={night > 0.5 ? "#7ccfff" : "#ffb800"} transparent opacity={0.28} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function FogSheets({ night }: { night: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current) group.current.position.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.35;
  });
  return (
    <group ref={group} position={[0, -1.08, 2.5]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, i * 0.05, i * 0.55]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.5 + i * 1.3, 64]} />
          <meshBasicMaterial color={night > 0.5 ? "#b8c7d8" : "#ffffff"} transparent opacity={0.05 + i * 0.02} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function SunHalo({ night }: { night: number }) {
  const halo = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (halo.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.7) * 0.035;
      halo.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={[-5.4, 4.3, -4.8]}>
      <pointLight intensity={(1 - night) * 34 + night * 5} distance={14} color="#ffbd6a" />
      <mesh ref={halo}>
        <sphereGeometry args={[0.72, 32, 32]} />
        <meshBasicMaterial color={night > 0.55 ? "#9ec9ff" : "#ffcf6b"} transparent opacity={0.62} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.45, 32, 32]} />
        <meshBasicMaterial color={night > 0.55 ? "#6fa8ff" : "#ff9a1f"} transparent opacity={0.13} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

function Scene({ targetNight }: { targetNight: number }) {
  const night = useRef(targetNight);
  const [visualNight, setVisualNight] = useState(targetNight);
  const rig = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    night.current = THREE.MathUtils.damp(night.current, targetNight, 2.8, dt);
    setVisualNight((current) => (Math.abs(current - night.current) > 0.003 ? night.current : current));
    const intro = THREE.MathUtils.smoothstep(Math.min(state.clock.elapsedTime / 4.5, 1), 0, 1);
    if (rig.current) {
      rig.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.13) * 0.08;
      rig.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.04;
    }
    const targetX = Math.sin(state.clock.elapsedTime * 0.08) * 0.18;
    const targetY = THREE.MathUtils.lerp(1.72, 1.28, intro) + Math.sin(state.clock.elapsedTime * 0.07) * 0.04;
    const targetZ = THREE.MathUtils.lerp(8.65, 7.28, intro) + Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, targetX, 2.2, dt);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, targetY, 2.2, dt);
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, targetZ, 2.2, dt);
    state.camera.lookAt(0, 0.01, 0.66);
  });

  const sky = new THREE.Color("#d8c58f").lerp(new THREE.Color("#07101f"), visualNight).getStyle();
  const fog = new THREE.Color("#e7d9af").lerp(new THREE.Color("#121929"), visualNight).getStyle();

  return (
    <>
      <color attach="background" args={[sky]} />
      <fog attach="fog" args={[fog, 7, 17]} />
      <Environment preset={visualNight > 0.45 ? "night" : "sunset"} />
      <hemisphereLight args={["#f4e6c5", "#1d2632", 0.45 - visualNight * 0.08]} />
      <ambientLight intensity={0.38 - visualNight * 0.1} />
      <directionalLight
        position={[-3, 5, 4]}
        intensity={1.65 - visualNight * 1.15}
        color="#ffd89c"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[0, 3, 4]} intensity={visualNight * 7} color="#7ccfff" distance={9} />
      <pointLight position={[4, 2, 3]} intensity={visualNight * 10} color="#ffb764" distance={7} />

      <Stars radius={42} depth={20} count={900} factor={3} fade speed={0.6} />
      <SunHalo night={visualNight} />
      <PhotonRain night={visualNight} />
      <group ref={rig}>
        <Float speed={0.9} rotationIntensity={0.05} floatIntensity={0.06}>
          <Villa night={visualNight} />
        </Float>
        <EnergyRibbon night={visualNight} />
        <FogSheets night={visualNight} />
      </group>
      <ContactShadows position={[0, -1.16, 1.2]} scale={12} blur={2.8} opacity={0.26} far={7} />
      <AdaptiveDpr pixelated />
      <EffectComposer>
        <DepthOfField focusDistance={0.018} focalLength={0.018} bokehScale={1.25} />
        <Bloom intensity={0.38} luminanceThreshold={0.45} luminanceSmoothing={0.75} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.55} />
      </EffectComposer>
    </>
  );
}

export default function Hero() {
  const [mode, setMode] = useState<"morning" | "night">("morning");
  const night = mode === "night" ? 1 : 0;

  return (
    <section id="hero" className="relative min-h-[100svh] w-full overflow-hidden md:h-screen">
      <div className="absolute inset-0">
        <Canvas
          shadows
          camera={{ position: [0, 1.32, 7.35], fov: 43 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.08;
          }}
        >
          <Suspense fallback={null}>
            <Scene targetNight={night} />
          </Suspense>
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/5 to-[#03060f]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,transparent_0%,transparent_35%,rgba(3,6,15,0.62)_82%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#03060f] to-transparent" />

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-end gap-4 px-4 pb-5 pt-24 text-center md:h-full md:justify-between md:px-6 md:pb-6 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="max-w-5xl"
        >
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full glass px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-amber-300 md:mb-4 md:px-4 md:text-xs md:tracking-[0.28em]">
            <span className="h-2 w-2 animate-pulseGlow rounded-full bg-amber-400" />
            {company.name} · Intelligent Solar EPC
          </div>
          <h1 className="font-display text-3xl font-black leading-[1.02] tracking-tight text-white sm:text-5xl md:text-7xl lg:text-8xl">
            Own Your Energy. <span className="text-gradient-solar">Lifetime Independence.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-slate-200 sm:text-sm md:mt-5 md:text-lg">
            Kaustubh Solar Evolution delivers turnkey EPC solar solutions engineered for long-term performance, energy independence and measurable decarbonisation.
          </p>
        </motion.div>

        <div className="w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8 }}
            className="mx-auto mb-3 grid max-w-xl grid-cols-2 gap-2 rounded-[1.4rem] border border-white/10 bg-black/45 p-2 shadow-[0_24px_70px_-40px_rgba(0,0,0,0.95)] backdrop-blur-2xl md:mb-5"
          >
            {[
              { id: "morning", title: "Morning", sub: "Solar generation active", accent: "from-amber-300 to-orange-500" },
              { id: "night", title: "Night", sub: "Battery backup active", accent: "from-cyan-200 to-blue-500" },
            ].map((item) => {
              const active = mode === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  aria-pressed={active}
                  onClick={() => setMode(item.id as "morning" | "night")}
                  className={`group relative overflow-hidden rounded-2xl px-3 py-3 text-center transition duration-500 md:px-5 md:py-4 ${
                    active ? "text-black shadow-[0_0_35px_-10px_rgba(255,220,120,0.9)]" : "bg-white/[0.06] text-white hover:bg-white/[0.11]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="hero-day-night-toggle"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.accent}`}
                    />
                  )}
                  <span className={`absolute inset-x-5 top-1 h-px bg-gradient-to-r ${item.accent} opacity-0 transition group-hover:opacity-70 ${active ? "opacity-70" : ""}`} />
                  <span className="relative z-10 flex items-center justify-center gap-2 text-base font-black md:text-lg">
                    <span className={`h-2 w-2 rounded-full ${active ? "bg-black/70" : "bg-amber-300/70 shadow-[0_0_12px_rgba(255,184,0,0.8)]"}`} />
                    {item.title}
                  </span>
                  <span className={`relative z-10 mt-0.5 block text-[10px] font-medium md:text-xs ${active ? "text-black/65" : "text-slate-400"}`}>{item.sub}</span>
                </button>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 1 }}
            className="hidden grid-cols-2 gap-2 sm:grid md:grid-cols-4"
          >
            {stats.map((s) => (
              <div key={s.label} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-center shadow-[0_18px_50px_-35px_rgba(56,225,255,0.9)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-amber-300/30 hover:bg-white/[0.06]">
                <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/70 to-transparent opacity-60" />
                <div className="text-2xl font-black text-gradient-solar md:text-3xl">
                  {s.value}
                  {s.suffix}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">{s.label}</div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="mt-3 flex flex-col justify-center gap-2 sm:flex-row md:mt-5 md:gap-3"
          >
            <motion.a whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} href="#xray" className="group relative overflow-hidden rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 px-7 py-3.5 text-sm font-black text-black shadow-[0_18px_55px_-24px_rgba(255,184,0,0.95)] transition md:px-8">
              <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/45 to-transparent transition duration-700 group-hover:translate-x-[120%]" />
              <span className="relative z-10">
              Explore Solar Tech
              </span>
            </motion.a>
            <motion.a whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} href="#calculator" className="group relative overflow-hidden rounded-full border border-cyan-300/20 bg-black/35 px-7 py-3.5 text-sm font-bold text-white shadow-[0_18px_55px_-28px_rgba(56,225,255,0.75)] backdrop-blur-xl transition hover:border-cyan-300/45 hover:bg-cyan-300/10 md:px-8">
              <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent" />
              Calculate Savings
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}