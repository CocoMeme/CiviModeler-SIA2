import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const HouseModelView = ({ modelData }) => {
  const modelRef = useRef();

  useEffect(() => {
    if (modelData) {
      const loader = new GLTFLoader();
      const parsedData = JSON.parse(modelData); // Parse the stringified GLTF data
      loader.parse(parsedData, "", (gltf) => {
        if (modelRef.current) {
          modelRef.current.add(gltf.scene);
        }
      });
    }
  }, [modelData]);

  return (
    <Canvas
      style={{ width: "100vw", height: "100vh" }} // Adjusts to full screen
      camera={{ position: [5, 3, 10], fov: 50 }} // Adjust camera as needed
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <group ref={modelRef} />
      <OrbitControls />
    </Canvas>
  );
};

export default HouseModelView;
