import React from 'react';

const ProjectVersions = ({ versions = [], currentVersion, onVersionSelect }) => {
  // Sort versions by date, most recent first
  const sortedVersions = [...versions].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Model Versions</h3>
      <div className="space-y-2 overflow-y-auto">
        {sortedVersions.map((version) => (
          <div
            key={version.version}
            className={`p-4 rounded-lg cursor-pointer transition-all duration-200 flex gap-4 items-stretch
              ${version.version === currentVersion
                ? 'bg-blue-500 bg-opacity-20 border border-blue-500'
                : 'bg-gray-700 hover:bg-gray-600 border border-transparent'
              }`}
            onClick={() => onVersionSelect(version)}
          >
            {/* Thumbnail on the left */}
            <div className="flex-shrink-0 h-full">
              {version.thumbnailPreview ? (
                <img
                  src={version.thumbnailPreview}
                  alt={`Version ${version.version} preview`}
                  className="w-16 h-full object-cover rounded"
                />
              ) : (
                <div className="w-16 h-full bg-gray-600 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-400">No preview</span>
                </div>
              )}
            </div>

            {/* Version info on the right */}
            <div className="flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">Version {version.version}</h4>
                <span className="text-xs text-gray-400">
                  {new Date(version.createdAt).toLocaleDateString()}
                </span>
              </div>
              {version.description && (
                <p className="text-sm text-gray-300">{version.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectVersions;