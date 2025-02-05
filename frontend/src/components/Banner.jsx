import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="relative flex flex-col md:flex-row justify-start items-center h-[100vh] overflow-hidden bg-white">
      {/* Left Section - Textual Content */}
      <div className="relative z-10 md:w-1/2 w-full px-10 md:px-20 space-y-9 ml-24 s:ml-10">
        <div className="flex items-center mb-4">
          <img
            src="../../public/images/CiviModeler - NBG.png"
            alt="CiviModeler Logo"
            className="w-8 h-auto"
          />
          <h1 className="ml-4 font-extrabold text-lg text-black">CIVIMODELER</h1>
        </div>
        <h2 className="text-4xl md:text-6xl font-semibold text-black leading-tight">
          Let’s make your budget come to life.
        </h2>
        <h3 className="text-2xl text-gray-700">
          Your future home tailored to your financial plan.
        </h3>
        <p className="text-lg text-gray-600">
          <span className="font-semibold text-purple-500">CiviModeler</span>{" "}
          provides advanced tools for engineers and project managers, combining
          data-driven insights with user-friendly interfaces to optimize project
          planning and execution. Experience seamless integration of technology
          and engineering expertise.
        </p>
        <div className="flex gap-4">
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

      {/* Right Section - Visual Content */}
      <div className="relative md:w-1/2 w-full h-full">
        <img
          src="../../public/images/interactive-visual.png"
          alt="Interactive Visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Banner;
