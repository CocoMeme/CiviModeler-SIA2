import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const EmailVerify = () => {
  const { userData } = useContext(AppContext);
  
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-300">
      <form className="bg-purple-800 p-8 rounded shadow-lg flex flex-col items-center max-w-md">
        {/* Logo and Initials */}
        <div className="mb-8 flex items-center">
          <img src="/images/CiviModeler - White.png" alt="Logo" className="w-24 h-auto z-10" />
          { userData && userData.name && (
            <div className="-ml-5 bg-slate-200 text-purple-800 text-xl font-semibold rounded-full w-16 h-16 flex items-center justify-center">
              {getUserInitials()}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold mb-4 text-white">Email Verification</h2>
        <p className="text-gray-200 mb-6 text-center px-4">
          Enter the 6-digit OTP sent to your registered email address to verify your account.
        </p>
        <div className="flex space-x-2">
          <input type="text" maxLength="1" className="w-12 h-12 text-center border border-gray-300 rounded" />
          <input type="text" maxLength="1" className="w-12 h-12 text-center border border-gray-300 rounded" />
          <input type="text" maxLength="1" className="w-12 h-12 text-center border border-gray-300 rounded" />
          <input type="text" maxLength="1" className="w-12 h-12 text-center border border-gray-300 rounded" />
          <input type="text" maxLength="1" className="w-12 h-12 text-center border border-gray-300 rounded" />
          <input type="text" maxLength="1" className="w-12 h-12 text-center border border-gray-300 rounded" />
        </div>
        <button 
          type="submit" 
          className="mt-6 bg-white text-purple-800 font-semibold py-2 px-6 rounded hover:bg-gray-200 transition-colors duration-200"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;