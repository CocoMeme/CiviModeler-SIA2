import React, { useState } from 'react';
import ProjectInfos from './ProjectInfos';
import ProjectColors from './ProjectColors';
import ProjectMaterialModify from './ProjectMaterialModify';
import ProjectPartsList from './ProjectPartsList';
import ProjectVersions from './ProjectVersions';

const ProjectSidebar = ({
  projectDetails,
  loading,
  error,
  modelParts = [],
  selectedParts = new Set(), // Add default value
  setSelectedParts,
  updatePartColor,
  resetAllColors,
  onTransformChange,
  onMaterialChange,
  onResetTransforms,
  onDeleteParts,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onTogglePartVisibility,
  modelVersions = [],
  currentVersion,
  onVersionSelect
}) => {
  const [activeTab, setActiveTab] = useState('parts'); // Change default tab to parts

  const tabs = [
    { id: 'parts', label: 'Parts' },
    { id: 'materials', label: 'Materials' },
    { id: 'colors', label: 'Colors' },
    { id: 'versions', label: 'Versions' },
    { id: 'details', label: 'Details' }
  ];

  return (
    <div className="w-96 bg-gray-800 text-white p-6 overflow-y-auto">
      {/* Selection Info */}
      {selectedParts.size > 0 && (
        <div className="mb-4 p-3 bg-blue-500 bg-opacity-20 border border-blue-500 rounded">
          <div className="flex justify-between items-center">
            <span>{selectedParts.size} part{selectedParts.size > 1 ? 's' : ''} selected</span>
            <button
              onClick={() => setSelectedParts(new Set())}
              className="text-sm text-blue-300 hover:text-blue-200"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Delete Button - Show when parts are selected */}
      {selectedParts.size > 0 && (
        <div className="mb-4">
          <button
            onClick={onDeleteParts}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete Selected {selectedParts.size > 1 ? 'Parts' : 'Part'}</span>
          </button>
        </div>
      )}

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
      {(activeTab === 'materials' || activeTab === 'parts') && (
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
            selectedParts={selectedParts}
            onSelectPart={(part, event) => {
              setSelectedParts(prev => {
                const next = new Set(prev);
                if (event?.ctrlKey || event?.metaKey) {
                  if (next.has(part.meshUuid)) {
                    next.delete(part.meshUuid);
                  } else {
                    next.add(part.meshUuid);
                  }
                } else {
                  next.clear();
                  next.add(part.meshUuid);
                }
                return next;
              });
            }}
            onToggleVisibility={onTogglePartVisibility}
          />
        )}
        
        {activeTab === 'materials' && selectedParts.size > 0 && (
          <ProjectMaterialModify
            selectedParts={selectedParts}
            onTransformChange={onTransformChange}
            onMaterialChange={onMaterialChange}
            onResetTransforms={onResetTransforms}
          />
        )}
        
        {activeTab === 'colors' && (
          <ProjectColors
            modelParts={modelParts}
            selectedParts={selectedParts}
            setSelectedParts={setSelectedParts}
            updatePartColor={updatePartColor}
            resetAllColors={resetAllColors}
          />
        )}
        
        {activeTab === 'versions' && (
          <ProjectVersions
            versions={modelVersions}
            currentVersion={currentVersion}
            onVersionSelect={onVersionSelect}
          />
        )}
        
        {activeTab === 'details' && (
          <ProjectInfos
            projectDetails={projectDetails}
            loading={loading}
          />
        )}

        {/* No Selection Message */}
        {activeTab === 'materials' && selectedParts.size === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>Select one or more parts to modify materials</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSidebar;