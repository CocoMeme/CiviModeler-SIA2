import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ModelGenerator = () => {
  const mountRef = useRef(null);
  const [models, setModels] = useState([]);

  useEffect(() => {
    const mount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050a1f);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Grid Helper
    const gridHelper = new THREE.GridHelper(20, 20, 0x1e90ff, 0x1e90ff);
    gridHelper.material.opacity = 0.5;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0x1e90ff, 2);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Load House Model
    const loader = new GLTFLoader();
    loader.load('/path/to/house/model.gltf', (gltf) => {
      const house = gltf.scene;
      house.position.set(0, 0, 0);
      scene.add(house);
      setModels([...models, house]);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      models.forEach(model => {
        model.rotation.y += 0.01;
      });
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      mount.removeChild(renderer.domElement);
    };
  }, [models]);

  return (
    <div>
      <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
    </div>
  );
};

export default ModelGenerator;