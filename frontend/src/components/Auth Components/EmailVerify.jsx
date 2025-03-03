import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const EmailVerify = () => {

  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  const { userData, backendUrl, getUserData } = useContext(AppContext);
  const inputRefs = React.useRef([]);

  const handleInput = (e, i) => {
    const value = e.target.value;
    if (value) {
      if (i < 5) {
        inputRefs.current[i + 1].focus();
      }
    } else {
      if (i > 0) {
        inputRefs.current[i - 1].focus();
      }
    }
  };
  
  const getUserInitials = () => {
    const name = userData?.name?.trim() || "";
    if(name) {
      const words = name.split(" ");
      if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
      } else {
        return name.length >= 2 ? (name[0] + name[1]).toUpperCase() : name[0].toUpperCase();
      }
    }
    return "";
  };

  const inSubmitHandler = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value);
    const otp = otpArray.join("");
    
    // Validate OTP length
    if(otp.length !== 6) {
      toast.error("Please enter a complete 6-digit OTP");
      return;
    }
    console.log(otp);
    
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { userId: userData._id, otp });
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
        // Changed error message for incorrect OTP
        toast.error("Incorrect OTP. Please try again.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-300">
      <form onSubmit={inSubmitHandler}
      className="relative bg-purple-800 p-8 rounded shadow-lg flex flex-col items-center max-w-md">
        {/* Background Logo */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src="/images/CiviModeler - White.png" 
            alt="Background Logo" 
            className="opacity-10"
            style={{ 
              position: 'absolute', 
              left: '90px', // adjust horizontal offset
              top: '150px',  // adjust vertical offset
              width: '1200px' // adjust size freely
            }}
          />
        </div>
        {/* Logo and Initials */}
        <div className="mb-8 flex items-center z-10">
          <img src="/images/CiviModeler - White.png" alt="Logo" className="w-24 h-auto z-10" />
          { userData && userData.name && (
            <div className="-ml-5 bg-slate-200 text-purple-800 text-xl font-semibold rounded-full w-16 h-16 flex items-center justify-center">
              {getUserInitials()}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold mb-4 text-white z-10">Email Verification</h2>
        <p className="text-gray-200 mb-6 text-center px-4 z-10">
          Enter the 6-digit OTP sent to your registered email address to verify your account.
        </p>
        <div className="flex justify-between space-x-1 z-10">
          {Array(6).fill(0).map((_, index) => (
            <input 
              key={index}
              ref={e => inputRefs.current[index] = e}
              type="text" 
              maxLength="1" 
              className="w-12 h-12 text-2xl text-center bg-purple-200 text-purple-800 font-bold rounded"
              autoFocus={index === 0}
              onInput={e => {handleInput(e, index)}}

              
            />
          ))}
        </div>
        <button 
          type="submit" 
          className="mt-6 bg-white text-purple-800 font-semibold py-2 px-6 rounded hover:bg-gray-200 transition-colors duration-200 z-10"
        >
          Verify Email
        </button>
        <p className='text-slate-200 text-xs font-light mt-2 z-10'>Click to resend email</p>
      </form>
    </div>
  );
};

export default EmailVerify;