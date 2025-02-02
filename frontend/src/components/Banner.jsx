import React from 'react';
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row px-40 justify-center items-center h-[100vh]">
      {/* Left Side: Content */}
      <div className="md:w-1/2 w-full space-y-8 px-4">
        <div className="flex items-center">
          <div className="ml-6 mr-1">
            <img
              src="../../public/images/CiviModeler - NBG.png"
              alt="CiviModeler Logo"
              style={{
                width: "30px",
                height: "auto",
              }}
            />
          </div>
          <div>
            <h1 className="font-extrabold text-s mb-0">
                CIVIMODELER
            </h1>
          </div>
        </div>

        <div className="ml-6">
          <h2 className="md:text-5xl text-2xl font-medium mb-7">
          A Tool for Budget-Based 3D Modeling and Material Estimation in Civil Engineering
          </h2>
          <h3 className="mb-5 text-lg text-gray-700">
            Revolutionize your civil engineering projects with precise budget-based 3D modeling and accurate material estimation.
          </h3>
          <p className="mb-10 text-base text-gray-600">
            <span className="font-semibold">CiviModeler</span> provides advanced tools for engineers and project managers, combining data-driven insights with user-friendly interfaces to optimize project planning and execution. Experience seamless integration of technology and engineering expertise.
          </p>
          <div className="flex gap-4">
            <Link to="/register">
              <button className="btn-special shadow-md px-6 py-3 rounded-md bg-blue-600 text-white transition duration-300 hover:bg-blue-700">
                Get Started!
              </button>
            </Link>
            <button className="btn-special shadow-md px-6 py-3 rounded-md bg-white text-blue-600 border border-blue-600 transition duration-300 hover:bg-blue-100 flex items-center gap-2">
              Learn More <FaArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="md:w-1/2 w-full flex justify-center items-center px-4">
        <img
          src="../../public/images/Home.png"
          alt="CiviModeler Platform Preview"
          className="w-1/2 h-auto object-cover"
        />
      </div>
    </div>
  );
};

export default Banner;
