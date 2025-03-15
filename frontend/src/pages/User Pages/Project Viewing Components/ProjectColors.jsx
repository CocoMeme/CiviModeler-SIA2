import React, { useState } from 'react';

const ProjectColors = ({
  modelParts = [],
  selectedParts = new Set(),
  setSelectedParts,
  updatePartColor,
  resetAllColors
}) => {
  // Track the currently active part for the color editor
  const [activePartId, setActivePartId] = useState(null);

  // Get the active part object
  const activePart = activePartId
    ? modelParts.find(p => p.meshUuid === activePartId)
    : (selectedParts.size === 1 ? modelParts.find(p => p.meshUuid === Array.from(selectedParts)[0]) : null);

  // Set active part when selection changes
  React.useEffect(() => {
    if (selectedParts.size === 1) {
      setActivePartId(Array.from(selectedParts)[0]);
    } else if (selectedParts.size === 0) {
      setActivePartId(null);
    }
  }, [selectedParts]);

  const presetColors = [
    '#808080', // Gray
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFFFFF', // White
    '#A0522D', // Sienna (brown)
    '#FFA500', // Orange
    '#800080', // Purple
    '#008080', // Teal
  ];

  // Group parts by their base name
  const groupedParts = modelParts.reduce((acc, part) => {
    const baseName = part.name.replace(/[_-]?\d+$/, ''); // Remove numbering
    if (!acc[baseName]) {
      acc[baseName] = [];
    }
    acc[baseName].push(part);
    return acc;
  }, {});

  // Apply color to single part
  const handleSinglePartColorChange = (partId, color) => {
    updatePartColor(partId, color);
  };

  // Apply color to all selected parts
  const handleMultiPartColorChange = (color) => {
    selectedParts.forEach(partId => {
      updatePartColor(partId, color);
    });
  };

  // Reset multiple parts to their original colors
  const resetSelectedPartsColors = () => {
    selectedParts.forEach(partId => {
      const part = modelParts.find(p => p.meshUuid === partId);
      if (part) {
        updatePartColor(partId, part.originalColor);
      }
    });
  };

  return (
    <div className="space-y-4">
      {modelParts.length === 0 ? (
        <p className="text-gray-400">Loading model parts...</p>
      ) : (
        <>
          {/* Selected Parts Counter */}
          {selectedParts.size > 0 && (
            <div className="p-2 bg-blue-500 bg-opacity-20 rounded mb-4">
              <span className="text-blue-300">
                {selectedParts.size === 1 ? '1 part selected' : `${selectedParts.size} parts selected`}
              </span>
            </div>
          )}

          {/* Color Editor for Selected Part(s) */}
          {selectedParts.size > 0 && (
            <div className="space-y-4 mt-6 bg-gray-700 bg-opacity-50 p-3 rounded">
              <div>
                <h4 className="text-sm font-medium mb-2">
                  {selectedParts.size === 1
                    ? `Selected Part: ${activePart?.name || ''}`
                    : `Apply color to ${selectedParts.size} selected parts`
                  }
                </h4>
                <input
                  type="color"
                  value={activePart?.currentColor || "#ffffff"}
                  onChange={(e) => {
                    if (selectedParts.size === 1) {
                      handleSinglePartColorChange(activePart.meshUuid, e.target.value);
                    } else {
                      handleMultiPartColorChange(e.target.value);
                    }
                  }}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              {/* Preset Colors */}
              <div>
                <h4 className="text-sm font-medium mb-2">Quick Colors</h4>
                <div className="grid grid-cols-4 gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        if (selectedParts.size === 1 && activePart) {
                          handleSinglePartColorChange(activePart.meshUuid, color);
                        } else {
                          handleMultiPartColorChange(color);
                        }
                      }}
                      style={{
                        backgroundColor: color,
                        width: '100%',
                        height: '30px',
                        border: activePart?.currentColor === color ? '2px solid white' : '1px solid gray',
                        borderRadius: '4px',
                      }}
                      aria-label={`Set color to ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Reset Selected Part(s) */}
              <button
                onClick={() => {
                  if (selectedParts.size === 1 && activePart) {
                    handleSinglePartColorChange(activePart.meshUuid, activePart.originalColor);
                  } else {
                    resetSelectedPartsColors();
                  }
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
              >
                Reset {selectedParts.size === 1 ? 'Part' : 'Parts'} to Original {selectedParts.size === 1 ? 'Color' : 'Colors'}
              </button>
            </div>
          )}
          {/* Reset All Colors Button */}
          {modelParts.length > 0 && (
            <button
              onClick={resetAllColors}
              className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-200"
            >
              Reset All Colors
            </button>
          )}



          {/* Parts List */}
          <div className="mb-4 space-y-4 max-h-fit overflow-y-auto pr-2">
            {Object.entries(groupedParts).map(([groupName, parts]) => (
              <div key={groupName} className="border-b border-gray-700 pb-2">
                <h4 className="text-sm font-medium text-gray-300 mb-2 capitalize">{groupName.replace(/-/g, ' ')}</h4>
                <div className="space-y-2">
                  {parts.map((part) => (
                    <button
                      key={part.meshUuid}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (e.ctrlKey || e.metaKey) {
                          // Multi-select mode
                          setSelectedParts(prev => {
                            const next = new Set(prev);
                            if (next.has(part.meshUuid)) {
                              next.delete(part.meshUuid);
                            } else {
                              next.add(part.meshUuid);
                            }
                            return next;
                          });
                        } else {
                          // Single-select mode
                          setSelectedParts(new Set([part.meshUuid]));
                          setActivePartId(part.meshUuid);
                        }
                      }}
                      className={`w-full text-left p-2 rounded transition-colors ${selectedParts.has(part.meshUuid)
                        ? 'bg-blue-600'
                        : 'hover:bg-gray-700'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {parts.length > 1 ? `${part.name} (${part.meshUuid.slice(0, 4)})` : part.name}
                        </span>
                        <div
                          className="w-6 h-6 rounded border border-gray-600"
                          style={{ backgroundColor: part.currentColor }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>




        </>
      )}
    </div>
  );
};

export default ProjectColors;