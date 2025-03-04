import React, { useEffect, useState, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLocation, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import axios from 'axios';
import { AppContext } from '../../../context/AppContext';
import ProjectSidebar from './ProjectSidebar';

const ProjectViewer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl } = useContext(AppContext);
  const { modelUrl, projectId } = location.state || {};
  const [model, setModel] = useState(null);
  const [modelParts, setModelParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch project details
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) {
        setError('No project ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${backendUrl}/api/project/${projectId}`);
        if (response.data) {
          setProjectDetails(response.data);
        } else {
          setError('No project details found');
        }
      } catch (error) {
        console.error('Error fetching project details:', error);
        setError(error.response?.data?.message || 'Error fetching project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, backendUrl]);

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
        const materialGroups = new Map(); // Map to store grouped materials

        // First pass: collect all materials and their properties
        scene.traverse((obj) => {
          if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
            
            if (!obj.material) {
              obj.material = new THREE.MeshStandardMaterial();
            }

            const processMaterial = (material, index = null) => {
              if (!material.color) return;

              // Extract base name (remove numbers from end)
              const baseName = obj.name.replace(/[_-]?\d+$/, '');
              const colorHex = '#' + material.color.getHexString();
              
              // Create a unique key for this material group
              const groupKey = `${baseName}_${colorHex}`;
              
              if (!materialGroups.has(groupKey)) {
                materialGroups.set(groupKey, {
                  name: baseName,
                  color: colorHex,
                  originalColor: colorHex,
                  meshes: [],
                  materialIndices: new Set()
                });
              }

              const group = materialGroups.get(groupKey);
              group.meshes.push({
                uuid: obj.uuid,
                materialIndex: index
              });
              if (index !== null) {
                group.materialIndices.add(index);
              }
            };

            if (Array.isArray(obj.material)) {
              obj.material.forEach((mat, index) => processMaterial(mat, index));
            } else {
              processMaterial(obj.material);
            }
          }
        });

        // Convert material groups to parts array
        const parts = Array.from(materialGroups.entries()).map(([key, group]) => ({
          name: group.name,
          meshUuid: key,
          currentColor: group.color,
          originalColor: group.originalColor,
          meshes: group.meshes,
          materialIndices: Array.from(group.materialIndices)
        }));

        setModel(scene);
        setModelParts(parts);
      },
      undefined,
      (error) => {
        console.error("🚨 Error loading model:", error);
      }
    );
  }, [modelUrl]);

  const updatePartColor = (partUuid, newColor) => {
    if (!model) return;

    const part = modelParts.find(p => p.meshUuid === partUuid);
    if (!part) return;

    // Update all meshes in the group
    part.meshes.forEach(({ uuid, materialIndex }) => {
      model.traverse((obj) => {
        if (obj.isMesh && obj.uuid === uuid) {
          if (Array.isArray(obj.material)) {
            if (materialIndex !== null && materialIndex !== undefined) {
              obj.material[materialIndex].color.set(newColor);
            }
          } else {
            obj.material.color.set(newColor);
          }
        }
      });
    });

    setModelParts(parts => 
      parts.map(p => 
        p.meshUuid === partUuid 
          ? { ...p, currentColor: newColor }
          : p
      )
    );
  };

  const resetAllColors = () => {
    if (!model) return;
    modelParts.forEach(part => {
      updatePartColor(part.meshUuid, part.originalColor);
    });
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0, display: 'flex' }}>
      <div style={{ flex: 1, position: 'relative' }}>
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
      
      <ProjectSidebar 
        projectDetails={projectDetails} 
        loading={loading}
        error={error}
        modelParts={modelParts}
        selectedPart={selectedPart}
        setSelectedPart={setSelectedPart}
        updatePartColor={updatePartColor}
        resetAllColors={resetAllColors}
      />
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
