import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaGoogle, FaArrowCircleRight } from "react-icons/fa";
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  // Update formData on input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Handle login submission logic similar to register
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
        navigate('/');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleGoogleSignIn = () => {}

  return (
    <div className="h-[100vh] flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="flex items-center justify-center mb-4">
          <img 
            src="../../public/images/CiviModeler - NBG.png" 
            alt="Logo" 
            className="size-6 mr-1" 
          />
          <h2 className="text-xl font-semibold">CiviModeler | Login</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email Address"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <p className="align-baseline font-medium text-sm text-center">
            Haven't an account?{" "}
            <Link to="/register" className="font-extrabold hover:text-green-500">
              Register
            </Link>{" "}
            here!
          </p>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full flex flex-wrap gap-1 items-center justify-center bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-8 rounded focus:outline-none transition-all duration-200 cursor-pointer"
            >
              <FaArrowCircleRight />
              Login
            </button>
          </div>
          <p onClick={()=>navigate('/reset-password')} className="align-baseline font-light text-xs from-neutral-500 to-neutral-700 text-right cursor-pointer mt-2 mr-2">
            Forgot Password?
          </p>
        </form>
        <div className="flex items-center justify-center space-x-4 pt-3">
          <div className="border-t border-gray-400 w-24"></div>
          <span className="text-gray-400">or</span>
          <div className="border-t border-gray-400 w-24"></div>
        </div>
        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex flex-wrap gap-1 items-center justify-center bg-green-700 text-white transition-all duration-200 cursor-pointer font-bold py-2 px-4 rounded focus:outline-none hover:bg-green-900"
          >
            <FaGoogle />
            Sign in with Google
          </button>
        </div>
        <div className="mt-4">
          <button
            className="w-full flex flex-wrap gap-1 items-center justify-center bg-blue-700 text-white transition-all duration-200 cursor-pointer font-bold py-2 px-4 rounded focus:outline-none hover:bg-blue-900"
          >
            <FaFacebook />
            Sign in with Facebook
          </button>
        </div>
        <p className="mt-5 text-center text-grey-500 text-xs">©2025 CiviModeler. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Login;