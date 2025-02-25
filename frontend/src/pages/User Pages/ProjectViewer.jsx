import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ProjectViewer = ({ projectId }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const fetchProject = async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      const project = await response.json();
      initThreeJS(project.sloyd.modelUrl);
    };

    const initThreeJS = (modelUrl) => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      const loader = new GLTFLoader();
      loader.load(modelUrl, (gltf) => {
        scene.add(gltf.scene);
        animate();
      });

      camera.position.z = 5;

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
    };

    fetchProject();

    return () => {
      while (mountRef.current.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
    };
  }, [projectId]);

  return <div ref={mountRef}></div>;
};

export default ProjectViewer;
