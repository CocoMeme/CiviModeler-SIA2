import React, { useState } from 'react';
import ProjectPartsSearch from './ProjectPartsSearch';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const ProjectPartsList = ({ 
  modelParts, 
  selectedParts,
  onSelectPart,
  onToggleVisibility 
}) => {
  const [filteredParts, setFilteredParts] = useState(modelParts);

  return (
    <div className="space-y-2">
      <ProjectPartsSearch 
        modelParts={modelParts} 
        onFilterChange={setFilteredParts} 
      />

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Model Parts</h3>
        <span className="text-sm text-gray-400">
          {filteredParts.length} of {modelParts.length} parts
        </span>
      </div>

      <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
        {filteredParts.map((part) => {
          const isSelected = selectedParts.has(part.meshUuid);
          return (
            <div
              key={part.meshUuid}
              className={`
                group flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer
                ${isSelected
                  ? 'bg-blue-500 bg-opacity-20 border border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                  : 'bg-gray-700 hover:bg-gray-600 border border-transparent'}
              `}
              onClick={(e) => onSelectPart(part, e)}
            >
              {/* Part info */}
              <div className="flex items-center space-x-3">
                {/* Selection indicator */}
                <div className={`w-1.5 h-1.5 rounded-full ${
                  isSelected 
                    ? 'bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8)]' 
                    : 'bg-gray-500'
                }`} />
                
                {/* Color preview with glow effect when selected */}
                <div 
                  className={`w-6 h-6 rounded border transition-shadow duration-200 ${
                    isSelected 
                      ? 'border-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' 
                      : 'border-gray-600'
                  }`}
                  style={{ 
                    backgroundColor: part.currentColor,
                    opacity: part.currentMaterial?.opacity || 1
                  }}
                />
                
                {/* Part name and material info */}
                <div>
                  <h4 className="font-medium capitalize">
                    {part.name.replace(/-/g, ' ')}
                  </h4>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <span>
                      {part.currentMaterial?.metalness > 0.5 ? 'Metallic' : 'Non-metallic'}
                    </span>
                    <span>•</span>
                    <span>
                      Roughness: {Math.round((part.currentMaterial?.roughness || 0) * 100)}%
                    </span>
                    {(part.currentMaterial?.opacity || 1) < 1 && (
                      <>
                        <span>•</span>
                        <span>
                          Opacity: {Math.round((part.currentMaterial?.opacity || 1) * 100)}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className={`flex items-center space-x-2 ${!isSelected && 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(part.meshUuid);
                  }}
                  className="p-1 hover:bg-gray-500 rounded"
                  title="Toggle Visibility"
                >
                  {part.visible !== false ? (
                    <FiEye size={16} />
                  ) : (
                    <FiEyeOff size={16} />
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {filteredParts.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No parts match your search criteria</p>
            <button
              onClick={() => setFilteredParts(modelParts)}
              className="text-blue-400 hover:text-blue-300 text-sm mt-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPartsList;