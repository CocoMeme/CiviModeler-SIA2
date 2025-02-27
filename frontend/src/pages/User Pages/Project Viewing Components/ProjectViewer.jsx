import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLocation } from 'react-router-dom';

const ProjectViewer = () => {
  const mountRef = useRef(null);
  const location = useLocation();
  const { modelUrl } = location.state || {};
  const [model, setModel] = useState(null);

  useEffect(() => {
    if (!modelUrl) {
      console.error('No model URL provided.');
      return;
    }

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        const scene = gltf.scene;
        scene.traverse((obj) => {
          if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
            if (!obj.material) {
              console.warn("🚨 Model has no material! Applying default material.");
              obj.material = new THREE.MeshStandardMaterial({ color: "gray" });
            }
          }
        });
        setModel(scene);
      },
      undefined,
      (error) => {
        console.error("🚨 Error loading model:", error);
      }
    );
  }, [modelUrl]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Canvas camera={{ position: [12, 3, -14], fov: 55 }} style={{ width: "70%", height: "100%" }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} />
        <OrbitControls />
        {model ? <primitive object={model} /> : <PlaceholderModel />}
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

export default ProjectViewer;
