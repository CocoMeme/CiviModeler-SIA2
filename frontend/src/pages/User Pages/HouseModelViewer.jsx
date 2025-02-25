import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const HouseModelViewer = ({ modelData }) => {
  const [gltfScene, setGltfScene] = useState(null);

  useEffect(() => {
    if (modelData) {
      try {
        const loader = new GLTFLoader();

        // Ensure modelData is an actual JSON object, not a string
        const gltfJson = typeof modelData === "string" ? JSON.parse(modelData) : modelData;

        loader.parse(
          JSON.stringify(gltfJson), // Convert back to a string
          "", // No base path
          (gltf) => {
            setGltfScene(gltf.scene);
          },
          (error) => {
            console.error("Error parsing GLTF model:", error);
          }
        );
      } catch (error) {
        console.error("Error processing GLTF model:", error);
      }
    }
  }, [modelData]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ width: "100%", height: "100%" }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} />
        <OrbitControls />
        {gltfScene ? <primitive object={gltfScene} /> : <PlaceholderModel />}
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
