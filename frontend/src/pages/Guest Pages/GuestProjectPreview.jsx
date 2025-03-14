import React, { useState, useEffect, useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { FiDownload } from 'react-icons/fi';
import { AppContext } from '../../context/AppContext';
import { CustomGrid, PlaceholderModel } from '../User Pages/Project Viewing Components/Project3DSceneHelpers';
import ProjectLoadingAnimation from '../User Pages/Project Viewing Components/ProjectLoadingAnimation';

const GuestProjectPreview = ({ project, onClose }) => {
  const { backendUrl } = useContext(AppContext);
  const [model, setModel] = useState(null);
  const [modelLoading, setModelLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load model when component mounts or project changes
  useEffect(() => {
    if (project?.sloyd?.modelUrl) {
      loadModel(project.sloyd.modelUrl);
    }
  }, [project]);

  const loadModel = async (modelUrl) => {
    if (!modelUrl) return;

    setModelLoading(true);
    setModel(null);

    try {
      const loader = new GLTFLoader();
      const gltf = await new Promise((resolve, reject) => {
        loader.load(modelUrl, resolve, undefined, reject);
      });

      setModel(gltf.scene);
    } catch (error) {
      console.error('Error loading model:', error);
      setError('Failed to load 3D model');
    } finally {
      setModelLoading(false);
    }
  };

  // Get the latest model URL from modelVersions or fall back to current sloyd model URL
  const getLatestModelUrl = () => {
    if (project.modelVersions && project.modelVersions.length > 0) {
      // Sort by version number and get the latest
      const sortedVersions = [...project.modelVersions].sort((a, b) => b.version - a.version);
      return sortedVersions[0].modelUrl;
    }
    return project?.sloyd?.modelUrl;
  };

  return (
    <div className="bg-gray-900 text-white h-full flex flex-col rounded-lg overflow-hidden">
      {/* Header with close button */}
      <div className="p-4 flex justify-between items-center border-b border-gray-800">
        <h2 className="text-xl font-semibold">{project.projectName}</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          ×
        </button>
      </div>

      <div className="flex-1 flex gap-6 p-6 overflow-y-auto">
        {/* Left side - 3D Viewer */}
        <div className="w-2/3 bg-gray-800 rounded-lg">
          {modelLoading && <ProjectLoadingAnimation />}
          <Canvas
            camera={{ position: [0, 2, 5], fov: 75 }}
            style={{ width: "100%", height: "100%" }}
            onCreated={({ gl }) => {
              gl.setClearColor(new THREE.Color(0x1a1a1a));
            }}
          >
            <ambientLight intensity={2} />
            <directionalLight position={[5, 10, 5]} intensity={2} />
            <OrbitControls enableDamping={true} />
            <CustomGrid />
            {model ? (
              <primitive object={model} />
            ) : (
              <PlaceholderModel />
            )}
          </Canvas>
        </div>

        {/* Right side - Project Details */}
        <div className="w-1/3 space-y-6 overflow-y-auto pr-2">
          {/* Basic Info */}
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Project Details</h3>
              {getLatestModelUrl() && (
                <a
                  href={getLatestModelUrl()}
                  download
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                  title="Download 3D Model"
                >
                  <FiDownload size={20} />
                </a>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Author</p>
                <p className="text-lg">{project.author}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Size</p>
                <p className="text-lg">{project.size} sqft</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Budget</p>
                <p className="text-lg">₱{project.budget?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Style</p>
                <p className="text-lg capitalize">{project.style}</p>
              </div>
            </div>
          </div>

          {/* Project Description */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-gray-300 leading-relaxed">
              {project.projectDescription || "No description available"}
            </p>
          </div>

          {/* Materials Section */}
          {project.materials && project.materials.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Materials</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[400px]">
                  <thead className="border-b border-gray-700">
                    <tr>
                      <th className="text-left py-2 text-gray-400">Material</th>
                      <th className="text-right py-2 text-gray-400">Qty</th>
                      <th className="text-right py-2 text-gray-400">Price</th>
                      <th className="text-right py-2 text-gray-400">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.materials.map((material, index) => (
                      <tr key={index} className="border-b border-gray-700/50">
                        <td className="py-2">{material.material}</td>
                        <td className="text-right py-2">{material.quantity}</td>
                        <td className="text-right py-2">₱{material.unitPrice?.toLocaleString()}</td>
                        <td className="text-right py-2">₱{material.totalPrice?.toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="font-semibold">
                      <td colSpan="3" className="py-2 text-right">Total Cost:</td>
                      <td className="py-2 text-right">₱{project.totalCost?.toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Model Version Info */}
          {project.sloyd && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Model Information</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-gray-400 text-sm">Version</p>
                  <p>{project.currentVersion || 1}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Confidence Score</p>
                  <p>{Math.round((project.sloyd.confidenceScore || 0) * 100)}%</p>
                </div>
                {project.sloyd.createdAt && (
                  <div>
                    <p className="text-gray-400 text-sm">Created</p>
                    <p>{new Date(project.sloyd.createdAt).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestProjectPreview;