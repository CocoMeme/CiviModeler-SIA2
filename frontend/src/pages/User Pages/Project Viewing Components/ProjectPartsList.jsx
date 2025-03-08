import React, { useState, useEffect } from 'react';
import ProjectPartsSearch from './ProjectPartsSearch';
import { FiEye, FiEyeOff, FiPlus, FiEdit3 } from 'react-icons/fi';

const ProjectPartsList = ({ 
  modelParts, 
  selectedParts,
  onSelectPart,
  onToggleVisibility,
  showDifferences = false,
  originalModelParts = [] 
}) => {
  const [filteredParts, setFilteredParts] = useState(modelParts);
  const [partStatuses, setPartStatuses] = useState({});

  // Calculate part status (new, modified, deleted) when showing differences
  useEffect(() => {
    if (showDifferences && originalModelParts.length > 0) {
      const statuses = {};
      
      // Check for new and modified parts
      modelParts.forEach(part => {
        const originalPart = originalModelParts.find(op => op.meshUuid === part.meshUuid);
        
        if (!originalPart) {
          statuses[part.meshUuid] = 'new';
        } else {
          // Check if position, rotation, scale or material changed
          const posChanged = JSON.stringify(part.position) !== JSON.stringify(originalPart.position);
          const rotChanged = JSON.stringify(part.rotation) !== JSON.stringify(originalPart.rotation);
          const scaleChanged = JSON.stringify(part.scale) !== JSON.stringify(originalPart.scale);
          const matChanged = JSON.stringify(part.currentMaterial) !== JSON.stringify(originalPart.originalMaterial);
          const colorChanged = part.currentColor !== originalPart.originalColor;
          
          if (posChanged || rotChanged || scaleChanged || matChanged || colorChanged) {
            statuses[part.meshUuid] = 'modified';
          }
        }
      });
      
      // Check for deleted parts
      originalModelParts.forEach(originalPart => {
        if (!modelParts.find(p => p.meshUuid === originalPart.meshUuid)) {
          statuses[originalPart.meshUuid] = 'deleted';
        }
      });
      
      setPartStatuses(statuses);
    } else {
      setPartStatuses({});
    }
  }, [showDifferences, modelParts, originalModelParts]);

  // Update filtered parts on model changes
  useEffect(() => {
    setFilteredParts(modelParts);
  }, [modelParts]);

  // Get status indicator for a part
  const getStatusIndicator = (part) => {
    const status = partStatuses[part.meshUuid];
    
    if (!status || !showDifferences) return null;
    
    switch (status) {
      case 'new':
        return (
          <div className="ml-2 px-1.5 py-0.5 bg-green-900 bg-opacity-50 border border-green-500 rounded text-xs text-green-300 flex items-center">
            <FiPlus size={10} className="mr-1" /> New
          </div>
        );
      case 'modified':
        return (
          <div className="ml-2 px-1.5 py-0.5 bg-blue-900 bg-opacity-50 border border-blue-500 rounded text-xs text-blue-300 flex items-center">
            <FiEdit3 size={10} className="mr-1" /> Modified
          </div>
        );
      default:
        return null;
    }
  };

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
          const partStatus = showDifferences ? partStatuses[part.meshUuid] : null;
          
          // Style based on status
          let statusStyle = {};
          if (showDifferences) {
            switch (partStatus) {
              case 'new':
                statusStyle = {
                  boxShadow: '0 0 0 1px rgba(34, 197, 94, 0.5), 0 0 8px rgba(34, 197, 94, 0.5)',
                  borderColor: 'rgba(34, 197, 94, 0.5)'
                };
                break;
              case 'modified':
                statusStyle = {
                  boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.5), 0 0 8px rgba(59, 130, 246, 0.5)',
                  borderColor: 'rgba(59, 130, 246, 0.5)'
                };
                break;
              default:
                break;
            }
          }
          
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
              style={statusStyle}
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
                <div className="flex items-center">
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
                  {getStatusIndicator(part)}
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

        {showDifferences && originalModelParts.length > 0 && (
          // Show deleted parts when in comparison mode
          <>
            {originalModelParts
              .filter(op => !modelParts.find(p => p.meshUuid === op.meshUuid))
              .map(deletedPart => (
                <div
                  key={`deleted-${deletedPart.meshUuid}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-red-900 bg-opacity-20 border border-red-500"
                  style={{
                    boxShadow: '0 0 0 1px rgba(239, 68, 68, 0.5), 0 0 8px rgba(239, 68, 68, 0.5)',
                    opacity: 0.7,
                    textDecoration: 'line-through'
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <div 
                      className="w-6 h-6 rounded border border-red-600"
                      style={{ 
                        backgroundColor: deletedPart.originalColor,
                        opacity: 0.5
                      }}
                    />
                    <div className="flex items-center">
                      <div>
                        <h4 className="font-medium capitalize text-red-300">
                          {deletedPart.name.replace(/-/g, ' ')}
                        </h4>
                      </div>
                      <div className="ml-2 px-1.5 py-0.5 bg-red-900 bg-opacity-50 border border-red-500 rounded text-xs text-red-300">
                        Deleted
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </>
        )}

        {filteredParts.length === 0 && !showDifferences && (
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