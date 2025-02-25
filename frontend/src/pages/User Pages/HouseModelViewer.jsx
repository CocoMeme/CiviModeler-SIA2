import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";

const HouseModelViewer = ({ modelData }) => {
  const [gltf, setGltf] = useState(null);

  useEffect(() => {
    if (modelData) {
      const loader = new GLTFLoader();
      const jsonString = JSON.stringify(modelData);
      const arrayBuffer = new TextEncoder().encode(jsonString).buffer;

      loader.parse(
        arrayBuffer,
        "",
        (gltf) => {
          console.log("Model loaded successfully:", gltf);
          setGltf(gltf);
        },
        (error) => {
          console.error("Error loading GLTF model:", error);
        }
      );
    }
  }, [modelData]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ width: "100%", height: "100%" }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} />
        <OrbitControls />
        {gltf ? <primitive object={gltf.scene} /> : <PlaceholderModel />}
      </Canvas>
    </div>
  );
};

// A placeholder cube while loading or if there's an issue
const PlaceholderModel = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="orange" />
  </mesh>
);

export default HouseModelViewer;
