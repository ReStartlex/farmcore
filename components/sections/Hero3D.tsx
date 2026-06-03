"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, ContactShadows } from "@react-three/drei";
import { AdditiveBlending, Group, Mesh, Shape, type PointLight } from "three";

const ACCENT = "#6E63E6";
const ACCENT_DEEP = "#5B5BD6";
const BODY = "#ECEBFB";
const BODY_DARK = "#D7D5F2";
const GRAPHITE = "#3B3A52";
const STEEL = "#C9CBE6";
const GOLD = "#E7C56B";
const MONEY = "#0EA88E";

// ───────────────────── helpers ─────────────────────
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeInOut = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const phase = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

// Размеры кейса
const W = 2.7;
const D = 1.7;
const BODY_H = 1.15;
const LID_H = 0.78;
const BOTTOM_Y = -BODY_H / 2;

// ───────────────────── эмблема (ромб + молния) ─────────────────────
function Emblem() {
  const bolt = useMemo(() => {
    const s = new Shape();
    s.moveTo(0.06, 0.26);
    s.lineTo(-0.12, 0.02);
    s.lineTo(0.0, 0.02);
    s.lineTo(-0.08, -0.26);
    s.lineTo(0.14, 0.04);
    s.lineTo(0.02, 0.04);
    s.closePath();
    return s;
  }, []);
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.5, 0.5, 0.04]} />
        <meshStandardMaterial color={GRAPHITE} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <extrudeGeometry args={[bolt, { depth: 0.03, bevelEnabled: false }]} />
        <meshStandardMaterial color="#fff" emissive={ACCENT} emissiveIntensity={0.5} metalness={0.2} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Latch({ x }: { x: number }) {
  return (
    <group position={[x, -0.12, D / 2 + 0.02]}>
      <mesh>
        <boxGeometry args={[0.26, 0.34, 0.08]} />
        <meshStandardMaterial color={GRAPHITE} metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.02, 0.05]}>
        <boxGeometry args={[0.16, 0.12, 0.06]} />
        <meshStandardMaterial color={ACCENT} metalness={0.6} roughness={0.25} emissive={ACCENT} emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

function Key({ groupRef }: { groupRef: React.RefObject<Group> }) {
  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0.34]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.035, 16, 32]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} emissive={GOLD} emissiveIntensity={0.12} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.62, 20]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} emissive={GOLD} emissiveIntensity={0.12} />
      </mesh>
      <mesh position={[0.07, -0.02, -0.26]}>
        <boxGeometry args={[0.1, 0.16, 0.06]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0.07, -0.06, -0.16]}>
        <boxGeometry args={[0.1, 0.1, 0.05]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  );
}

// ───────────────────── СКИНЫ (оружие из примитивов) ─────────────────────

/** Нож-штык: профиль клинка через extrude + рукоять. */
function Knife() {
  const blade = useMemo(() => {
    const s = new Shape();
    s.moveTo(-0.42, -0.05);
    s.lineTo(0.24, -0.07);
    s.lineTo(0.46, 0.0); // остриё
    s.lineTo(0.22, 0.09);
    s.lineTo(-0.42, 0.07);
    s.closePath();
    return s;
  }, []);
  return (
    <group rotation={[0, 0, 0.2]} scale={1.05}>
      <mesh>
        <extrudeGeometry args={[blade, { depth: 0.035, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.01, bevelSegments: 1 }]} />
        <meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.18} emissive={ACCENT} emissiveIntensity={0.12} />
      </mesh>
      {/* Гарда */}
      <mesh position={[-0.44, 0, 0.017]}>
        <boxGeometry args={[0.06, 0.22, 0.1]} />
        <meshStandardMaterial color={GRAPHITE} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Рукоять */}
      <mesh position={[-0.62, 0, 0.017]} rotation={[0, 0, 0.04]}>
        <boxGeometry args={[0.34, 0.1, 0.08]} />
        <meshStandardMaterial color={ACCENT} metalness={0.5} roughness={0.35} emissive={ACCENT} emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

