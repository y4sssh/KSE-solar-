import Canvas from "./CanvasWrapper";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function PhotonField() {
  const points = useRef<THREE.Points>(null);
  const { positions, speeds } = useMemo(() => {
    const count = 950;
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 3.5 + Math.random() * 10;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 7.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius - 4;
      speeds[i] = 0.12 + Math.random() * 0.36;
    }
    return { positions, speeds };
  }, []);

  useFrame((state, dt) => {
    const attr = points.current?.geometry.attributes.position as THREE.BufferAttribute | undefined;
    if (!attr) return;
    for (let i = 0; i < speeds.length; i++) {
      const x = attr.getX(i) + Math.sin(state.clock.elapsedTime * 0.25 + i) * 0.002;
      let y = attr.getY(i) + speeds[i] * dt;
      if (y > 4.3) y = -4.3;
      attr.setX(i, x);
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
    if (points.current) points.current.rotation.y += dt * 0.018;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.026} color="#38e1ff" transparent opacity={0.42} depthWrite={false} />
    </points>
  );
}

function EnergyStreams() {
  const group = useRef<THREE.Group>(null);
  const curves = useMemo(() => {
    return Array.from({ length: 9 }).map((_, i) => {
      const y = -3 + i * 0.75;
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-7.5, y, -6),
        new THREE.Vector3(-3.5, y + Math.sin(i) * 0.8, -4.8),
        new THREE.Vector3(0, y + Math.cos(i) * 0.65, -5.2),
        new THREE.Vector3(3.5, y + Math.sin(i * 0.6) * 0.8, -4.8),
        new THREE.Vector3(7.5, y, -6),
      ]);
      return new THREE.TubeGeometry(curve, 80, 0.009, 8, false);
    });
  }, []);

  useFrame((state, dt) => {
    if (!group.current) return;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.08) * 0.04;
    group.current.children.forEach((child, i) => {
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 1.4 + i * 0.7) * 0.045;
    });
    group.current.position.x = Math.sin(state.clock.elapsedTime * 0.11) * 0.35;
    group.current.rotation.y += dt * 0.006;
  });

  return (
    <group ref={group}>
      {curves.map((geometry, i) => (
        <mesh key={i} geometry={geometry}>
          <meshBasicMaterial color={i % 2 ? "#ffb800" : "#38e1ff"} transparent opacity={0.1} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function OrbitalSolarCore() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!group.current) return;
    group.current.rotation.y += dt * 0.018;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.06) * 0.08;
  });

  return (
    <group ref={group} position={[0, 0, -7]}>
      <mesh>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshBasicMaterial color="#ffb800" transparent opacity={0.65} toneMapped={false} />
      </mesh>
      {[2.8, 4.5, 6.2, 7.8].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2 + i * 0.1, i * 0.34, 0]}>
          <torusGeometry args={[r, 0.007, 8, 180]} />
          <meshBasicMaterial color={i % 2 ? "#ffb800" : "#38e1ff"} transparent opacity={0.16} depthWrite={false} />
        </mesh>
      ))}
      <pointLight intensity={8} distance={10} color="#ffb800" />
    </group>
  );
}

function LightShafts() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.12) * 0.18;
    group.current.position.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.6;
  });

  return (
    <group ref={group} position={[0, 0, -5]}>
      {[-2.4, 0, 2.4].map((x, i) => (
        <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, -0.35 + i * 0.18]}>
          <planeGeometry args={[0.28, 14]} />
          <meshBasicMaterial color={i === 1 ? "#ffb800" : "#38e1ff"} transparent opacity={0.045} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function CinematicCameraRig() {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0, -4));
  useFrame((state, dt) => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = window.scrollY / maxScroll;
    const t = state.clock.elapsedTime;
    const desiredX = Math.sin(progress * Math.PI * 2) * 1.2 + Math.sin(t * 0.1) * 0.35;
    const desiredY = (progress - 0.5) * 1.6 + Math.cos(t * 0.08) * 0.25;
    const desiredZ = 10 - progress * 2.4;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredX, 1.8, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredY, 1.8, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredZ, 1.8, dt);
    target.current.set(Math.sin(progress * Math.PI) * 0.5, 0, -5);
    camera.lookAt(target.current);
  });
  return null;
}

export default function GlobalEnergyBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-35 mix-blend-screen">
      <Canvas camera={{ position: [0, 0, 10], fov: 55 }} dpr={[1, 1.25]} gl={{ antialias: false, powerPreference: "high-performance" }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.25} />
        <PhotonField />
        <EnergyStreams />
        <OrbitalSolarCore />
        <LightShafts />
        <CinematicCameraRig />
      </Canvas>
    </div>
  );
}