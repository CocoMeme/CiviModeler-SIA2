import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBuilding, FaRoad, FaPlus } from 'react-icons/fa';

const CreateDesign = () => {
  const designOptions = [
    {
      title: 'New Residential Project',
      icon: <FaHome className="text-3xl mb-2" />,
      description: 'Create a new residential building design',
      path: '/user/project-detail?type=residential',
      bgColor: 'bg-gradient-to-r from-blue-500 to-blue-600',
    },
    {
      title: 'New Commercial Project',
      icon: <FaBuilding className="text-3xl mb-2" />,
      description: 'Create a new commercial building design',
      path: '/user/project-detail?type=commercial',
      bgColor: 'bg-gradient-to-r from-purple-500 to-purple-600',
    },
    {
      title: 'New Infrastructure Project',
      icon: <FaRoad className="text-3xl mb-2" />,
      description: 'Create a new infrastructure design',
      path: '/user/project-detail?type=infrastructure',
      bgColor: 'bg-gradient-to-r from-green-500 to-green-600',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Create New Design</h2>
        <Link 
          to="/user/project-detail" 
          className="bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center"
          title="Create Custom Project"
        >
          <FaPlus size={18} />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {designOptions.map((option, index) => (
          <Link 
            to={option.path} 
            key={index}
            className={`${option.bgColor} text-white rounded-lg p-5 transition-all duration-300 hover:shadow-lg hover:scale-105`}
          >
            {option.icon}
            <h3 className="font-bold text-lg mb-1">{option.title}</h3>
            <p className="text-white/80 text-sm">{option.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CreateDesign;