/** Снайперская винтовка (AWP-стиль). */
function Rifle() {
  return (
    <group rotation={[0, 0, 0.05]} scale={0.92}>
      {/* Цевьё/корпус */}
      <mesh>
        <boxGeometry args={[1.25, 0.14, 0.1]} />
        <meshStandardMaterial color={ACCENT_DEEP} metalness={0.5} roughness={0.3} emissive={ACCENT} emissiveIntensity={0.12} />
      </mesh>
      {/* Ствол */}
      <mesh position={[0.85, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.035, 0.035, 0.55, 16]} />
        <meshStandardMaterial color={GRAPHITE} metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Прицел */}
      <mesh position={[0.05, 0.16, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 0.42, 20]} />
        <meshStandardMaterial color={GRAPHITE} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.27, 0.16, 0]}>
        <cylinderGeometry args={[0.062, 0.062, 0.04, 20]} />
        <meshStandardMaterial color={MONEY} emissive={MONEY} emissiveIntensity={0.4} metalness={0.3} roughness={0.2} />
      </mesh>
      {/* Приклад */}
      <mesh position={[-0.72, -0.02, 0]}>
        <boxGeometry args={[0.36, 0.26, 0.09]} />
        <meshStandardMaterial color={ACCENT_DEEP} metalness={0.45} roughness={0.35} />
      </mesh>
      {/* Магазин */}
      <mesh position={[0.1, -0.18, 0]} rotation={[0, 0, 0.18]}>
        <boxGeometry args={[0.16, 0.26, 0.08]} />
        <meshStandardMaterial color={GRAPHITE} metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

/** Пистолет (Desert Eagle-стиль). */
function Pistol() {
  return (
    <group rotation={[0, 0, 0.05]} scale={1.05}>
      {/* Затвор */}
      <mesh>
        <boxGeometry args={[0.6, 0.16, 0.08]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.2} emissive={GOLD} emissiveIntensity={0.18} />
      </mesh>
      {/* Ствол */}
      <mesh position={[0.34, 0.03, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.18, 14]} />
        <meshStandardMaterial color={GRAPHITE} metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Рукоять */}
      <mesh position={[-0.16, -0.2, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[0.16, 0.34, 0.08]} />
        <meshStandardMaterial color={GRAPHITE} metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Скоба */}
      <mesh position={[-0.02, -0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.018, 12, 24, Math.PI]} />
        <meshStandardMaterial color={GRAPHITE} metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  );
}

/** Световой столб «рарности» вокруг скина (цилиндр — не зависит от вращения). */
function RarityBeam({ color }: { color: string }) {
  return (
    <mesh position={[0, 0.05, 0]}>
      <cylinderGeometry args={[0.16, 0.42, 1.7, 24, 1, true]} />
      <meshBasicMaterial color={color} transparent opacity={0.16} blending={AdditiveBlending} depthWrite={false} side={2} />
    </mesh>
  );
}

