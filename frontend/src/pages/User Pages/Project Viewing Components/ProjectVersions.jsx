import React from 'react';

const ProjectVersions = ({ versions = [], currentVersion, onVersionSelect }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Model Versions</h3>
      <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto">
        {versions.map((version) => (
          <div
            key={version.version}
            className={`p-4 rounded-lg cursor-pointer transition-all duration-200
              ${version.version === currentVersion
                ? 'bg-blue-500 bg-opacity-20 border border-blue-500'
                : 'bg-gray-700 hover:bg-gray-600 border border-transparent'
              }`}
            onClick={() => onVersionSelect(version)}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium">Version {version.version}</h4>
              <span className="text-xs text-gray-400">
                {new Date(version.createdAt).toLocaleDateString()}
              </span>
            </div>
            {version.description && (
              <p className="text-sm text-gray-300">{version.description}</p>
            )}
            <div className="mt-2 flex items-center space-x-2 text-xs text-gray-400">
              <span>Score: {Math.round(version.confidenceScore * 100)}%</span>
              {version.thumbnailPreview && (
                <img
                  src={version.thumbnailPreview}
                  alt={`Version ${version.version} preview`}
                  className="w-12 h-12 object-cover rounded"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectVersions;