// npm install three @react-three/fiber @react-three/drei
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stage } from "@react-three/drei";
import { Mesh } from "three";

/*
| Feature                 | Description                          |
| ----------------------- | ------------------------------------ |
| `castShadow`            | Cube casts shadows onto the ground.  |
| `receiveShadow`         | Ground receives shadows.             |
| `shadowMaterial`        | Creates a soft shadow on the ground. |
| `directionalLight`      | Adds sunlight-like shadows.          |
| `metalness + roughness` | Adds realism to cube material.       |
*/

function SpinningBox(props: JSX.IntrinsicElements["mesh"]) {
  const meshRef = useRef<Mesh>(null!);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh {...props} ref={meshRef} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" roughness={0.5} metalness={0.2} />
    </mesh>
  );
}

export default function Animation() {
  return (
    <div className="container flex">
      <div className="content">
        <h1>React Three Fiber</h1>
        <div style={{ width: "100%", height: "500px" }}>
          <Canvas shadows camera={{ position: [3, 3, 5], fov: 50 }}>
            {/* Lights */}
            <ambientLight intensity={0.3} />
            <directionalLight
              castShadow
              position={[5, 5, 5]}
              intensity={1.2}
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-far={10}
              shadow-camera-left={-5}
              shadow-camera-right={5}
              shadow-camera-top={5}
              shadow-camera-bottom={-5}
            />

            {/* Ground */}
            <mesh
              receiveShadow
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -0.5, 0]}
            >
              <planeGeometry args={[10, 10]} />
              <shadowMaterial transparent opacity={0.3} />
            </mesh>

            {/* Cube */}
            <SpinningBox position={[0, 0.5, 0]} />

            <OrbitControls />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