function CaseScene() {
  const root = useRef<Group>(null);
  const lidPivot = useRef<Group>(null);
  const keyRef = useRef<Group>(null);
  const innerLight = useRef<PointLight>(null);
  const beam = useRef<Mesh>(null);
  const item1 = useRef<Group>(null);
  const item2 = useRef<Group>(null);
  const item3 = useRef<Group>(null);

  const CYCLE = 9;
  const lockZ = D / 2 + 0.14;

  useFrame((state) => {
    const tt = state.clock.elapsedTime % CYCLE;

    if (root.current) {
      const ty = state.pointer.x * 0.35;
      const tx = -state.pointer.y * 0.18;
      root.current.rotation.y += (ty - root.current.rotation.y) * 0.05;
      root.current.rotation.x += (tx - root.current.rotation.x) * 0.05;
    }

    const approach = phase(tt, 0.2, 1.8);
    const turn = phase(tt, 1.9, 2.5);
    const open = phase(tt, 2.5, 3.6);
    const close = phase(tt, 6.4, 7.4);
    const retreat = phase(tt, 7.5, 8.8);

    if (keyRef.current) {
      const inFrom = 3.4;
      const zIn = inFrom + (lockZ - inFrom) * easeOut(approach);
      const zOut = lockZ + (inFrom - lockZ) * easeInOut(retreat);
      keyRef.current.position.set(0.0 + (1 - easeOut(approach)) * 1.2, -0.12, retreat > 0 ? zOut : zIn);
      keyRef.current.rotation.z = easeInOut(turn) * (Math.PI / 2) * (1 - easeInOut(close));
      const visible = approach > 0.01 && retreat < 0.99;
      keyRef.current.visible = visible;
      keyRef.current.scale.setScalar(visible ? 1 : 0.001);
    }

    const openness = clamp01(easeInOut(open) - easeInOut(close));
    if (lidPivot.current) lidPivot.current.rotation.x = -openness * 1.95;

    const glow = clamp01(openness * 1.1) * (0.85 + 0.15 * Math.sin(state.clock.elapsedTime * 4));
    if (innerLight.current) innerLight.current.intensity = glow * 20;
    if (beam.current) {
      beam.current.visible = openness > 0.05;
      beam.current.scale.set(1, 0.6 + openness * 1.6, 1);
      (beam.current.material as { opacity: number }).opacity = openness * 0.18;
    }

    // Скины поднимаются из кейса и парят, медленно вращаясь (как при осмотре)
    const items = [item1, item2, item3];
    const offs = [
      { x: -0.62, z: 0.0, base: 0.0, h: 1.45 },
      { x: 0.6, z: 0.18, base: 0.7, h: 1.62 },
      { x: 0.02, z: -0.42, base: 1.4, h: 1.32 },
    ];
    const rise = clamp01(openness);
    items.forEach((g, i) => {
      if (!g.current) return;
      const o = offs[i];
      const floatY = Math.sin(state.clock.elapsedTime * 1.5 + o.base) * 0.1;
      g.current.position.set(o.x, BOTTOM_Y + 0.25 + rise * o.h + floatY * rise, o.z);
      g.current.rotation.y += 0.012 + i * 0.003;
      g.current.scale.setScalar(rise * 0.92);
      g.current.visible = rise > 0.02;
    });
  });

  return (
    <>
      <ambientLight intensity={0.78} />
      <directionalLight position={[5, 8, 5]} intensity={1.9} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 3, 2]} intensity={0.7} color={ACCENT} />
      <pointLight position={[-5, -1, 4]} intensity={35} color={ACCENT_DEEP} />
      <pointLight position={[5, -2, -2]} intensity={20} color={MONEY} />

      <Float speed={1.1} rotationIntensity={0.16} floatIntensity={0.6}>
        <group ref={root} position={[0, 0.2, 0]} rotation={[0.05, -0.25, 0]}>
          {/* Нижняя часть корпуса */}
          <RoundedBox args={[W, BODY_H, D]} radius={0.12} smoothness={6} castShadow receiveShadow>
            <meshStandardMaterial color={BODY} metalness={0.3} roughness={0.22} />
          </RoundedBox>

          {[-W / 2 + 0.06, W / 2 - 0.06].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]}>
              <boxGeometry args={[0.04, BODY_H * 0.7, D * 0.8]} />
              <meshStandardMaterial color={BODY_DARK} metalness={0.3} roughness={0.3} />
            </mesh>
          ))}

          <group position={[0, -0.05, D / 2 + 0.011]}>
            <Emblem />
          </group>

          <Latch x={-0.85} />
          <Latch x={0.85} />

          <group position={[0, -0.12, D / 2 + 0.02]}>
            <mesh>
              <boxGeometry args={[0.3, 0.36, 0.12]} />
              <meshStandardMaterial color={GRAPHITE} metalness={0.9} roughness={0.28} />
            </mesh>
            <mesh position={[0, 0.04, 0.07]}>
              <circleGeometry args={[0.06, 24]} />
              <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.25} emissive={GOLD} emissiveIntensity={0.1} />
            </mesh>
          </group>

          <pointLight ref={innerLight} position={[0, BOTTOM_Y + 0.4, 0]} intensity={0} color={ACCENT} distance={5} />
          <mesh ref={beam} position={[0, BOTTOM_Y + 1.1, 0]} visible={false}>
            <cylinderGeometry args={[0.05, W * 0.32, 2.0, 24, 1, true]} />
            <meshBasicMaterial color={ACCENT} transparent opacity={0} blending={AdditiveBlending} depthWrite={false} />
          </mesh>

          {/* Крышка на шарнире */}
          <group ref={lidPivot} position={[0, BODY_H / 2, -D / 2]}>
            <group position={[0, LID_H / 2, D / 2]}>
              <RoundedBox args={[W, LID_H, D]} radius={0.12} smoothness={6} castShadow receiveShadow>
                <meshStandardMaterial color={BODY} metalness={0.3} roughness={0.22} />
              </RoundedBox>
              <mesh position={[0, 0, D / 2 + 0.005]}>
                <boxGeometry args={[W * 0.92, 0.1, 0.02]} />
                <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.25} metalness={0.5} roughness={0.3} />
              </mesh>
            </group>
          </group>

          {/* СКИНЫ-дроп */}
          <group ref={item1}>
            <RarityBeam color={GOLD} />
            <Knife />
          </group>
          <group ref={item2}>
            <RarityBeam color={ACCENT} />
            <Rifle />
          </group>
          <group ref={item3}>
            <RarityBeam color={MONEY} />
            <Pistol />
          </group>

          <Key groupRef={keyRef} />
        </group>
      </Float>

      <ContactShadows position={[0, BOTTOM_Y - 0.35, 0]} opacity={0.25} blur={2.6} scale={9} far={4} color="#5B5BD6" />
    </>
  );
}

export default function Hero3D() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [0, 0.6, 6.6], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
      >
        <CaseScene />
      </Canvas>
    </div>
  );
}
