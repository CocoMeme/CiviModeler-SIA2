import React, { useContext, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Banner = () => {
  const { userData, isLoggedin, getUserData } = useContext(AppContext);

  useEffect(() => {
    if(isLoggedin && !userData) {
      getUserData();
    }
  }, [isLoggedin, userData, getUserData]);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-start min-h-screen bg-white px-52 pt-40">
        <div className="w-full md:w-1/2 max-w-3xl text-left space-y-9 px-6">
          <div className="flex items-center justify-center md:justify-start">
            <img
              src="/images/CiviModeler - NBG.png"
              alt="CiviModeler Logo"
              className="w-8 h-auto"
            />
            <h1 className="ml-2 font-extrabold text-lg text-black">CIVIMODELER</h1>
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold text-black leading-tight">
            Let’s make your budget come to life.
          </h2>
          <h3 className="text-2xl text-gray-700">
            Hey, { userData?.name ? userData.name + '!' : 'Guest!' } Your future home tailored to your financial plan.
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
        <div className="w-full md:w-2/3 flex justify-center items-center">
          <img
            src="/images/sci-fi-14149.gif"
            alt="Sci-Fi Visual"
            className="w-full h-auto"
          />
        </div>
      </div>
      <div className="w-full flex justify-center py-4 px-52">
        <img
          src="/project images/CiviModeler B1.png"
          alt="CiviModeler B1"
          className="w-full h-auto"
        />
      </div>
    </>
  );
};

export default Banner;
