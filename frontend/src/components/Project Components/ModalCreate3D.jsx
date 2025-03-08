import React from 'react';

const ModalCreate3D = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="bg-white p-4 shadow-lg rounded-lg border-l-4 border-yellow-500 mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-yellow-700 mb-1">
            No 3D Model Available
          </h3>
          <p className="text-gray-600">
            This project doesn't have a 3D model yet. Click the "Generate 3D Model" button 
            in the Project Configuration section to create one.
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default ModalCreate3D;