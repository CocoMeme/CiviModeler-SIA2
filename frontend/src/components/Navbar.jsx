import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
        </div>
      </nav>
    </header>
  );
}

export default Navbar;