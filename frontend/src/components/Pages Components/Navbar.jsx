import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { FaSignOutAlt, FaUserCheck } from 'react-icons/fa';
import { FaCircleUser } from "react-icons/fa6";
import axios from 'axios';
import { RiDashboardFill } from "react-icons/ri";
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { userData ={}, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext);
  useEffect(() => {
    console.log("Navbar userData:", userData);
  }, [userData]);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp',{
        userId: userData._id
      });

      if (data.success) {
        navigate('/email-verify');
        toast.success('Verification OTP sent successfully');
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      if (data.success) {
        setUserData(null);
        setIsLoggedin(false);
        navigate('/');
        toast.success("Logged out successfully");
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'An error occurred during logout';
      toast.error(errorMsg);
    }
  };

  const getUserInitials = () => {
    const name = userData.name.trim();
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else {
      return name.length >= 2 ? (name[0] + name[1]).toUpperCase() : name[0].toUpperCase();
    }
  };

  return (
    <header className="absolute top-0 left-0 w-full h-20 px-4 py-4 bg-primary">
      <nav className="flex justify-between items-center max-w-screen-2xl mx-auto">
        {/* Left side */}
        <div className="flex items-center md:gap-16 gap-4">
          <div className="flex items-center">
            <Link to="/">
              <img src="/images/CiviModeler - White.png" alt="Logo" className="size-8" />
            </Link>
            <Link to="/">
              <h3 className="font-bold text-gradient">CIVIMODELER</h3>
            </Link>
          </div>
        </div>

        {/* Center */}
        <div className="w-2/5 text-white">
          <ul className="flex md:gap-10 text-md text-center font-light">
            <Link to="/docs"><li className="nav-item">Docs</li></Link>
            <Link to="/testimony"><li className="nav-item">Testimony</li></Link>
            <Link to="/projects"><li className="nav-item">Projects</li></Link>
            <Link to="/about-us"><li className="nav-item">About Us</li></Link>
          </ul>
        </div>

        {/* Right side */}
        <div className="relative flex items-center md:space-x-3 space-x-2">
          {userData && userData.name ? (
            <div className="relative">
              <div 
                className="group flex items-center bg-white text-[#592a78] font-semibold rounded-full cursor-pointer overflow-hidden transition-all duration-300 px-1 py-1 hover:scale-105"
                onClick={toggleDropdown}
              >
                <span className="flex text-sm items-center px-2 py-2 max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 group-hover:mr-1 -mr-4 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out">
                <RiDashboardFill className='mr-2'/> <Link to="/user/home">My Dashboard</Link> 
                </span>
                <span className="w-10 h-10 z-30 flex text-sm items-center justify-center">
                  {getUserInitials()}
                </span>
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                  <Link to="/profile" className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <FaCircleUser className="mr-4" /> Profile
                  </Link>
                  {userData?.isAccountVerified === false ? (
  userData?.verifyOtpExpireAt > Date.now() ? (
    <div className="flex items-center px-4 py-2 text-gray-400 cursor-not-allowed" title="OTP already sent, please wait">
      <FaUserCheck className="mr-4" /> OTP Sent
    </div>
  ) : (
    <Link onClick={sendVerificationOtp} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
      <FaUserCheck className="mr-4" /> Verify Email
    </Link>
  )
) : (
  <div className="flex items-center px-4 py-2 text-gray-400 cursor-not-allowed" title="Email already verified">
    <FaUserCheck className="mr-4" /> Verified
  </div>
)}

                  <div
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={logout}
                  >
                    <FaSignOutAlt className="mr-4" /> Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <ul className="flex md:gap-10 text-md text-center font-light">
                <Link to="/register"><li className="nav-item">Sign Up</li></Link>
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
};

export default Navbar;