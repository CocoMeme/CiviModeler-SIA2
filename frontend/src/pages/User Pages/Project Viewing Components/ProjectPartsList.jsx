import React, { useState } from 'react';
import ProjectPartsSearch from './ProjectPartsSearch';

const ProjectPartsList = ({ 
  modelParts, 
  selectedPart, 
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
        {filteredParts.map((part) => (
          <div
            key={part.meshUuid}
            className={`
              group flex items-center justify-between p-3 rounded-lg transition-all duration-200 cursor-pointer
              ${selectedPart?.meshUuid === part.meshUuid 
                ? 'bg-blue-500 bg-opacity-20 border border-blue-500' 
                : 'bg-gray-700 hover:bg-gray-600 border border-transparent'}
            `}
            onClick={() => onSelectPart(part)}
          >
            {/* Part info */}
            <div className="flex items-center space-x-3">
              {/* Color preview */}
              <div 
                className="w-6 h-6 rounded border border-gray-600"
                style={{ 
                  backgroundColor: part.currentColor,
                  opacity: part.currentMaterial.opacity
                }}
              />
              
              {/* Part name and material info */}
              <div>
                <h4 className="font-medium capitalize">
                  {part.name.replace(/-/g, ' ')}
                </h4>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <span>
                    {part.currentMaterial.metalness > 0.5 ? 'Metallic' : 'Non-metallic'}
                  </span>
                  <span>•</span>
                  <span>
                    Roughness: {Math.round(part.currentMaterial.roughness * 100)}%
                  </span>
                  {part.currentMaterial.opacity < 1 && (
                    <>
                      <span>•</span>
                      <span>
                        Opacity: {Math.round(part.currentMaterial.opacity * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility(part.meshUuid);
                }}
                className="p-1 hover:bg-gray-500 rounded"
                title="Toggle Visibility"
              >
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d={part.visible ? (
                      "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    ) : (
                      "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    )}
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}

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