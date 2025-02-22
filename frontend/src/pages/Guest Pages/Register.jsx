import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle, FaArrowCircleRight } from "react-icons/fa";
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/register', {
        name: formData.name,
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

  const handleGoogleSignIn = () => {
    // Handle Google sign-in
  };

  return (
    <div className='h-[100vh] flex justify-center items-center'>
      <div className='w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
        <div className='flex items-center justify-center mb-4'>
          <img src="../../public/images/CiviModeler - NBG.png" alt="Logo" className='size-6 mr-1' />
          <h2 className='text-xl font-semibold'> CiviModeler | Register</h2>
        </div>

        <form onSubmit={handleRegister}>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="name">
              Full Name
            </label>
            <input
              type="text"
              id='name'
              placeholder='Full Name'
              className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id='email'
              placeholder='Email Address'
              className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id='password'
              placeholder='Password'
              className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <p className='align-baseline font-medium mt-4 text-sm text-center'>
            Already have an account? <Link to="/login" className='font-extrabold hover:text-green-500'>Login</Link> here!
          </p>

          <div className='mt-4'>
            <button
              type="submit"
              className='w-full flex flex-wrap gap-1 items-center justify-center bg-purple-700 hover:bg-purple-900 text-white font-bold py-2 px-8 rounded focus:outline-none transition-all duration-200 cursor-pointer'
            >
              <FaArrowCircleRight />
              Sign Up
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center space-x-4 pt-3">
          <div className="border-t border-gray-400 w-24"></div>
          <span className="text-gray-400">or</span>
          <div className="border-t border-gray-400 w-24"></div>
        </div>

        <div className='mt-4'>
          <button
            onClick={handleGoogleSignIn}
            className='w-full flex flex-wrap gap-1 items-center justify-center bg-green-700 text-white transition-all duration-200 cursor-pointer font-bold py-2 px-4 rounded focus:outline-none hover:bg-green-900'
          >
            <FaGoogle />
            Sign up with Google
          </button>
        </div>

        <p className='mt-5 text-center text-grey-500 text-xs'>
          ©2025 CiviModeler. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;