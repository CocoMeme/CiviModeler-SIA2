import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
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
  const [materialHistory, setMaterialHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const previewTimeout = useRef(null);
  const [hiddenParts, setHiddenParts] = useState(new Set());

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
        const materialGroups = new Map();

        // First pass: collect all materials and their properties
        scene.traverse((obj) => {
          if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
            
            if (!obj.material) {
              obj.material = new THREE.MeshStandardMaterial();
            }

            const processMaterial = (material, index = null) => {
              if (!material) return;

              // Extract base name (remove numbers from end)
              const baseName = obj.name.replace(/[_-]?\d+$/, '');
              const colorHex = material.color ? '#' + material.color.getHexString() : '#ffffff';
              
              // Create a unique key for this material group
              const groupKey = `${baseName}_${obj.uuid}_${index !== null ? index : ''}`;
              
              if (!materialGroups.has(groupKey)) {
                // Create a new material instance for this part
                const newMaterial = material.clone();
                
                materialGroups.set(groupKey, {
                  name: baseName,
                  color: colorHex,
                  originalColor: colorHex,
                  metalness: newMaterial.metalness || 0.5,
                  roughness: newMaterial.roughness || 0.5,
                  opacity: newMaterial.opacity || 1.0,
                  meshes: [],
                  materialIndices: new Set(),
                  material: newMaterial // Store the unique material instance
                });

                // Apply the new material to the mesh
                if (Array.isArray(obj.material)) {
                  if (index !== null) {
                    obj.material[index] = newMaterial;
                  }
                } else {
                  obj.material = newMaterial;
                }
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
          currentMaterial: {
            metalness: group.metalness,
            roughness: group.roughness,
            opacity: group.opacity
          },
          originalMaterial: {
            metalness: group.metalness,
            roughness: group.roughness,
            opacity: group.opacity
          },
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

    // Update only the meshes for this specific part UUID
    part.meshes.forEach(({ uuid, materialIndex }) => {
      const mesh = model.getObjectByProperty('uuid', uuid);
      if (!mesh) return;

      // Update color for the specific mesh's material
      if (Array.isArray(mesh.material)) {
        if (materialIndex !== undefined && mesh.material[materialIndex]) {
          mesh.material[materialIndex].color.set(newColor);
        }
      } else if (mesh.material) {
        mesh.material.color.set(newColor);
      }
    });

    // Update the state for this specific part
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

  const handleTransformChange = (type, axis, value) => {
    if (!model || !selectedPart) return;
    
    selectedPart.meshes.forEach(({ uuid }) => {
      model.traverse((obj) => {
        if (obj.isMesh && obj.uuid === uuid) {
          if (type === 'position') obj.position[axis] = value;
          if (type === 'rotation') obj.rotation[axis] = THREE.MathUtils.degToRad(value);
          if (type === 'scale') obj.scale[axis] = value;
        }
      });
    });
  };

  const addToHistory = useCallback((part, changes) => {
    setMaterialHistory(prev => {
      const newHistory = prev.slice(0, currentHistoryIndex + 1);
      return [...newHistory, { partId: part.meshUuid, changes }];
    });
    setCurrentHistoryIndex(prev => prev + 1);
  }, [currentHistoryIndex]);

  const undoMaterialChange = useCallback(() => {
    if (currentHistoryIndex < 0) return;

    const lastChange = materialHistory[currentHistoryIndex];
    const part = modelParts.find(p => p.meshUuid === lastChange.partId);
    
    if (part) {
      Object.entries(lastChange.changes.previous).forEach(([property, value]) => {
        handleMaterialChange(property, value, false);
      });
    }
    
    setCurrentHistoryIndex(prev => prev - 1);
  }, [currentHistoryIndex, materialHistory, modelParts]);

  const redoMaterialChange = useCallback(() => {
    if (currentHistoryIndex >= materialHistory.length - 1) return;

    const nextChange = materialHistory[currentHistoryIndex + 1];
    const part = modelParts.find(p => p.meshUuid === nextChange.partId);
    
    if (part) {
      Object.entries(nextChange.changes.current).forEach(([property, value]) => {
        handleMaterialChange(property, value, false);
      });
    }
    
    setCurrentHistoryIndex(prev => prev + 1);
  }, [currentHistoryIndex, materialHistory, modelParts]);

  const handleMaterialChange = (property, value, addHistory = true) => {
    if (!model || !selectedPart) return;

    const previousValues = {};
    selectedPart.meshes.forEach(({ uuid, materialIndex }) => {
      model.traverse((obj) => {
        if (obj.isMesh && obj.uuid === uuid) {
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          const targetMaterial = materialIndex !== null && materials[materialIndex] 
            ? materials[materialIndex] 
            : obj.material;

          // Store previous value before change
          previousValues[property] = targetMaterial[property]?.clone?.() || targetMaterial[property];

          if (property === 'color') {
            targetMaterial.color = new THREE.Color(value);
          } else {
            targetMaterial[property] = value;
            if (property === 'opacity') {
              targetMaterial.transparent = value < 1;
            }
          }
          targetMaterial.needsUpdate = true;
        }
      });
    });

    // Update the currentMaterial state in modelParts
    setModelParts(parts => 
      parts.map(p => 
        p.meshUuid === selectedPart.meshUuid
          ? { 
              ...p, 
              currentMaterial: { 
                ...p.currentMaterial, 
                [property]: value 
              }
            }
          : p
      )
    );

    // Add to history if needed
    if (addHistory) {
      addToHistory(selectedPart, {
        previous: { [property]: previousValues[property] },
        current: { [property]: value }
      });
    }
  };

  const resetTransforms = () => {
    if (!model || !selectedPart) return;

    selectedPart.meshes.forEach(({ uuid }) => {
      model.traverse((obj) => {
        if (obj.isMesh && obj.uuid === uuid) {
          obj.position.set(0, 0, 0);
          obj.rotation.set(0, 0, 0);
          obj.scale.set(1, 1, 1);
        }
      });
    });

    // Reset material properties
    handleMaterialChange('color', selectedPart.originalColor);
    handleMaterialChange('metalness', selectedPart.originalMaterial.metalness);
    handleMaterialChange('roughness', selectedPart.originalMaterial.roughness);
    handleMaterialChange('opacity', selectedPart.originalMaterial.opacity);
  };

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (!selectedPart || !model) return;

    const STEP = {
      position: e.shiftKey ? 1 : 0.1,
      rotation: e.shiftKey ? 10 : 1,
      scale: e.shiftKey ? 0.1 : 0.01
    };

    const updateTransform = (type, axis, delta) => {
      model.traverse((obj) => {
        if (obj.isMesh && selectedPart.meshes.some(mesh => mesh.uuid === obj.uuid)) {
          if (type === 'position') obj.position[axis] += delta;
          if (type === 'rotation') obj.rotation[axis] += THREE.MathUtils.degToRad(delta);
          if (type === 'scale') obj.scale[axis] = Math.max(0.1, obj.scale[axis] + delta);
        }
      });
    };

    const keyActions = {
      // Position controls
      'ArrowLeft': () => updateTransform('position', 'x', -STEP.position),
      'ArrowRight': () => updateTransform('position', 'x', STEP.position),
      'ArrowUp': () => updateTransform('position', 'y', STEP.position),
      'ArrowDown': () => updateTransform('position', 'y', -STEP.position),
      '[': () => updateTransform('position', 'z', -STEP.position),
      ']': () => updateTransform('position', 'z', STEP.position),

      // Rotation controls (with Alt key)
      'KeyQ': () => e.altKey && updateTransform('rotation', 'x', -STEP.rotation),
      'KeyE': () => e.altKey && updateTransform('rotation', 'x', STEP.rotation),
      'KeyA': () => e.altKey && updateTransform('rotation', 'y', -STEP.rotation),
      'KeyD': () => e.altKey && updateTransform('rotation', 'y', STEP.rotation),
      'KeyW': () => e.altKey && updateTransform('rotation', 'z', -STEP.rotation),
      'KeyS': () => e.altKey && updateTransform('rotation', 'z', STEP.rotation),

      // Scale controls (with Ctrl key)
      'KeyX': () => e.ctrlKey && updateTransform('scale', 'x', e.shiftKey ? -STEP.scale : STEP.scale),
      'KeyY': () => e.ctrlKey && updateTransform('scale', 'y', e.shiftKey ? -STEP.scale : STEP.scale),
      'KeyZ': () => e.ctrlKey && updateTransform('scale', 'z', e.shiftKey ? -STEP.scale : STEP.scale),
    };

    const action = keyActions[e.code];
    if (action) {
      e.preventDefault();
      action();
    }

    // Add undo/redo shortcuts
    if (e.ctrlKey && e.code === 'KeyZ') {
      if (e.shiftKey) {
        redoMaterialChange();
      } else {
        undoMaterialChange();
      }
      e.preventDefault();
    }
  }, [selectedPart, model, undoMaterialChange, redoMaterialChange]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Toggle part visibility
  const handleTogglePartVisibility = (partUuid) => {
    const part = modelParts.find(p => p.meshUuid === partUuid);
    if (!part) return;

    setHiddenParts(prev => {
      const next = new Set(prev);
      if (next.has(partUuid)) {
        next.delete(partUuid);
      } else {
        next.add(partUuid);
      }
      return next;
    });

    // Update mesh visibility
    part.meshes.forEach(({ uuid }) => {
      model.traverse((obj) => {
        if (obj.isMesh && obj.uuid === uuid) {
          obj.visible = !obj.visible;
        }
      });
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

        {/* Keyboard Shortcuts Help */}
        <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
          <button
            onClick={() => alert(`
Keyboard Shortcuts:

Material Controls:
- Ctrl + Z: Undo material change
- Ctrl + Shift + Z: Redo material change

Transform Controls:
Position:
- Arrow Keys: Move in X/Y plane
- [ and ]: Move in Z axis
- Hold Shift for larger steps

Rotation (Hold Alt):
- Q/E: Rotate around X axis
- A/D: Rotate around Y axis
- W/S: Rotate around Z axis
- Hold Shift for larger angles

Scale (Hold Ctrl):
- X: Scale X axis
- Y: Scale Y axis
- Z: Scale Z axis
- Hold Shift to decrease
            `)}
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
            Keyboard Shortcuts (?)
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
        onTransformChange={handleTransformChange}
        onMaterialChange={handleMaterialChange}
        onResetTransforms={resetTransforms}
        canUndo={currentHistoryIndex >= 0}
        canRedo={currentHistoryIndex < materialHistory.length - 1}
        onUndo={undoMaterialChange}
        onRedo={redoMaterialChange}
        onTogglePartVisibility={handleTogglePartVisibility}
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
