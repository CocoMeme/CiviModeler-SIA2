import React, { useState } from 'react';
import ProjectInfos from './ProjectInfos';
import ProjectColors from './ProjectColors';
import ProjectMaterialModify from './ProjectMaterialModify';

const ProjectSidebar = ({
  projectDetails,
  loading,
  error,
  modelParts = [],
  selectedPart,
  setSelectedPart,
  updatePartColor,
  resetAllColors
}) => {
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'colors', label: 'Colors' },
    { id: 'materials', label: 'Materials' }
  ];

  return (
    <div className="w-96 bg-gray-800 text-white p-6 overflow-y-auto">
      {/* Tabs */}
      <div className="flex mb-6 border-b border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 mr-2 ${
              activeTab === tab.id
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-300">
          {error}
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === 'details' && <ProjectInfos projectDetails={projectDetails} loading={loading} />}
      {activeTab === 'colors' && (
        <ProjectColors
          modelParts={modelParts}
          selectedPart={selectedPart}
          setSelectedPart={setSelectedPart}
          updatePartColor={updatePartColor}
          resetAllColors={resetAllColors}
        />
      )}
      {activeTab === 'materials' && <ProjectMaterialModify />}
    </div>
  );
};

export default ProjectSidebar;