"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// Array of optimized image routes and their aspect ratios (width/height)
const PORTFOLIO_ASSETS = [
  { url: "/assets/wedding.webp", isPortrait: true },
  { url: "/assets/reception.webp", isPortrait: true },
  { url: "/assets/engagement.webp", isPortrait: true },
  { url: "/assets/haldi.webp", isPortrait: true },
  { url: "/assets/half_saree.webp", isPortrait: true },
  { url: "/assets/indoor.webp", isPortrait: false }, // Landscape page
  { url: "/assets/outdoor.webp", isPortrait: false }, // Landscape 10.jpg
  { url: "/assets/baby.webp", isPortrait: true }
];

// Individual floating frame component
function FloatingFrame({ url, index, isPortrait, mouse }: { url: string; index: number; isPortrait: boolean; mouse: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Group>(null);
  const texture = useTexture(url);
  
  // Distribute initial positions along a Z tunnel (Z: -2 to -14)
  const initialZ = -2 - index * 1.5;
  const initialX = (Math.random() - 0.5) * 6;
  const initialY = (Math.random() - 0.5) * 4;

  const [pos] = useState({ x: initialX, y: initialY, z: initialZ });
  const [speed] = useState(() => 0.003 + Math.random() * 0.002);
  const [rotSpeed] = useState(() => (Math.random() - 0.5) * 0.0004);
  const [driftSeed] = useState(() => Math.random() * 100);

  // Set initial dimensions based on aspect ratio
  const width = isPortrait ? 2.0 : 3.0;
  const height = isPortrait ? 2.8 : 2.0;

  useFrame((state) => {
    if (!meshRef.current) return;

    // 1. Move plane forward (towards camera, which is at Z=4)
    pos.z += speed;

    // Reset when it goes behind camera
    if (pos.z > 3.5) {
      pos.z = -12;
      pos.x = (Math.random() - 0.5) * 6;
      pos.y = (Math.random() - 0.5) * 4;
    }

    // 2. Slow natural drifting (Sine wave)
    const time = state.clock.getElapsedTime();
    const driftX = Math.sin(time * 0.2 + driftSeed) * 0.15;
    const driftY = Math.cos(time * 0.25 + driftSeed) * 0.15;

    // 3. Mouse Parallax (subtle opposite drift)
    const targetX = pos.x + driftX - mouse.x * 0.4;
    const targetY = pos.y + driftY - mouse.y * 0.3;

    // Lerp positions for ultra-smooth movement
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
    meshRef.current.position.z = pos.z;

    // 4. Slow rotation
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, (mouse.x * 0.1) + Math.sin(time * 0.1 + driftSeed) * 0.05, 0.05);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, (-mouse.y * 0.1) + Math.cos(time * 0.1 + driftSeed) * 0.03, 0.05);
    meshRef.current.rotation.z += rotSpeed;

    // 5. Opacity Fading
    // Fade in at the back (Z: -12 to -10) and fade out close to camera (Z: 2 to 3.5)
    let opacity = 1.0;
    if (pos.z < -10) {
      opacity = (pos.z + 12) / 2; // scale 0 to 1
    } else if (pos.z > 1.5) {
      opacity = Math.max(0, 1 - (pos.z - 1.5) / 2); // scale 1 to 0
    }
    
    // Apply opacity to material
    const materials = meshRef.current.children;
    materials.forEach((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.material && 'opacity' in mesh.material) {
        mesh.material.opacity = THREE.MathUtils.clamp(opacity, 0, 1);
        mesh.material.transparent = true;
      }
    });
  });

  return (
    <group ref={meshRef}>
      {/* Thin Gold Frame Backing */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[width + 0.06, height + 0.06]} />
        <meshBasicMaterial color="#D4AF37" toneMapped={false} />
      </mesh>
      
      {/* Image Mesh */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Particle system for floating dust/bokeh
function DustParticles({ count = 80 }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const [positions] = useState(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;      // X
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;   // Y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5; // Z
    }
    return arr;
  });

  const [speeds] = useState(() => {
    return Array.from({ length: count }, () => ({
      y: 0.002 + Math.random() * 0.003,
      x: (Math.random() - 0.5) * 0.002,
      z: 0.001 + Math.random() * 0.002
    }));
  });

  useFrame(() => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.getAttribute("position");
    
    for (let i = 0; i < count; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      // Apply speeds
      y += speeds[i].y;
      x += speeds[i].x;
      z += speeds[i].z;

      // Wrap-around bounds
      if (y > 4) y = -4;
      if (x > 6) x = -6;
      if (x < -6) x = 6;
      if (z > 3) z = -12;

      posAttr.setXYZ(i, x, y, z);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#D4AF37"
        size={0.06}
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Scene setup inside Canvas
function Scene({ mouse }: { mouse: { x: number; y: number } }) {
  const { camera } = useThree();
  
  useFrame(() => {
    // Gentle camera drift based on mouse coordinates for parallax
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 0.5, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 0.4, 0.03);
    camera.lookAt(0, 0, -4);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[2, 2, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-4, 4, -5]} intensity={0.8} color="#D4AF37" />
      
      {/* Fog to fade distant frames */}
      <fog attach="fog" args={["#050505", 3, 14]} />
      
      <Suspense fallback={null}>
        {PORTFOLIO_ASSETS.map((asset, index) => (
          <FloatingFrame
            key={asset.url}
            url={asset.url}
            index={index}
            isPortrait={asset.isPortrait}
            mouse={mouse}
          />
        ))}
      </Suspense>
      
      <DustParticles count={90} />
    </>
  );
}

export default function ThreeHero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!mounted) {
    return <div className="absolute inset-0 bg-primary z-0" />;
  }

  return (
    <div className="absolute inset-0 z-0 h-screen w-full bg-[#050505] overflow-hidden">
      {/* Background black mask gradient */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-primary via-transparent to-primary/80" />
      <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-primary/70 via-transparent to-primary/70" />
      
      <Canvas
        camera={{ fov: 75, near: 0.1, far: 20, position: [0, 0, 4] }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  );
}
