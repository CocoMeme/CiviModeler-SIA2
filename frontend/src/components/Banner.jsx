import React from 'react';
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <div className="relative flex flex-col md:flex-row px-40 justify-start items-center h-[100vh] bg-cover bg-center" style={{ backgroundImage: "url('../public/images/Home background.png')" }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>
      
      {/* Content */}
      <div className="relative z-10 md:w-1/2 w-full space-y-8 px-4">
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
            <h1 className="font-extrabold text-s mb-0 text-white">
                CIVIMODELER
            </h1>
          </div>
        </div>

        <div className="ml-6">
          <h2 className="md:text-6xl text-6xl font-semibold mb-7 text-white">
          Let’s make your budget come to life.
          </h2>
          <h3 className="mb-5 text-2xl text-gray-300">
          Your future home tailored to your financial plan.
          </h3>
          <p className="mb-10 text-xl text-white">
            <span className="font-semibold text-white">CiviModeler</span> provides advanced tools for engineers and project managers, combining data-driven insights with user-friendly interfaces to optimize project planning and execution. Experience seamless integration of technology and engineering expertise.
          </p>
          <div className="flex gap-4">
            <Link to="/register">
              <button className="btn-special shadow-md px-6 py-3 rounded-md bg-blue-600 text-white transition duration-300 hover:bg-blue-700">
                Get a Quote!
              </button>
            </Link>
            <button className="btn-special shadow-md px-6 py-3 rounded-md bg-white text-blue-600 border border-blue-600 transition duration-300 hover:bg-blue-100 flex items-center gap-2">
              Learn More <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
