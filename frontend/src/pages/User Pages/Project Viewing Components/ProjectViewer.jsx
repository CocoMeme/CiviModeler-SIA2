import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLocation, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import axios from 'axios';
import { AppContext } from '../../../context/AppContext';
import ProjectSidebar from './ProjectSidebar';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

const ProjectViewer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl } = useContext(AppContext);
  const { modelUrl, projectId } = location.state || {};
  const [model, setModel] = useState(null);
  const [modelParts, setModelParts] = useState([]);
  const [selectedParts, setSelectedParts] = useState(new Set()); // Add this state for multiple selection
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [materialHistory, setMaterialHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const previewTimeout = useRef(null);
  const [hiddenParts, setHiddenParts] = useState(new Set());
  const [previousMaterials, setPreviousMaterials] = useState(new Map());
  const [modelVersions, setModelVersions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

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

  // Add fetch versions effect
  useEffect(() => {
    const fetchVersions = async () => {
      if (!projectId) return;

      try {
        const response = await axios.get(`${backendUrl}/api/project/${projectId}/versions`);
        if (response.data) {
          setModelVersions(response.data.allVersions || []);
        }
      } catch (error) {
        console.error('Error fetching model versions:', error);
        setError(error.response?.data?.message || 'Error fetching model versions');
      }
    };

    fetchVersions();
  }, [projectId, backendUrl]);

  // Add version selection handler
  const handleVersionSelect = async (version) => {
    try {
      setLoading(true);
      setModel(null); // Clear current model
      
      // Load the selected version's model
      const loader = new GLTFLoader();
      await new Promise((resolve, reject) => {
        loader.load(
          version.modelUrl,
          (gltf) => {
            const scene = gltf.scene;
            // Apply existing material processing logic
            scene.traverse((obj) => {
              if (obj.isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
                // ... rest of material processing
              }
            });
            setModel(scene);
            resolve();
          },
          undefined,
          reject
        );
      });

      // Update project details with the selected version
      setProjectDetails(prev => ({
        ...prev,
        sloyd: version,
        currentVersion: version.version
      }));
    } catch (error) {
      console.error('Error loading model version:', error);
      setError('Error loading model version');
    } finally {
      setLoading(false);
    }
  };

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
    if (!model || selectedParts.size === 0) return;
    
    selectedParts.forEach(partUuid => {
      const part = modelParts.find(p => p.meshUuid === partUuid);
      if (part) {
        part.meshes.forEach(({ uuid }) => {
          model.traverse((obj) => {
            if (obj.isMesh && obj.uuid === uuid) {
              if (type === 'position') obj.position[axis] = value;
              if (type === 'rotation') obj.rotation[axis] = THREE.MathUtils.degToRad(value);
              if (type === 'scale') obj.scale[axis] = value;
            }
          });
        });
      }
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
    
    if (lastChange.type === 'delete') {
      // Restore deleted parts
      setModelParts(prev => [...prev, ...lastChange.partsData.parts]);
      
      // Restore mesh states
      lastChange.partsData.meshStates.forEach((state, uuid) => {
        model.traverse((obj) => {
          if (obj.isMesh && obj.uuid === uuid) {
            obj.visible = state.visible;
            obj.position.copy(state.position);
            obj.rotation.copy(state.rotation);
            obj.scale.copy(state.scale);
            obj.material = state.material.clone();
          }
        });
      });

      // Restore selection
      setSelectedParts(new Set(lastChange.selectedParts));
    } else if (lastChange.type === 'reset-transforms') {
      // Restore previous transform states
      lastChange.previousStates.forEach((state, uuid) => {
        model.traverse((obj) => {
          if (obj.isMesh && obj.uuid === uuid) {
            obj.position.copy(state.position);
            obj.rotation.copy(state.rotation);
            obj.scale.copy(state.scale);
          }
        });
      });
      setSelectedParts(new Set(lastChange.selectedParts));
    } else {
      // Handle regular material changes
      const part = modelParts.find(p => p.meshUuid === lastChange.partId);
      if (part) {
        Object.entries(lastChange.changes.previous).forEach(([property, value]) => {
          handleMaterialChange(property, value, false);
        });
      }
    }
    
    setCurrentHistoryIndex(prev => prev - 1);
  }, [currentHistoryIndex, materialHistory, modelParts, model]);

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
    if (!model || selectedParts.size === 0) return;

    const previousValues = {};
    selectedParts.forEach(partUuid => {
      const part = modelParts.find(p => p.meshUuid === partUuid);
      if (part) {
        part.meshes.forEach(({ uuid, materialIndex }) => {
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
      }
    });

    // Update the currentMaterial state in modelParts
    setModelParts(parts => 
      parts.map(p => 
        selectedParts.has(p.meshUuid)
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
      selectedParts.forEach(partUuid => {
        const part = modelParts.find(p => p.meshUuid === partUuid);
        if (part) {
          addToHistory(part, {
            previous: { [property]: previousValues[property] },
            current: { [property]: value }
          });
        }
      });
    }
  };

  // Function to delete selected parts
  const deleteSelectedParts = () => {
    if (selectedParts.size === 0) return;

    // Store the current state for undo
    const deletedPartsData = {
      parts: modelParts.filter(part => selectedParts.has(part.meshUuid)),
      meshStates: new Map()
    };

    // Remove selected parts from the scene
    selectedParts.forEach(partUuid => {
      const part = modelParts.find(p => p.meshUuid === partUuid);
      if (part) {
        part.meshes.forEach(({ uuid }) => {
          model.traverse((obj) => {
            if (obj.isMesh && obj.uuid === uuid) {
              // Store mesh state for undo
              deletedPartsData.meshStates.set(uuid, {
                visible: obj.visible,
                position: obj.position.clone(),
                rotation: obj.rotation.clone(),
                scale: obj.scale.clone(),
                material: obj.material.clone()
              });
              
              // Hide the mesh instead of removing it (for undo capability)
              obj.visible = false;
            }
          });
        });
      }
    });

    // Add to history
    setMaterialHistory(prev => {
      const newHistory = prev.slice(0, currentHistoryIndex + 1);
      return [...newHistory, { 
        type: 'delete',
        partsData: deletedPartsData,
        selectedParts: new Set(selectedParts)
      }];
    });
    setCurrentHistoryIndex(prev => prev + 1);

    // Update model parts state
    setModelParts(prev => prev.filter(part => !selectedParts.has(part.meshUuid)));
    setSelectedParts(new Set()); // Clear selection
  };

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if (selectedParts.size === 0 || !model) return;

    const STEP = {
      position: e.shiftKey ? 1 : 0.1,
      rotation: e.shiftKey ? 10 : 1,
      scale: e.shiftKey ? 0.1 : 0.01
    };

    const updateTransform = (type, axis, delta) => {
      model.traverse((obj) => {
        if (obj.isMesh && selectedParts.has(obj.uuid)) {
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

    // Add delete shortcut
    if (e.code === 'Delete' || e.code === 'Backspace') {
      e.preventDefault();
      deleteSelectedParts();
      return;
    }
  }, [selectedParts, model, undoMaterialChange, redoMaterialChange, deleteSelectedParts]);

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

  // Update the highlightPart function with better state management
  const highlightPart = (part, isSelected) => {
    if (!model || !part) return;

    part.meshes.forEach(({ uuid, materialIndex }) => {
      model.traverse((obj) => {
        if (obj.isMesh && obj.uuid === uuid) {
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          const targetMaterial = materialIndex !== null && materials[materialIndex] 
            ? materials[materialIndex] 
            : obj.material;

          const materialKey = uuid + (materialIndex || '');

          if (isSelected) {
            // Store original material state if not already stored
            if (!previousMaterials.has(materialKey)) {
              setPreviousMaterials(prev => {
                const newMap = new Map(prev);
                newMap.set(materialKey, {
                  emissive: targetMaterial.emissive.clone(),
                  emissiveIntensity: targetMaterial.emissiveIntensity
                });
                return newMap;
              });
            }

            // Apply highlighting effect
            targetMaterial.emissive.setHex(0x3366ff);
            targetMaterial.emissiveIntensity = 0.8;
          } else {
            // Restore to original state
            const prevState = previousMaterials.get(materialKey);
            if (prevState) {
              targetMaterial.emissive.copy(prevState.emissive);
              targetMaterial.emissiveIntensity = prevState.emissiveIntensity;
            } else {
              // Reset to default if no previous state
              targetMaterial.emissive.setHex(0x000000);
              targetMaterial.emissiveIntensity = 0;
            }

            // Remove from previousMaterials when unhighlighting
            setPreviousMaterials(prev => {
              const newMap = new Map(prev);
              newMap.delete(materialKey);
              return newMap;
            });
          }
          targetMaterial.needsUpdate = true;
        }
      });
    });
  };

  // Update handleClick function to properly manage highlighting
  const handleClick = (event) => {
    if (!model) return;

    event.stopPropagation();

    if (event.intersections.length > 0) {
      const clickedMesh = event.intersections[0].object;
      const clickedPart = modelParts.find(part =>
        part.meshes.some(mesh => mesh.uuid === clickedMesh.uuid)
      );

      if (clickedPart) {
        setSelectedParts(prev => {
          const next = new Set();
          
          if (event.ctrlKey || event.metaKey) {
            // Multi-select mode
            if (prev.has(clickedPart.meshUuid)) {
              // If clicking an already selected part, unselect it
              prev.forEach(uuid => {
                if (uuid !== clickedPart.meshUuid) {
                  next.add(uuid);
                }
              });
              // Unhighlight the clicked part
              highlightPart(clickedPart, false);
            } else {
              // Add the new part to selection
              prev.forEach(uuid => next.add(uuid));
              next.add(clickedPart.meshUuid);
              // Highlight the new part
              highlightPart(clickedPart, true);
            }
          } else {
            // Single selection mode
            // First unhighlight all currently selected parts
            prev.forEach(uuid => {
              const part = modelParts.find(p => p.meshUuid === uuid);
              if (part) {
                highlightPart(part, false);
              }
            });

            // Select and highlight only the clicked part
            next.add(clickedPart.meshUuid);
            highlightPart(clickedPart, true);
          }
          
          return next;
        });
      }
    } else {
      // If clicking empty space, clear all selections and highlights
      handlePointerMissed(event);
    }
  };

  // Update handlePointerMissed for better cleanup
  const handlePointerMissed = (event) => {
    if (event.ctrlKey || event.metaKey) return;
    
    // Remove highlights from all selected parts
    selectedParts.forEach(partUuid => {
      const part = modelParts.find(p => p.meshUuid === partUuid);
      if (part) {
        highlightPart(part, false);
      }
    });
    
    // Clear all selections and material states
    setPreviousMaterials(new Map());
    setSelectedParts(new Set());
  };

  // Add resetTransforms function
  const resetTransforms = () => {
    if (!model || selectedParts.size === 0) return;

    // Store the current state for undo
    const previousStates = new Map();
    selectedParts.forEach(partUuid => {
      const part = modelParts.find(p => p.meshUuid === partUuid);
      if (part) {
        part.meshes.forEach(({ uuid }) => {
          model.traverse((obj) => {
            if (obj.isMesh && obj.uuid === uuid) {
              // Store current state for undo
              previousStates.set(uuid, {
                position: obj.position.clone(),
                rotation: obj.rotation.clone(),
                scale: obj.scale.clone()
              });

              // Reset transforms
              obj.position.set(0, 0, 0);
              obj.rotation.set(0, 0, 0);
              obj.scale.set(1, 1, 1);
            }
          });
        });
      }
    });

    // Add to history
    setMaterialHistory(prev => {
      const newHistory = prev.slice(0, currentHistoryIndex + 1);
      return [...newHistory, {
        type: 'reset-transforms',
        previousStates,
        selectedParts: new Set(selectedParts)
      }];
    });
    setCurrentHistoryIndex(prev => prev + 1);
  };

  // Add save function
  const handleSaveModel = async () => {
    if (!model) return;
    
    setIsSaving(true);
    try {
      // Export the current model state to GLB
      const exporter = new GLTFExporter();
      const glbData = await new Promise((resolve, reject) => {
        exporter.parse(model, 
          (gltf) => resolve(gltf),
          (error) => reject(error),
          { binary: true } // Export as GLB
        );
      });

      // Create form data with the model
      const formData = new FormData();
      const blob = new Blob([glbData], { type: 'model/gltf-binary' });
      const file = new File([blob], 'model.glb', { type: 'model/gltf-binary' });
      formData.append('model', file);
      formData.append('projectId', projectId);
      formData.append('description', 'Updated model with customizations');

      // Save the model
      const response = await axios.post(
        `${backendUrl}/api/project/save-model`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data) {
        // Update the versions list with the new version
        setModelVersions(prev => [...prev, response.data.newVersion]);
        setProjectDetails(prev => ({
          ...prev,
          sloyd: response.data.newVersion,
          currentVersion: response.data.newVersion.version
        }));
      }
    } catch (error) {
      console.error('Error saving model:', error);
      setError('Failed to save model changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0, display: 'flex' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        {/* Back Button and Save Button */}
        <div style={{ position: "absolute", top: "10px", left: "10px", zIndex: 10, display: 'flex', gap: '10px' }}>
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
          <button
            onClick={handleSaveModel}
            disabled={isSaving}
            style={{
              background: isSaving ? "#666" : "#22c55e",
              color: "#fff",
              padding: "10px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: isSaving ? "not-allowed" : "pointer",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {isSaving ? (
              <>
                <span className="animate-spin">↻</span>
                Saving...
              </>
            ) : (
              <>
                <span>💾</span>
                Save Changes
              </>
            )}
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
- Delete/Backspace: Delete selected parts
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

          {/* Add pointer events to model */}
          {model ? (
            <primitive 
              object={model} 
              onClick={handleClick}
              onPointerMissed={handlePointerMissed}
            />
          ) : (
            <PlaceholderModel />
          )}
        </Canvas>
      </div>
      
      <ProjectSidebar 
        projectDetails={projectDetails} 
        loading={loading}
        error={error}
        modelParts={modelParts}
        selectedParts={selectedParts} // Update to pass selectedParts instead of selectedPart
        setSelectedParts={setSelectedParts} // Update to pass setSelectedParts
        updatePartColor={updatePartColor}
        resetAllColors={resetAllColors}
        onTransformChange={handleTransformChange}
        onMaterialChange={handleMaterialChange}
        onResetTransforms={resetTransforms}
        onDeleteParts={deleteSelectedParts} // Add delete function
        canUndo={currentHistoryIndex >= 0}
        canRedo={currentHistoryIndex < materialHistory.length - 1}
        onUndo={undoMaterialChange}
        onRedo={redoMaterialChange}
        onTogglePartVisibility={handleTogglePartVisibility}
        modelVersions={modelVersions}
        currentVersion={projectDetails?.currentVersion}
        onVersionSelect={handleVersionSelect}
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
