import React from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const ProjectLoadingAnimation = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-gray-800 rounded-lg p-8 shadow-xl flex flex-col items-center space-y-4">
        <AiOutlineLoading3Quarters className="w-16 h-16 text-blue-500 animate-spin" />
        <p className="text-white text-lg">Loading 3D Model...</p>
      </div>
    </div>
  );
};

export default ProjectLoadingAnimation;