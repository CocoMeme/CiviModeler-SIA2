import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLocation, useNavigate } from 'react-router-dom';
import * as THREE from 'three';

const ProjectViewer = () => {
  const navigate = useNavigate();
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
    <div style={{ width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0 }}>
      {/* Back Button */}
      <div style={{ position: "absolute", top: "10px", left: "10px", zIndex: 10 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "#333",
            color: "#fff",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
          }}
        >
          ← Back
        </button>
      </div>

      {/* 3D Viewer */}
      <Canvas
        camera={{ position: [0, 2, 5], fov: 75 }}
        style={{ width: "100%", height: "100%" }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x020617)); // Dark blue background
        }}
      >
        <ambientLight intensity={2} />
        <directionalLight position={[5, 10, 5]} intensity={2} />
        <OrbitControls enableDamping={true} />
        
        {/* Custom GridHelper */}
        <CustomGrid />

        {model ? <primitive object={model} /> : <PlaceholderModel />}
      </Canvas>
    </div>
  );
};

// Custom grid with glowing blue lines
const CustomGrid = () => {
  const gridRef = React.useRef();

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.material.opacity = 0.7; // Make grid slightly transparent
      gridRef.current.material.transparent = true;
    }
  }, []);

  return <gridHelper ref={gridRef} args={[50, 50, "#1e90ff", "#1e90ff"]} />;
};

// A placeholder cube while loading or if there's an issue
const PlaceholderModel = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="orange" />
  </mesh>
);

export default ProjectViewer;
