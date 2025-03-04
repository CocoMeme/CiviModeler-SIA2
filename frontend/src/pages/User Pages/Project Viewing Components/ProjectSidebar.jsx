import React, { useState } from 'react';
import ProjectInfos from './ProjectInfos';
import ProjectColors from './ProjectColors';
import ProjectMaterialModify from './ProjectMaterialModify';
import ProjectPartsList from './ProjectPartsList';

const ProjectSidebar = ({
  projectDetails,
  loading,
  error,
  modelParts = [],
  selectedPart,
  setSelectedPart,
  updatePartColor,
  resetAllColors,
  onTransformChange,
  onMaterialChange,
  onResetTransforms,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onTogglePartVisibility
}) => {
  const [activeTab, setActiveTab] = useState('details'); // Change default tab to parts

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'parts', label: 'Parts' },
    { id: 'materials', label: 'Materials' },
    { id: 'colors', label: 'Colors' }
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

      {/* Undo/Redo Controls - Show in materials and parts tabs */}
      {(activeTab === 'materials' || activeTab === 'parts') && selectedPart && (
        <div className="flex justify-end mb-4 space-x-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`px-3 py-1 rounded text-sm flex items-center ${
              canUndo ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`px-3 py-1 rounded text-sm flex items-center ${
              canRedo ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Shift+Z)"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            Redo
          </button>
        </div>
      )}

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'parts' && (
          <ProjectPartsList
            modelParts={modelParts}
            selectedPart={selectedPart}
            onSelectPart={setSelectedPart}
            onToggleVisibility={onTogglePartVisibility}
          />
        )}
        
        {activeTab === 'materials' && selectedPart && (
          <ProjectMaterialModify
            selectedPart={selectedPart}
            onTransformChange={onTransformChange}
            onMaterialChange={onMaterialChange}
            onResetTransforms={onResetTransforms}
          />
        )}
        
        {activeTab === 'colors' && (
          <ProjectColors
            modelParts={modelParts}
            selectedPart={selectedPart}
            setSelectedPart={setSelectedPart}
            updatePartColor={updatePartColor}
            resetAllColors={resetAllColors}
          />
        )}
        
        {activeTab === 'details' && (
          <ProjectInfos
            projectDetails={projectDetails}
            loading={loading}
          />
        )}

        {/* No Selection Message */}
        {activeTab === 'materials' && !selectedPart && (
          <div className="text-center py-8 text-gray-400">
            <p>Select a part to modify its materials</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSidebar;