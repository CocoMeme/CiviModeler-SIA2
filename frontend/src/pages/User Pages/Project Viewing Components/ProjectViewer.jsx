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
import ProjectShortcuts from './ProjectShortcuts';
import ProjectToolbar from './ProjectToolbar';
import ProjectLoadingAnimation from './ProjectLoadingAnimation';
import { CustomGrid, PlaceholderModel, VersionInfo } from './Project3DSceneHelpers';
import ProjectModelChangeTracker from './ProjectModelChangeTracker';

const ProjectViewer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { backendUrl } = useContext(AppContext);
  const { projectId } = location.state || {};
  const [model, setModel] = useState(null);
  const [modelParts, setModelParts] = useState([]);
  const [originalModelParts, setOriginalModelParts] = useState([]);
  const [selectedParts, setSelectedParts] = useState(new Set());
  const [projectDetails, setProjectDetails] = useState(null);
  const [updatedMaterials, setUpdatedMaterials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modelLoading, setModelLoading] = useState(true);
  const [error, setError] = useState(null);
  const [materialHistory, setMaterialHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const previewTimeout = useRef(null);
  const [hiddenParts, setHiddenParts] = useState(new Set());
  const [previousMaterials, setPreviousMaterials] = useState(new Map());
  const [modelVersions, setModelVersions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [currentVersion, setCurrentVersion] = useState(null);
  const [isComparingVersions, setIsComparingVersions] = useState(false);

  // Fetch project details and versions simultaneously
  useEffect(() => {
    const fetchProjectData = async () => {
      if (!projectId) {
        setError('No project ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch project details and versions in parallel
        const [projectResponse, versionsResponse] = await Promise.all([
          axios.get(`${backendUrl}/api/project/${projectId}`),
          axios.get(`${backendUrl}/api/project/${projectId}/versions`)
        ]);

        if (projectResponse.data) {
          setProjectDetails(projectResponse.data);
        } else {
          setError('No project details found');
        }

        if (versionsResponse.data) {
          const versions = versionsResponse.data.allVersions || [];
          setModelVersions(versions);

          // Find the latest version
          if (versions.length > 0) {
            const latestVersion = versions.reduce((latest, version) =>
              version.version > latest.version ? version : latest, versions[0]);
            setCurrentVersion(latestVersion);

            // Load the latest version model
            await loadModelVersion(latestVersion);
          }
        }
      } catch (error) {
        console.error('Error fetching project data:', error);
        setError(error.response?.data?.message || 'Error fetching project data');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [projectId, backendUrl]);

  // Function to load a model version
  const loadModelVersion = async (version) => {
    if (!version || !version.modelUrl) return;

    try {
      setModelLoading(true);
      setModel(null);
      setModelParts([]);
      setOriginalModelParts([]);

      const loader = new GLTFLoader();
      await new Promise((resolve, reject) => {
        loader.load(
          version.modelUrl,
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
              materialIndices: Array.from(group.materialIndices),
              // Add properties to track for visualization and material impacts
              scale: { x: 1, y: 1, z: 1 },
              position: { x: 0, y: 0, z: 0 },
              rotation: { x: 0, y: 0, z: 0 },
              visible: true
            }));

            setModel(scene);
            setModelParts(parts);
            
            // Store a deep copy of the original model parts
            setOriginalModelParts(JSON.parse(JSON.stringify(parts)));
            
            resolve();
          },
          undefined,
          reject
        );
      });

      // Update current version in project details
      setProjectDetails(prev => ({
        ...prev,
        sloyd: version,
        currentVersion: version.version
      }));
      
      // Reset the updated materials when loading a new version
      setUpdatedMaterials(null);
      
      // Reset comparison state
      setIsComparingVersions(false);
      
    } catch (error) {
      console.error("🚨 Error loading model:", error);
      setError(`Error loading model: ${error.message}`);
    } finally {
      setModelLoading(false);
    }
  };

  // Version selection handler with comparison capability
  const handleVersionSelect = async (version, compare = false) => {
    setCurrentVersion(version);
    await loadModelVersion(version);
    
    // If compare flag is true, set comparison mode
    setIsComparingVersions(compare);
  };

  // Handle material updates from ModelChangeTracker
  const handleMaterialsChanged = (updatedMaterials) => {
    setUpdatedMaterials(updatedMaterials);
  };

  // Update part color with visualization option
  const updatePartColor = (partUuid, newColor) => {
    if (!model || !partUuid) return;

    const part = modelParts.find(p => p.meshUuid === partUuid);
    if (!part) return;

    // Store previous state for undo/redo
    const previousState = new Map();
    previousState.set(partUuid, {
      color: part.currentColor,
      material: part.meshes.map(({ uuid, materialIndex }) => {
        const mesh = model.getObjectByProperty('uuid', uuid);
        if (!mesh) return null;
        return {
          uuid,
          materialIndex,
          color: Array.isArray(mesh.material) 
            ? (materialIndex !== undefined ? mesh.material[materialIndex].color.getHex() : null)
            : mesh.material.color.getHex()
        };
      }).filter(Boolean)
    });

    // Immediately update the modelParts state
    setModelParts(prevParts =>
      prevParts.map(p =>
        p.meshUuid === partUuid
          ? { ...p, currentColor: newColor }
          : p
      )
    );

    // Update the actual mesh materials with the new color
    part.meshes.forEach(({ uuid, materialIndex }) => {
      const mesh = model.getObjectByProperty('uuid', uuid);
      if (!mesh) return;

      if (Array.isArray(mesh.material)) {
        if (materialIndex !== undefined && mesh.material[materialIndex]) {
          mesh.material[materialIndex] = mesh.material[materialIndex].clone();
          mesh.material[materialIndex].color.set(newColor);
          mesh.material[materialIndex].needsUpdate = true;
        }
      } else {
        mesh.material = mesh.material.clone();
        mesh.material.color.set(newColor);
        mesh.material.needsUpdate = true;
      }
    });

    // Add to history for undo/redo
    setMaterialHistory(prev => {
      const newHistory = prev.slice(0, currentHistoryIndex + 1);
      return [...newHistory, {
        type: 'color-change',
        partUuid,
        newColor,
        previousState
      }];
    });
    setCurrentHistoryIndex(prev => prev + 1);

    // Update material history for tracking changes
    handleMaterialChange({
      color: newColor
    });
  };

  // Reset all colors
  const resetAllColors = () => {
    if (!model) return;

    // Store previous state for undo/redo
    const previousState = new Map();
    modelParts.forEach(part => {
      previousState.set(part.meshUuid, {
        color: part.currentColor,
        material: part.meshes.map(({ uuid, materialIndex }) => {
          const mesh = model.getObjectByProperty('uuid', uuid);
          if (!mesh) return null;
          return {
            uuid,
            materialIndex,
            color: Array.isArray(mesh.material) 
              ? (materialIndex !== undefined ? mesh.material[materialIndex].color.getHex() : null)
              : mesh.material.color.getHex()
          };
        }).filter(Boolean)
      });
    });

    // Update modelParts state
    setModelParts(prevParts =>
      prevParts.map(part => ({
        ...part,
        currentColor: part.originalColor
      }))
    );

    // Reset mesh materials
    modelParts.forEach(part => {
      part.meshes.forEach(({ uuid, materialIndex }) => {
        const mesh = model.getObjectByProperty('uuid', uuid);
        if (!mesh) return;

        if (Array.isArray(mesh.material)) {
          if (materialIndex !== undefined && mesh.material[materialIndex]) {
            mesh.material[materialIndex] = mesh.material[materialIndex].clone();
            mesh.material[materialIndex].color.set(part.originalColor);
            mesh.material[materialIndex].needsUpdate = true;
          }
        } else {
          mesh.material = mesh.material.clone();
          mesh.material.color.set(part.originalColor);
          mesh.material.needsUpdate = true;
        }
      });
    });

    // Add to history for undo/redo
    setMaterialHistory(prev => {
      const newHistory = prev.slice(0, currentHistoryIndex + 1);
      return [...newHistory, {
        type: 'reset-colors',
        previousState
      }];
    });
    setCurrentHistoryIndex(prev => prev + 1);
  };

  // Handle material changes and store history for undo/redo
  const handleMaterialChange = (changes) => {
    if (!model || selectedParts.size === 0) return;

    // Store the current state for undo
    const previousStates = new Map();

    // Apply changes to selected parts
    selectedParts.forEach(partUuid => {
      const part = modelParts.find(p => p.meshUuid === partUuid);
      if (!part) return;

      // Store original values for this part before changes
      const originalValues = {
        material: { ...part.currentMaterial },
        color: part.currentColor,
      };
      previousStates.set(partUuid, originalValues);

      // Apply changes to each mesh in the part
      part.meshes.forEach(({ uuid, materialIndex }) => {
        model.traverse((obj) => {
          if (obj.isMesh && obj.uuid === uuid) {
            // Handle material properties like roughness, metalness, opacity
            if (Array.isArray(obj.material)) {
              if (materialIndex !== undefined && obj.material[materialIndex]) {
                Object.entries(changes).forEach(([key, value]) => {
                  if (key === 'color') {
                    obj.material[materialIndex].color.set(value);
                  } else if (key in obj.material[materialIndex]) {
                    obj.material[materialIndex][key] = value;
                    obj.material[materialIndex].needsUpdate = true;
                  }
                });
              }
            } else if (obj.material) {
              Object.entries(changes).forEach(([key, value]) => {
                if (key === 'color') {
                  obj.material.color.set(value);
                } else if (key in obj.material) {
                  obj.material[key] = value;
                  obj.material.needsUpdate = true;
                }
              });
            }
          }
        });
      });

      // Update the model parts state
      setModelParts(parts => 
        parts.map(p => {
          if (p.meshUuid === partUuid) {
            return {
              ...p,
              currentMaterial: {
                ...p.currentMaterial,
                ...Object.fromEntries(
                  Object.entries(changes).filter(([key]) => key !== 'color')
                ),
              },
              currentColor: changes.color || p.currentColor,
            };
          }
          return p;
        })
      );
    });

    // Add to history
    setMaterialHistory(prev => {
      const newHistory = prev.slice(0, currentHistoryIndex + 1);
      return [...newHistory, {
        type: 'material-change',
        changes,
        previousStates,
        selectedParts: new Set(selectedParts)
      }];
    });
    setCurrentHistoryIndex(prev => prev + 1);
  };

  // Undo material change
  const undoMaterialChange = () => {
    if (currentHistoryIndex < 0) return;

    const lastAction = materialHistory[currentHistoryIndex];
    
    if (lastAction.type === 'material-change') {
      // Restore previous material states
      lastAction.previousStates.forEach((originalValues, partUuid) => {
        const part = modelParts.find(p => p.meshUuid === partUuid);
        if (!part) return;

        // Restore original material and color
        part.meshes.forEach(({ uuid, materialIndex }) => {
          model.traverse((obj) => {
            if (obj.isMesh && obj.uuid === uuid) {
              if (Array.isArray(obj.material)) {
                if (materialIndex !== undefined && obj.material[materialIndex]) {
                  obj.material[materialIndex].color.set(originalValues.color);
                  Object.entries(originalValues.material).forEach(([key, value]) => {
                    if (key in obj.material[materialIndex]) {
                      obj.material[materialIndex][key] = value;
                    }
                  });
                  obj.material[materialIndex].needsUpdate = true;
                }
              } else if (obj.material) {
                obj.material.color.set(originalValues.color);
                Object.entries(originalValues.material).forEach(([key, value]) => {
                  if (key in obj.material) {
                    obj.material[key] = value;
                  }
                });
                obj.material.needsUpdate = true;
              }
            }
          });
        });
      });

      // Update modelParts state to reflect the undone changes
      setModelParts(parts =>
        parts.map(part => {
          if (lastAction.previousStates.has(part.meshUuid)) {
            const originalValues = lastAction.previousStates.get(part.meshUuid);
            return {
              ...part,
              currentMaterial: originalValues.material,
              currentColor: originalValues.color
            };
          }
          return part;
        })
      );
    } else if (lastAction.type === 'delete') {
      // Restore deleted parts
      lastAction.partsData.parts.forEach(deletedPart => {
        // Restore each mesh in the part to the scene
        deletedPart.meshes.forEach(({ uuid }) => {
          const meshState = lastAction.partsData.meshStates.get(uuid);
          if (meshState && meshState.parent) {
            const mesh = meshState.mesh;
            meshState.parent.add(mesh);
          }
        });
      });

      // Add deleted parts back to modelParts
      setModelParts(prev => [...prev, ...lastAction.partsData.parts]);
    } else if (lastAction.type === 'reset-transforms') {
      // Restore previous transforms
      lastAction.previousStates.forEach((transforms, uuid) => {
        model.traverse((obj) => {
          if (obj.uuid === uuid) {
            obj.position.copy(transforms.position);
            obj.rotation.copy(transforms.rotation);
            obj.scale.copy(transforms.scale);
          }
        });
      });

      // Update modelParts state to reflect the undone transforms
      setModelParts(parts =>
        parts.map(part => {
          if (part.meshes.some(mesh => lastAction.previousStates.has(mesh.uuid))) {
            // Find mesh with stored transforms to restore part state
            const mesh = part.meshes.find(m => lastAction.previousStates.has(m.uuid));
            if (mesh) {
              const transforms = lastAction.previousStates.get(mesh.uuid);
              return {
                ...part,
                position: {
                  x: transforms.position.x,
                  y: transforms.position.y,
                  z: transforms.position.z
                },
                rotation: {
                  x: transforms.rotation.x,
                  y: transforms.rotation.y,
                  z: transforms.rotation.z
                },
                scale: {
                  x: transforms.scale.x,
                  y: transforms.scale.y,
                  z: transforms.scale.z
                }
              };
            }
          }
          return part;
        })
      );
    }

    // Decrement history index
    setCurrentHistoryIndex(prev => prev - 1);
  };

  // Redo material change
  const redoMaterialChange = () => {
    if (currentHistoryIndex >= materialHistory.length - 1) return;

    // Move forward in history
    const actionToRedo = materialHistory[currentHistoryIndex + 1];
    
    if (actionToRedo.type === 'material-change') {
      // Apply the changes that were undone
      actionToRedo.selectedParts.forEach(partUuid => {
        const part = modelParts.find(p => p.meshUuid === partUuid);
        if (!part) return;

        // Apply changes to each mesh in the part
        part.meshes.forEach(({ uuid, materialIndex }) => {
          model.traverse((obj) => {
            if (obj.isMesh && obj.uuid === uuid) {
              if (Array.isArray(obj.material)) {
                if (materialIndex !== undefined && obj.material[materialIndex]) {
                  Object.entries(actionToRedo.changes).forEach(([key, value]) => {
                    if (key === 'color') {
                      obj.material[materialIndex].color.set(value);
                    } else if (key in obj.material[materialIndex]) {
                      obj.material[materialIndex][key] = value;
                    }
                  });
                  obj.material[materialIndex].needsUpdate = true;
                }
              } else if (obj.material) {
                Object.entries(actionToRedo.changes).forEach(([key, value]) => {
                  if (key === 'color') {
                    obj.material.color.set(value);
                  } else if (key in obj.material) {
                    obj.material[key] = value;
                  }
                });
                obj.material.needsUpdate = true;
              }
            }
          });
        });
      });

      // Update modelParts state with redone changes
      setModelParts(parts =>
        parts.map(part => {
          if (actionToRedo.selectedParts.has(part.meshUuid)) {
            return {
              ...part,
              currentMaterial: {
                ...part.currentMaterial,
                ...Object.fromEntries(
                  Object.entries(actionToRedo.changes).filter(([key]) => key !== 'color')
                ),
              },
              currentColor: actionToRedo.changes.color || part.currentColor,
            };
          }
          return part;
        })
      );
    } else if (actionToRedo.type === 'delete') {
      // Re-delete the parts
      actionToRedo.selectedParts.forEach(partUuid => {
        const part = modelParts.find(p => p.meshUuid === partUuid);
        if (part) {
          part.meshes.forEach(({ uuid }) => {
            model.traverse((obj) => {
              if (obj.uuid === uuid && obj.parent) {
                obj.parent.remove(obj);
              }
            });
          });
        }
      });

      // Update modelParts state to remove the deleted parts
      setModelParts(prev => 
        prev.filter(part => !actionToRedo.selectedParts.has(part.meshUuid))
      );
    } else if (actionToRedo.type === 'reset-transforms') {
      // Reset transforms again - all to default values
      actionToRedo.selectedParts.forEach(partUuid => {
        const part = modelParts.find(p => p.meshUuid === partUuid);
        if (part) {
          part.meshes.forEach(({ uuid }) => {
            model.traverse((obj) => {
              if (obj.uuid === uuid) {
                obj.position.set(0, 0, 0);
                obj.rotation.set(0, 0, 0);
                obj.scale.set(1, 1, 1);
              }
            });
          });
        }
      });

      // Update modelParts state with reset transforms
      setModelParts(parts =>
        parts.map(part => {
          if (actionToRedo.selectedParts.has(part.meshUuid)) {
            return {
              ...part,
              position: { x: 0, y: 0, z: 0 },
              rotation: { x: 0, y: 0, z: 0 },
              scale: { x: 1, y: 1, z: 1 }
            };
          }
          return part;
        })
      );
    }

    // Increment history index
    setCurrentHistoryIndex(prev => prev + 1);
  };

  const handleTransformChange = (type, axis, value) => {
    if (!model || selectedParts.size === 0) return;

    selectedParts.forEach(partUuid => {
      const part = modelParts.find(p => p.meshUuid === partUuid);
      if (part) {
        part.meshes.forEach(({ uuid }) => {
          model.traverse((obj) => {
            if (obj.isMesh && obj.uuid === uuid) {
              if (type === 'position') {
                obj.position[axis] = value;
                // Update the modelParts state to track position changes
                setModelParts(parts =>
                  parts.map(p =>
                    p.meshUuid === partUuid
                      ? {
                          ...p,
                          position: {
                            ...p.position,
                            [axis]: value
                          }
                        }
                      : p
                  )
                );
              }
              if (type === 'rotation') {
                obj.rotation[axis] = THREE.MathUtils.degToRad(value);
                // Update the modelParts state to track rotation changes
                setModelParts(parts =>
                  parts.map(p =>
                    p.meshUuid === partUuid
                      ? {
                          ...p,
                          rotation: {
                            ...p.rotation,
                            [axis]: value
                          }
                        }
                      : p
                  )
                );
              }
              if (type === 'scale') {
                obj.scale[axis] = value;
                // Update the modelParts state to track scale changes
                setModelParts(parts =>
                  parts.map(p =>
                    p.meshUuid === partUuid
                      ? {
                          ...p,
                          scale: {
                            ...p.scale,
                            [axis]: value
                          }
                        }
                      : p
                  )
                );
              }
            }
          });
        });
      }
    });
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

  // Add save function with material updates
  const handleSaveModel = async () => {
    if (!model || isSaving) return;

    setIsSaving(true);
    try {
      // Create a FormData instance to send the model and materials
      const formData = new FormData();
      
      // Add project ID
      formData.append('projectId', projectId);

      // Add description
      formData.append('description', 'Updated model materials and colors');

      // Add updated materials if there are changes
      if (updatedMaterials) {
        formData.append('updatedMaterials', JSON.stringify(updatedMaterials));
      }

      // Use GLTFExporter with binary option to get a proper GLB file
      const modelData = await new Promise((resolve, reject) => {
        try {
          const exporter = new GLTFExporter();
          exporter.parse(
            model,
            (buffer) => {
              // When binary option is true, we get an ArrayBuffer directly
              const blob = new Blob([buffer], { type: 'application/octet-stream' });
              resolve(blob);
            },
            (error) => {
              reject(error);
            },
            { binary: true } // Export as binary GLB format
          );
        } catch (error) {
          reject(error);
        }
      });
      
      // Ensure the file has the correct extension
      formData.append('model', modelData, 'model.glb');

      // Fix the API endpoint to match the backend route structure
      const response = await fetch(`${backendUrl}/api/project/save-model`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save model');
      }

      // Update project details with the new data
      if (result.updatedMaterials) {
        setProjectDetails(prevDetails => ({
          ...prevDetails,
          materials: result.updatedMaterials,
          totalCost: result.updatedMaterials.reduce((sum, mat) => sum + mat.totalPrice, 0)
        }));
      }

      // Clear the updates since they're now saved
      setUpdatedMaterials(null);
      
      // Set the new version
      if (result.newVersion) {
        setCurrentVersion(result.newVersion);
        setModelVersions(prev => [...prev, result.newVersion]);
      }

      // Show success notification
      // alert('Model saved successfully');
    } catch (error) {
      console.error('Error saving model:', error);
      
      // Add a fallback here - if online saving fails, save locally
      try {
        // If the model save fails, create a local version for the user
        const modelJSON = await new Promise((resolve, reject) => {
          const exporter = new GLTFExporter();
          exporter.parse(model, resolve, reject, { binary: false }); // Use JSON format for local storage
        });
        
        // Store model data in localStorage (for demo/fallback purposes)
        localStorage.setItem(`model_${projectId}_backup`, JSON.stringify({
          modelData: modelJSON,
          materials: updatedMaterials,
          timestamp: new Date().toISOString()
        }));
        
        alert('Failed to save to server, but created a local backup. ' + error.message);
      } catch (fallbackError) {
        alert('Failed to save model: ' + error.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0, display: 'flex' }}>
      {/* Show loading animation while model is loading */}
      {(loading || modelLoading) && <ProjectLoadingAnimation />}

      {/* 3D viewer area*/}
      <div className="w-4/5" style={{ position: 'relative' }}>
        {/* Back Button and Save Button */}
        <ProjectToolbar 
          isSaving={isSaving} 
          modelLoading={modelLoading} 
          onSave={handleSaveModel}
        />

        {/* Version info indicator */}
        <VersionInfo currentVersion={currentVersion} />

        {/* Keyboard Shortcuts Help */}
        <ProjectShortcuts />

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

          <CustomGrid />

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
        
        {/* Model Changes Overlay */}
        {originalModelParts.length > 0 && modelParts.length > 0 && (
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '300px', zIndex: 10 }}>
            <ProjectModelChangeTracker
              modelParts={modelParts}
              originalModelParts={originalModelParts}
              projectDetails={projectDetails}
              onMaterialsChanged={handleMaterialsChanged}
              isComparingVersions={isComparingVersions}
            />
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="w-1/5">
        <ProjectSidebar
          projectDetails={projectDetails}
          loading={loading}
          error={error}
          modelParts={modelParts}
          selectedParts={selectedParts}
          setSelectedParts={setSelectedParts}
          updatePartColor={updatePartColor}
          resetAllColors={resetAllColors}
          onTransformChange={handleTransformChange}
          onMaterialChange={handleMaterialChange}
          onResetTransforms={resetTransforms}
          onDeleteParts={deleteSelectedParts}
          canUndo={currentHistoryIndex >= 0}
          canRedo={currentHistoryIndex < materialHistory.length - 1}
          onUndo={undoMaterialChange}
          onRedo={redoMaterialChange}
          onTogglePartVisibility={handleTogglePartVisibility}
          modelVersions={modelVersions}
          currentVersion={currentVersion?.version}
          onVersionSelect={handleVersionSelect}
          updatedMaterials={updatedMaterials}
        />
      </div>
    </div>
  );
};

export default ProjectViewer;
