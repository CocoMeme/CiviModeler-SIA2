import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaSignOutAlt, FaUserCheck  } from 'react-icons/fa';
import { FaCircleUser } from "react-icons/fa6";
import { PiUserCircleCheckFill } from "react-icons/pi";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {userData, backendUrl, setUserData, setISLoggedin} = useContext(AppContext);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    // Implement logout functionality here
    setUserData(null);
    setISLoggedin(false);
  };

  return (
    <header className="absolute top-0 left-0 w-full px-4 py-6 bg-primary">
      <nav className="flex justify-between items-center max-w-screen-2xl mx-auto">
        {/* Left side */}
        <div className="flex items-center md:gap-16 gap-4">
          <div className="flex items-center">
            <div>
              <Link to="/">
                <img src="/images/CiviModeler - White.png" alt="Logo" className="size-8" />
              </Link>
            </div>
            <div>
              <Link to="/">
                <h3 className="font-bold text-gradient">CIVIMODELER</h3>
              </Link>
            </div>
          </div>
        </div>

        {/* Center */}
        <div className="w-2/5 text-white">
          <ul className="flex md:gap-10 text-md text-center font-light">
            <Link to="/docs">
              <li className="nav-item">Docs</li>
            </Link>
            <Link to="/testimony">
              <li className="nav-item">Testimony</li>
            </Link>
            <Link to="/projects">
              <li className="nav-item">Projects</li>
            </Link>
            <Link to="/about-us">
              <li className="nav-item">About Us</li>
            </Link>
          </ul>
        </div>

        {/* Right side */}
        <div className="relative flex items-center md:space-x-3 space-x-2">
          {userData && userData.name ? (
            <div className="relative">
              <div 
                className="bg-white text-[#592a78] font-semibold py-2 px-4 rounded-full flex items-center justify-center w-10 h-10 cursor-pointer"
                onClick={toggleDropdown}
              >
                {userData.name.charAt(0).toUpperCase()}
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                  <Link to="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <FaCircleUser className="mr-4" /> Profile
                  </Link>
                  <Link to="/verify-email" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <FaUserCheck  className="mr-4" /> Verify Email
                  </Link>
                  <div 
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="mr-4" /> Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <ul className="flex md:gap-10 text-md text-center font-light">
                <Link to="/docs">
                  <li className="nav-item">Sign Up</li>
                </Link>
              </ul>
              <Link to="/register">
                <button className="bg-white text-[#592a78] font-light py-2 px-4 rounded focus:outline-none hover:bg-gray-200 transition-all duration-200 ml-4">
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;