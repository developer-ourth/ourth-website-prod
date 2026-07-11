"use client";

import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// The user's provided 3D product model
function ProductModel() {
  const { scene } = useGLTF("/models/oauth-optimized.glb");

  // Disable expensive real-time shadows if the model is high-poly to fix lag
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
  }, [scene]);

  return (
    <group>
      <primitive object={scene} scale={3.5} position={[0.8, 0.3, 0]} />
    </group>
  );
}

export default function Hero3DCarousel() {
  return (
    <div className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing z-10">
      <Canvas camera={{ position: [0, 3.0, 3.8], fov: 45 }} dpr={[1, 1]} style={{ background: 'transparent' }}>
        <ambientLight intensity={0.4} />
        {/* Studio lighting - adjusted to compensate for removed environment map */}
        <directionalLight position={[5, 10, 5]} intensity={1.8} />
        <directionalLight position={[-5, 5, -5]} intensity={0.8} color="#e0f2fe" />
        <spotLight position={[0, 5, 0]} intensity={1.2} angle={0.5} penumbra={1} color="#ffffff" />


        <Suspense fallback={null}>
          <Center>
            <ProductModel />
          </Center>
        </Suspense>

        {/* Only rotates horizontally when user interacts with mouse, plus automatic spinning */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.5}
          minPolarAngle={Math.PI / 2.5}
          autoRotate={true}
          autoRotateSpeed={1.5}
        />
      </Canvas>
    </div>
  );
}
