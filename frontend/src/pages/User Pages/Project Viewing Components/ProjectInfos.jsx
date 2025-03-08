import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const ProjectInfos = ({ projectDetails, loading, updatedMaterials }) => {
  const [showMaterials, setShowMaterials] = useState(false);

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

  // Format materials for display
  const getMaterialsForDisplay = () => {
    if (!materials || materials.length === 0) return [];
    
    // Always convert to array format for display
    const materialsArray = Array.isArray(materials) 
      ? materials 
      : Object.entries(materials).map(([name, details]) => ({
          material: name,
          quantity: details.quantity,
          unitPrice: details.unit_price || details.unitPrice,
          totalPrice: details.total_price || details.totalPrice
        }));
    
    return materialsArray;
  };

  const displayMaterials = getMaterialsForDisplay();
  const hasUpdates = !!updatedMaterials;

  // Calculate total costs
  const calculateTotalCost = (materialsData) => {
    if (!materialsData) return 0;
    
    if (Array.isArray(materialsData)) {
      return materialsData.reduce((sum, mat) => sum + (mat.totalPrice || mat.total_price || 0), 0);
    }
    
    return Object.values(materialsData).reduce((sum, mat) => 
      sum + (mat.totalPrice || mat.total_price || 0), 0);
  };

  const originalTotalCost = calculateTotalCost(materials);
  const updatedTotalCost = hasUpdates ? calculateTotalCost(updatedMaterials) : originalTotalCost;

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

      {displayMaterials.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Materials Overview</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Materials:</span>
              <span className="text-gray-300">{displayMaterials.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Cost:</span>
              {hasUpdates ? (
                <div className="flex flex-col items-end">
                  <span className="text-gray-300 line-through">₱{totalCost?.toLocaleString()}</span>
                  <span className="text-green-400">₱{updatedTotalCost?.toLocaleString()}</span>
                </div>
              ) : (
                <span className="text-gray-300">₱{totalCost?.toLocaleString()}</span>
              )}
            </div>
            
            {/* Expandable Materials List */}
            <div className="pt-2">
              <button
                onClick={() => setShowMaterials(!showMaterials)}
                className="flex items-center justify-between w-full bg-gray-700 hover:bg-gray-600 rounded p-2"
              >
                <span>View Material Details</span>
                {showMaterials ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              
              {showMaterials && (
                <div className="mt-2 bg-gray-700 rounded p-2 max-h-60 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-2">Material</th>
                        <th className="text-right py-2">Quantity</th>
                        <th className="text-right py-2">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayMaterials.map((material, index) => {
                        let updatedQuantity = null;
                        let updatedPrice = null;

                        if (hasUpdates) {
                          const updatedMat = Array.isArray(updatedMaterials)
                            ? updatedMaterials.find(m => m.material === material.material)
                            : updatedMaterials[material.material];

                          if (updatedMat) {
                            updatedQuantity = updatedMat.quantity;
                            updatedPrice = updatedMat.totalPrice || updatedMat.total_price;
                          }
                        }

                        const hasChange = updatedQuantity !== null && updatedQuantity !== material.quantity;

                        return (
                          <tr key={index} className="border-b border-gray-600 text-xs">
                            <td className="py-1">{material.material}</td>
                            <td className="py-1 text-right">
                              {hasChange ? (
                                <div className="flex flex-col items-end">
                                  <span className="line-through">{material.quantity}</span>
                                  <span className={updatedQuantity > material.quantity ? 'text-green-400' : 'text-red-400'}>
                                    {updatedQuantity}
                                  </span>
                                </div>
                              ) : (
                                material.quantity
                              )}
                            </td>
                            <td className="py-1 text-right">
                              {hasChange ? (
                                <div className="flex flex-col items-end">
                                  <span className="line-through">₱{(material.totalPrice || material.total_price || 0).toLocaleString()}</span>
                                  <span className={updatedPrice > (material.totalPrice || material.total_price) ? 'text-green-400' : 'text-red-400'}>
                                    ₱{updatedPrice.toLocaleString()}
                                  </span>
                                </div>
                              ) : (
                                `₱${(material.totalPrice || material.total_price || 0).toLocaleString()}`
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="font-semibold">
                        <td className="py-2">Total Cost</td>
                        <td></td>
                        <td className="text-right py-2">
                          {hasUpdates ? (
                            <div className="flex flex-col items-end">
                              <span className="line-through">₱{originalTotalCost.toLocaleString()}</span>
                              <span className={updatedTotalCost > originalTotalCost ? 'text-green-400' : 'text-red-400'}>
                                ₱{updatedTotalCost.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            `₱${originalTotalCost.toLocaleString()}`
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
          {hasUpdates && (
            <div className="mt-3 text-xs bg-blue-900 bg-opacity-30 p-2 rounded">
              <p className="text-blue-300">Changes will be applied when you save the model.</p>
            </div>
          )}
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