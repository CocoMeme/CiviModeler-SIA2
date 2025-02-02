import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaGoogle, FaArrowCircleRight } from "react-icons/fa";

const Login = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign-in
  };

  return (
    <div className="h-[100vh] flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="flex items-center justify-center mb-4">
          <img src="../../public/images/CiviModeler - NBG.png" alt="Logo" className="size-6 mr-1" />
          <h2 className="text-xl font-semibold">CiviModeler | Login</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email Address"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>

          <p className="align-baseline font-medium mt-4 text-sm text-center">
            Haven't an account?{" "}
            <Link to="/register" className="font-extrabold hover:text-green-500">
              Register
            </Link>{" "}
            here!
          </p>

          <div className="mt-4">
            <button
              type="submit"
              className='w-full flex flex-wrap gap-1 items-center justify-center bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-8 rounded focus:outline-none transition-all duration-200 cursor-pointer'
            >
              <FaArrowCircleRight />
              Login
            </button>
          </div>
        </form>

        <div className="flex items-center justify-center space-x-4 pt-3">
          <div className="border-t border-gray-400 w-24"></div>
          <span className="text-gray-400">or</span>
          <div className="border-t border-gray-400 w-24"></div>
        </div>

        {/* Google Sign-in */}
        <div className="mt-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex flex-wrap gap-1 items-center justify-center bg-green-700 text-white transition-all duration-200 cursor-pointer font-bold py-2 px-4 rounded focus:outline-none hover:bg-green-900"
          >
            <FaGoogle />
            Sign in with Google
          </button>
        </div>

        {/* Facebook Sign-in */}
        <div className="mt-4">
          <button
            className="w-full flex flex-wrap gap-1 items-center justify-center bg-blue-700 text-white transition-all duration-200 cursor-pointer font-bold py-2 px-4 rounded focus:outline-none hover:bg-blue-900"
          >
            <FaFacebook />
            Sign in with Facebook
          </button>
        </div>

        <p className="mt-5 text-center text-grey-500 text-xs">
          ©2025 CiviModeler. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;