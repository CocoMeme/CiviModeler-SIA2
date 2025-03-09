import React, { useState, useEffect } from 'react';

const MaterialPropertyControl = ({ label, value, onChange, presets, property }) => {
  return (
    <div className="mb-6 relative group">
      <div className="flex justify-between mb-1">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <div className="flex items-center space-x-2">
          {presets.map(({ name, value: presetValue }) => (
            <button
              key={name}
              onClick={() => onChange(property, presetValue)}
              className="px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600"
              title={`Set ${label.toLowerCase()} to ${name.toLowerCase()}`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={value}
          onChange={(e) => onChange(property, parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">{(value * 100).toFixed(0)}%</span>
          <input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={value}
            onChange={(e) => onChange(property, parseFloat(e.target.value))}
            className="w-16 text-xs bg-gray-700 text-white rounded px-1"
          />
        </div>
      </div>
    </div>
  );
};

const ProjectMaterialModify = ({
  selectedParts, // Changed from selectedPart to selectedParts
  onTransformChange,
  onMaterialChange,
  onResetTransforms
}) => {
  const [error, setError] = useState(null);
  const [transforms, setTransforms] = useState({
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  });

  const [material, setMaterial] = useState({
    color: '#ffffff',
    metalness: 0.5,
    roughness: 0.5,
    opacity: 1.0
  });

  const [uniformScale, setUniformScale] = useState(false);

  // Update state when selected part changes
  useEffect(() => {
    if (selectedParts.size > 0) {
      const firstPart = selectedParts.values().next().value;
      setMaterial({
        color: firstPart.currentColor || '#ffffff',
        metalness: firstPart.currentMaterial?.metalness || 0.5,
        roughness: firstPart.currentMaterial?.roughness || 0.5,
        opacity: firstPart.currentMaterial?.opacity || 1.0
      });
    } else {
      // Reset to defaults if no part is selected
      setTransforms({
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      });
      setMaterial({
        color: '#ffffff',
        metalness: 0.5,
        roughness: 0.5,
        opacity: 1.0
      });
    }
  }, [selectedParts]);

  const validateTransform = (type, value) => {
    switch (type) {
      case 'position':
        return value >= -100 && value <= 100;
      case 'rotation':
        return value >= -360 && value <= 360;
      case 'scale':
        return value > 0 && value <= 10;
      default:
        return true;
    }
  };

  const handleTransformChange = (type, axis, value) => {
    try {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        setError(`Invalid ${type} value for ${axis} axis`);
        return;
      }

      if (!validateTransform(type, numValue)) {
        setError(`${type} value for ${axis} axis out of valid range`);
        return;
      }

      setError(null);
      setTransforms(prev => ({
        ...prev,
        [type]: { ...prev[type], [axis]: numValue }
      }));
      onTransformChange?.(type, axis, numValue);
    } catch (err) {
      setError(`Error updating ${type}: ${err.message}`);
    }
  };

  const handleUniformScale = (value) => {
    ['x', 'y', 'z'].forEach(axis => {
      handleTransformChange('scale', axis, value);
    });
  };

  const validateMaterial = (property, value) => {
    switch (property) {
      case 'metalness':
      case 'roughness':
      case 'opacity':
        return value >= 0 && value <= 1;
      case 'color':
        return /^#[0-9A-F]{6}$/i.test(value);
      default:
        return true;
    }
  };

  const handleMaterialChange = (property, value) => {
    try {
      if (!validateMaterial(property, value)) {
        setError(`Invalid ${property} value`);
        return;
      }

      setError(null);
      setMaterial(prev => ({ ...prev, [property]: value }));
      onMaterialChange?.(property, value);
    } catch (err) {
      setError(`Error updating material ${property}: ${err.message}`);
    }
  };

  const handleReset = () => {
    try {
      setTransforms({
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      });
      setMaterial({
        color: '#ffffff',
        metalness: 0.5,
        roughness: 0.5,
        opacity: 1.0
      });
      setError(null);
      onResetTransforms?.();
    } catch (err) {
      setError(`Error resetting modifications: ${err.message}`);
    }
  };

  if (selectedParts.size === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        Select a part from the Colors tab to modify its properties
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded p-3 text-red-300 mb-4">
          {error}
        </div>
      )}

      {/* Selected Parts Info */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Selected Parts</h3>
        <p className="text-gray-300">{selectedParts.size} part{selectedParts.size > 1 ? 's' : ''} selected</p>
      </div>

      {/* Material Properties with enhanced sliders */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Material Properties</h3>

        {/* Removed Color section since it's already in the Colors tab */}

        {/* Metalness with enhanced visual feedback */}
        <MaterialPropertyControl
          label="Metalness"
          value={material.metalness}
          onChange={handleMaterialChange}
          property="metalness"
          presets={[
            { name: "Non-Metal", value: 0 },
            { name: "Semi-Metal", value: 0.5 },
            { name: "Metal", value: 1 }
          ]}
        />

        {/* Roughness with enhanced visual feedback */}
        <MaterialPropertyControl
          label="Roughness"
          value={material.roughness}
          onChange={handleMaterialChange}
          property="roughness"
          presets={[
            { name: "Polished", value: 0 },
            { name: "Semi-Rough", value: 0.5 },
            { name: "Rough", value: 1 }
          ]}
        />

        {/* Opacity with enhanced visual feedback */}
        <MaterialPropertyControl
          label="Opacity"
          value={material.opacity}
          onChange={handleMaterialChange}
          property="opacity"
          presets={[
            { name: "Clear", value: 0 },
            { name: "Semi-Trans", value: 0.5 },
            { name: "Solid", value: 1 }
          ]}
        />
      </div>

      {/* Transformations with enhanced visual feedback */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex justify-between items-center">
          <span>Transformations</span>
          <div className="relative group">
            <button
              onClick={() => {
                setTransforms({
                  position: { x: 0, y: 0, z: 0 },
                  rotation: { x: 0, y: 0, z: 0 },
                  scale: { x: 1, y: 1, z: 1 }
                });
                ['position', 'rotation', 'scale'].forEach(type => {
                  ['x', 'y', 'z'].forEach(axis => {
                    onTransformChange(type, axis, type === 'scale' ? 1 : 0);
                  });
                });
              }}
              className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded transition-all duration-200 relative"
            >
              Reset Transform
            </button>
            <div className="absolute top-full mt-1 right-0 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Reset all transformations to default
            </div>
          </div>
        </h3>

        {/* Position Controls with axis buttons */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex justify-between items-center">
            <span>Position</span>
            <div className="flex space-x-2">
              {['x', 'y', 'z'].map(axis => (
                <button
                  key={`reset-pos-${axis}`}
                  onClick={() => handleTransformChange('position', axis, 0)}
                  className="px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600"
                >
                  Reset {axis.toUpperCase()}
                </button>
              ))}
            </div>
          </h4>
          <div className="grid grid-cols-3 gap-4">
            {['x', 'y', 'z'].map(axis => (
              <div key={`pos-${axis}`} className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-gray-400">{axis.toUpperCase()}</label>
                  <input
                    type="number"
                    min="-100"
                    max="100"
                    step="0.1"
                    value={transforms.position[axis]}
                    onChange={(e) => handleTransformChange('position', axis, e.target.value)}
                    className="bg-gray-700 text-white rounded px-2 py-1 text-sm w-20"
                  />
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  step="0.1"
                  value={transforms.position[axis]}
                  onChange={(e) => handleTransformChange('position', axis, e.target.value)}
                  className="w-full accent-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Rotation Controls with preset buttons */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex justify-between items-center">
            <span>Rotation</span>
            <div className="flex space-x-2">
              {['x', 'y', 'z'].map(axis => (
                <button
                  key={`reset-rot-${axis}`}
                  onClick={() => handleTransformChange('rotation', axis, 0)}
                  className="px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600"
                >
                  Reset {axis.toUpperCase()}
                </button>
              ))}
            </div>
          </h4>
          <div className="grid grid-cols-3 gap-4">
            {['x', 'y', 'z'].map(axis => (
              <div key={`rot-${axis}`} className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-gray-400">{axis.toUpperCase()}</label>
                  <input
                    type="number"
                    min="-360"
                    max="360"
                    step="1"
                    value={transforms.rotation[axis]}
                    onChange={(e) => handleTransformChange('rotation', axis, e.target.value)}
                    className="bg-gray-700 text-white rounded px-2 py-1 text-sm w-20"
                  />
                </div>
                <input
                  type="range"
                  min="-360"
                  max="360"
                  step="1"
                  value={transforms.rotation[axis]}
                  onChange={(e) => handleTransformChange('rotation', axis, e.target.value)}
                  className="w-full accent-green-500"
                />
                <div className="flex justify-between mt-1">
                  <button
                    onClick={() => handleTransformChange('rotation', axis, -90)}
                    className="px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600"
                  >
                    -90°
                  </button>
                  <button
                    onClick={() => handleTransformChange('rotation', axis, 90)}
                    className="px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600"
                  >
                    90°
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scale Controls with uniform scaling */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex justify-between items-center">
            <span>Scale</span>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={uniformScale}
                  onChange={(e) => setUniformScale(e.target.checked)}
                  className="rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-300">Uniform Scale</span>
              </label>
              <button
                onClick={() => {
                  ['x', 'y', 'z'].forEach(axis => {
                    handleTransformChange('scale', axis, 1);
                  });
                }}
                className="px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600"
              >
                Reset All
              </button>
            </div>
          </h4>
          {uniformScale ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-gray-400">Uniform</label>
                <input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={transforms.scale.x}
                  onChange={(e) => handleUniformScale(parseFloat(e.target.value))}
                  className="bg-gray-700 text-white rounded px-2 py-1 text-sm w-20"
                />
              </div>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={transforms.scale.x}
                onChange={(e) => handleUniformScale(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleUniformScale(0.5)}
                  className="px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600"
                >
                  0.5x
                </button>
                <button
                  onClick={() => handleUniformScale(1)}
                  className="px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600"
                >
                  1x
                </button>
                <button
                  onClick={() => handleUniformScale(2)}
                  className="px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600"
                >
                  2x
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {['x', 'y', 'z'].map(axis => (
                <div key={`scale-${axis}`} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-gray-400">{axis.toUpperCase()}</label>
                    <input
                      type="number"
                      min="0.1"
                      max="10"
                      step="0.1"
                      value={transforms.scale[axis]}
                      onChange={(e) => handleTransformChange('scale', axis, e.target.value)}
                      className="bg-gray-700 text-white rounded px-2 py-1 text-sm w-20"
                    />
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={transforms.scale[axis]}
                    onChange={(e) => handleTransformChange('scale', axis, e.target.value)}
                    className="w-full accent-purple-500"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reset All Button with confirmation */}
        <div className="relative group">
          <button
            onClick={(e) => {
              if (e.shiftKey || window.confirm('Are you sure you want to reset all modifications?')) {
                handleReset();
              }
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition duration-200"
          >
            Reset All Modifications
          </button>
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Hold Shift + Click to skip confirmation
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMaterialModify;