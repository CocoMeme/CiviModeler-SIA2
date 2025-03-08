import React, { useState, useEffect } from 'react';
import ProjectInfos from './ProjectInfos';
import ProjectColors from './ProjectColors';
import ProjectMaterialModify from './ProjectMaterialModify';
import ProjectVersions from './ProjectVersions';
import { FiX, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import { BiWrench, BiPalette, BiListUl, BiInfoCircle } from 'react-icons/bi';
import { TbArrowBackUp, TbArrowForwardUp } from 'react-icons/tb';
import { GrMoney } from 'react-icons/gr';

const ProjectSidebar = ({
  projectDetails,
  loading,
  error,
  modelParts = [],
  selectedParts = new Set(),
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
  onVersionSelect,
  isMobile = false,
  onCloseSidebar = null,
  updatedMaterials = null,
  showDifferences
}) => {
  const [activeTab, setActiveTab] = useState('materials');

  const tabs = [
    { id: 'materials', label: 'Materials', icon: <BiWrench size={20} /> },
    { id: 'colors', label: 'Colors', icon: <BiPalette size={20} /> },
    { id: 'versions', label: 'Versions', icon: <BiListUl size={20} /> },
    { id: 'details', label: 'Details', icon: <BiInfoCircle size={20} /> }
  ];

  // Add scrollbar style to hide scrollbars while maintaining functionality
  useEffect(() => {
    const scrollBarStyle = document.createElement('style');
    scrollBarStyle.innerHTML = `
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `;
    document.head.appendChild(scrollBarStyle);

    return () => {
      document.head.removeChild(scrollBarStyle);
    };
  }, []);

  return (
    <div className="bg-gray-800 text-white w-full h-full flex flex-col overflow-hidden">
      {/* Mobile close button */}
      {isMobile && onCloseSidebar && (
        <div className="p-2 flex justify-end">
          <button 
            onClick={onCloseSidebar}
            className="p-2 rounded-full hover:bg-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>
      )}

      {/* Header and Selection Info */}
      <div className="p-4 pb-0">
        {selectedParts.size > 0 && (
          <div className="mb-4 p-3 bg-blue-500 bg-opacity-20 border border-blue-500 rounded">
            <div className="flex justify-between items-center">
              <span>{selectedParts.size} part{selectedParts.size > 1 ? 's' : ''} selected</span>
              <button
                onClick={() => setSelectedParts(new Set())}
                className="text-sm text-blue-300 hover:text-blue-200"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Material Changes Alert - Show when materials have changed */}
        {updatedMaterials && (
          <div className="mb-4 p-3 bg-green-500 bg-opacity-20 border border-green-500 rounded">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <GrMoney className="mr-2 text-green-300" size={18} />
                <span className="text-green-300">Material estimates have changed</span>
              </div>
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
              <FiTrash2 size={18} />
              <span>Delete Selected {selectedParts.size > 1 ? 'Parts' : 'Part'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Improved Tab Navigation - Grid layout for remaining tabs */}
      <div className="px-4">
        <div className="grid grid-cols-4 gap-1 mb-4 border-b border-gray-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-2 transition-all ${
                activeTab === tab.id
                  ? 'text-blue-500 border-b-2 border-blue-500 -mb-[1px]'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              title={tab.label}
            >
              {tab.icon}
              <span className="text-xs mt-1 truncate">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-300">
            {error}
          </div>
        )}
        
        {/* Undo/Redo Controls */}
        {activeTab === 'materials' && (
          <div className="flex justify-end mb-4 space-x-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`px-3 py-1 rounded text-sm flex items-center ${
                canUndo ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <TbArrowBackUp className="mr-1" size={16} />
              <span className="hidden sm:inline">Undo</span>
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`px-3 py-1 rounded text-sm flex items-center ${
                canRedo ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Shift+Z)"
            >
              <TbArrowForwardUp className="mr-1" size={16} />
              <span className="hidden sm:inline">Redo</span>
            </button>
          </div>
        )}
      </div>

      {/* Tab Content - With fixed height and proper scrolling */}
      <div className="flex-1 px-4 pb-4 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-hide">
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
              updatedMaterials={updatedMaterials}
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
    </div>
  );
};

export default ProjectSidebar;