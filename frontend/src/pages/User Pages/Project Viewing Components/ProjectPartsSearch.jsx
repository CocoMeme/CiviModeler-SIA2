import React, { useState, useEffect } from 'react';

const ProjectPartsSearch = ({ modelParts, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    material: 'all',
    visibility: 'all'
  });

  // Extract unique material types from parts
  const getMaterialTypes = () => {
    const types = new Set();
    modelParts.forEach(part => {
      if (part.currentMaterial.metalness > 0.5) {
        types.add('metallic');
      } else {
        types.add('non-metallic');
      }
      if (part.currentMaterial.opacity < 1) {
        types.add('transparent');
      }
    });
    return Array.from(types);
  };

  // Update filters when search or filter options change
  useEffect(() => {
    const filterParts = () => {
      return modelParts.filter(part => {
        // Search term filter
        const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Material type filter
        const matchesMaterial = filters.material === 'all' ||
          (filters.material === 'metallic' && part.currentMaterial.metalness > 0.5) ||
          (filters.material === 'non-metallic' && part.currentMaterial.metalness <= 0.5) ||
          (filters.material === 'transparent' && part.currentMaterial.opacity < 1);

        return matchesSearch && matchesMaterial;
      });
    };

    onFilterChange(filterParts());
  }, [searchTerm, filters, modelParts, onFilterChange]);

  return (
    <div className="space-y-4 mb-6">
      {/* Search input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search parts..."
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg pl-10"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Filter options */}
      <div className="flex flex-wrap gap-2">
        <select
          value={filters.material}
          onChange={(e) => setFilters(prev => ({ ...prev, material: e.target.value }))}
          className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm"
        >
          <option value="all">All Materials</option>
          {getMaterialTypes().map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        {/* Quick filter buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilters(prev => ({ ...prev, material: 'metallic' }))}
            className={`px-3 py-1 rounded-lg text-sm ${
              filters.material === 'metallic'
                ? 'bg-blue-500'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Metallic
          </button>
          <button
            onClick={() => setFilters(prev => ({ ...prev, material: 'transparent' }))}
            className={`px-3 py-1 rounded-lg text-sm ${
              filters.material === 'transparent'
                ? 'bg-blue-500'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            Transparent
          </button>
          <button
            onClick={() => setFilters(prev => ({ ...prev, material: 'all' }))}
            className={`px-3 py-1 rounded-lg text-sm ${
              filters.material === 'all'
                ? 'bg-blue-500'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* Filter tags */}
      {(searchTerm || filters.material !== 'all') && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <span className="bg-blue-500 bg-opacity-20 text-blue-300 px-2 py-1 rounded-full text-xs flex items-center">
              Search: {searchTerm}
              <button
                onClick={() => setSearchTerm('')}
                className="ml-2 hover:text-blue-100"
              >
                ×
              </button>
            </span>
          )}
          {filters.material !== 'all' && (
            <span className="bg-blue-500 bg-opacity-20 text-blue-300 px-2 py-1 rounded-full text-xs flex items-center">
              Material: {filters.material}
              <button
                onClick={() => setFilters(prev => ({ ...prev, material: 'all' }))}
                className="ml-2 hover:text-blue-100"
              >
                ×
              </button>
            </span>
          )}
          {(searchTerm || filters.material !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ type: 'all', material: 'all', visibility: 'all' });
              }}
              className="text-xs text-gray-400 hover:text-gray-300"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectPartsSearch;