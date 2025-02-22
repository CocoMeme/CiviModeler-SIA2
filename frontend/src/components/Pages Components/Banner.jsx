import React, { useContext, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const Model = () => {
  const [model, setModel] = useState(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      "/images/Homepage.glb",
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
  }, []);

  return model ? <primitive object={model} scale={0.8} position={[0, -1, 0]} /> : null;
};

const Banner = () => {
  const { userData, isLoggedin, getUserData } = useContext(AppContext);

  useEffect(() => {
    if (isLoggedin && !userData) {
      getUserData();
    }
  }, [isLoggedin, userData, getUserData]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-white px-6 md:px-16 lg:px-24 py-10 space-y-10 md:space-y-0">
      {/* Left Content */}
      <div className="w-full md:w-1/2 max-w-3xl text-center md:text-left space-y-6 px-4 md:px-0">
        <div className="flex items-center justify-center md:justify-start">
          <img src="/images/CiviModeler - NBG.png" alt="CiviModeler Logo" className="w-8 h-auto" />
          <h1 className="ml-2 font-extrabold text-lg text-black">CIVIMODELER</h1>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-black leading-tight">
          Let’s make your budget come to life.
        </h2>
        <h3 className="text-xl md:text-2xl text-gray-700">
          Hey, {userData?.name ? userData.name + "!" : "Guest!"} Your future home tailored to your financial plan.
        </h3>
        <p className="text-lg text-gray-600">
          <span className="font-semibold text-purple-500">CiviModeler</span> provides advanced tools for engineers and project managers, combining data-driven insights with user-friendly interfaces to optimize project planning and execution. Experience seamless integration of technology and engineering expertise.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <Link to="/register">
            <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 transition duration-300">
              Get a Quote!
            </button>
          </Link>
          <button className="px-6 py-3 bg-white text-blue-600 border border-blue-600 font-semibold rounded-md shadow-md hover:bg-blue-100 flex items-center gap-2 transition duration-300">
            Learn More <FaArrowRight />
          </button>
        </div>
      </div>

      {/* 3D Model */}
      <div className="w-full md:w-1/2 h-[400px] sm:h-[500px] md:h-[600px] flex justify-center items-center">
        <Canvas shadows camera={{ position: [12, 3, -14], fov: 55 }} className="w-full h-full">
          <ambientLight intensity={0.8} />
          <directionalLight castShadow position={[5, 5, 5]} intensity={1.5} />
          <Model />
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default Banner;
