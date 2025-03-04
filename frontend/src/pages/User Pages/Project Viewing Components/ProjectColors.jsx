import React from 'react';

const ProjectColors = ({ 
  modelParts = [], 
  selectedPart, 
  setSelectedPart, 
  updatePartColor,
  resetAllColors 
}) => {
  const presetColors = [
    '#808080', // Gray
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFFFFF', // White
  ];

  // Group parts by their base name
  const groupedParts = modelParts.reduce((acc, part) => {
    if (!acc[part.name]) {
      acc[part.name] = [];
    }
    acc[part.name].push(part);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {modelParts.length === 0 ? (
        <p className="text-gray-400">Loading model parts...</p>
      ) : (
        <>
          {/* Parts Selection */}
          <div className="mb-4 space-y-4">
            {Object.entries(groupedParts).map(([groupName, parts]) => (
              <div key={groupName} className="border-b border-gray-700 pb-2">
                <h4 className="text-sm font-medium text-gray-300 mb-2">{groupName}</h4>
                <div className="space-y-2">
                  {parts.map((part) => (
                    <button
                      key={part.meshUuid}
                      onClick={() => setSelectedPart(part)}
                      className={`w-full text-left p-2 rounded transition-colors ${
                        selectedPart?.meshUuid === part.meshUuid
                          ? 'bg-blue-600'
                          : 'hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">
                          {parts.length > 1 ? `Group ${parts.indexOf(part) + 1}` : 'Color'}
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

          {selectedPart && (
            <div className="space-y-4 mt-6">
              <div>
                <h4 className="text-sm font-medium mb-2">
                  Selected: {selectedPart.name}
                  {Object.keys(groupedParts[selectedPart.name]).length > 1 &&
                    ` (Group ${groupedParts[selectedPart.name].indexOf(selectedPart) + 1})`
                  }
                </h4>
                <input
                  type="color"
                  value={selectedPart.currentColor}
                  onChange={(e) => updatePartColor(selectedPart.meshUuid, e.target.value)}
                  className="w-full h-10 rounded cursor-pointer"
                />
              </div>

              {/* Preset Colors */}
              <div>
                <h4 className="text-sm font-medium mb-2">Preset Colors</h4>
                <div className="grid grid-cols-4 gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => updatePartColor(selectedPart.meshUuid, color)}
                      style={{
                        backgroundColor: color,
                        width: '100%',
                        height: '30px',
                        border: selectedPart.currentColor === color ? '2px solid white' : '1px solid gray',
                        borderRadius: '4px',
                      }}
                      aria-label={`Set color to ${color}`}
                    />
                  ))}
                </div>
              </div>

              {/* Reset Selected Part */}
              <button
                onClick={() => updatePartColor(selectedPart.meshUuid, selectedPart.originalColor)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-200"
              >
                Reset Part Color
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
        </>
      )}
    </div>
  );
};

export default ProjectColors;