import React from 'react';

const ProjectInfos = ({ projectDetails, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-700 rounded w-2/3"></div>
      </div>
    );
  }

  if (!projectDetails) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No project details available</p>
      </div>
    );
  }

  const {
    projectName,
    projectDescription,
    author,
    size,
    budget,
    style,
    clientDetails,
    materials,
    totalCost,
    createdAt,
    updatedAt
  } = projectDetails;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Project Name</h3>
        <p className="text-gray-300">{projectName}</p>
      </div>

      {projectDescription && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-300">{projectDescription}</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-2">Project Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Author:</span>
            <span className="text-gray-300">{author}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Size:</span>
            <span className="text-gray-300">{size} sqft</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Budget:</span>
            <span className="text-gray-300">₱{budget?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Style:</span>
            <span className="text-gray-300">{style}</span>
          </div>
        </div>
      </div>

      {clientDetails && Object.keys(clientDetails).some(key => clientDetails[key]) && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Client Details</h3>
          <div className="space-y-2 text-sm">
            {clientDetails.clientName && (
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-gray-300">{clientDetails.clientName}</span>
              </div>
            )}
            {clientDetails.email && (
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <span className="text-gray-300">{clientDetails.email}</span>
              </div>
            )}
            {clientDetails.phoneNumber && (
              <div className="flex justify-between">
                <span className="text-gray-400">Phone:</span>
                <span className="text-gray-300">{clientDetails.phoneNumber}</span>
              </div>
            )}
            {clientDetails.companyName && (
              <div className="flex justify-between">
                <span className="text-gray-400">Company:</span>
                <span className="text-gray-300">{clientDetails.companyName}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {materials && materials.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Materials Overview</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Materials:</span>
              <span className="text-gray-300">{materials.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Cost:</span>
              <span className="text-gray-300">₱{totalCost?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 pt-4 border-t border-gray-700">
        <p>Created: {new Date(createdAt).toLocaleDateString()}</p>
        <p>Last Updated: {new Date(updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default ProjectInfos;