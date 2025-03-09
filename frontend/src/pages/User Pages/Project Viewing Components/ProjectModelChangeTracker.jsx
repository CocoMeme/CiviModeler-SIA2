import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../../context/AppContext';
import axios from 'axios';

// Map of model parts to material types
const materialMappings = {
  // Structure parts
  'wall': 'Bricks',
  'floor': 'Cement',
  'ceiling': 'Wood',
  'roof': 'Roofing',
  'foundation': 'Cement',
  'beam': 'Steel',
  'column': 'Cement',
  'pillar': 'Steel',
  
  // Finishing parts
  'tile': 'Tiles',
  'paint': 'Paint',
  'glass': 'Glass',
  'door': 'Wood',
  'window': 'Glass',
  
  // Sanitary parts
  'sink': 'Steel',
  'toilet': 'Ceramic',
  'shower': 'Steel',
  'bathtub': 'Ceramic',
  
  // Default fallback
  'default': 'Wood'
};

// Helper function to determine material type from part name
const getMaterialTypeFromPart = (partName) => {
  const normalizedName = partName.toLowerCase();
  
  for (const [key, material] of Object.entries(materialMappings)) {
    if (normalizedName.includes(key)) {
      return material;
    }
  }
  
  return materialMappings.default;
};

// Calculate material impact factor based on part properties
const calculateMaterialImpact = (part) => {
  // Default impact is 1 unit
  let impact = 1;
  
  // Scale based on part's scale (if available) or volume calculation
  if (part.scale) {
    // Calculate volume scale factor
    const volumeFactor = part.scale.x * part.scale.y * part.scale.z;
    impact *= Math.max(0.1, Math.min(5, volumeFactor)); // Clamp between 0.1 and 5
  }
  
  // Apply material-specific factors
  const materialType = getMaterialTypeFromPart(part.name);
  switch (materialType) {
    case 'Bricks':
      // Brick walls have a higher material usage per unit
      impact *= 1.2;
      break;
    case 'Steel':
      // Steel has higher density
      impact *= 1.5;
      break;
    case 'Glass':
      // Glass has lower material usage per unit
      impact *= 0.8;
      break;
    default:
      // Default factor
      impact *= 1.0;
  }
  
  return Math.round(impact * 100) / 100;
};

// This component tracks 3D model changes and updates material estimates
const ProjectModelChangeTracker = ({ 
  modelParts, 
  originalModelParts,
  projectDetails,
  onMaterialsChanged,
  isComparingVersions = false
}) => {
  const [materialChanges, setMaterialChanges] = useState({});
  const [materialQuantities, setMaterialQuantities] = useState({});
  const [modifiedMaterials, setModifiedMaterials] = useState([]);
  const { backendUrl } = useContext(AppContext);
  
  // Calculate material changes when model parts change
  useEffect(() => {
    if (!modelParts || !originalModelParts || !projectDetails) {
      return;
    }

    // Skip processing if we're just comparing versions and not doing edits
    if (isComparingVersions) {
      return;
    }

    // Calculate changes between current model and original model
    const partChanges = {};
    
    // Track added parts
    modelParts.forEach(part => {
      if (!originalModelParts.find(op => op.meshUuid === part.meshUuid)) {
        // This is a new part
        const materialType = getMaterialTypeFromPart(part.name);
        const impact = calculateMaterialImpact(part);
        
        if (!partChanges[materialType]) {
          partChanges[materialType] = { added: 0, removed: 0, impact: 0 };
        }
        
        partChanges[materialType].added += 1;
        partChanges[materialType].impact += impact;
      }
    });
    
    // Track removed parts
    originalModelParts.forEach(originalPart => {
      if (!modelParts.find(p => p.meshUuid === originalPart.meshUuid)) {
        // This part was removed
        const materialType = getMaterialTypeFromPart(originalPart.name);
        const impact = calculateMaterialImpact(originalPart);
        
        if (!partChanges[materialType]) {
          partChanges[materialType] = { added: 0, removed: 0, impact: 0 };
        }
        
        partChanges[materialType].removed += 1;
        partChanges[materialType].impact -= impact;
      }
    });
    
    // Track modified parts (scale, position, etc.)
    modelParts.forEach(part => {
      const originalPart = originalModelParts.find(op => op.meshUuid === part.meshUuid);
      
      if (originalPart) {
        // Compare scale to see if part size has changed
        const scaleChanged = 
          part.scale.x !== originalPart.scale.x || 
          part.scale.y !== originalPart.scale.y || 
          part.scale.z !== originalPart.scale.z;
          
        if (scaleChanged) {
          const materialType = getMaterialTypeFromPart(part.name);
          
          // Calculate original and new impact
          const originalImpact = calculateMaterialImpact(originalPart);
          const newImpact = calculateMaterialImpact(part);
          const impactDifference = newImpact - originalImpact;
          
          if (!partChanges[materialType]) {
            partChanges[materialType] = { added: 0, removed: 0, impact: 0 };
          }
          
          // Add the difference in impact to the total
          partChanges[materialType].impact += impactDifference;
        }
      }
    });

    // If we have changes, update material quantities
    if (Object.keys(partChanges).length > 0) {
      // Store the material changes
      setMaterialChanges(partChanges);
      
      // Update material quantities based on part changes
      updateMaterialEstimates(partChanges);
    }
  }, [modelParts, originalModelParts, projectDetails]);

  // Function to update material estimates based on part changes
  const updateMaterialEstimates = async (partChanges) => {
    try {
      // Use the fallback method directly instead of attempting API call
      // Comment out the API call that's failing
      /*
      const response = await axios.post(
        `${backendUrl}/api/estimate-from-model-changes`,
        {
          baseMaterials,
          modelChanges: partChanges,
          designStyle: projectDetails.style || 'Modern'
        }
      );

      if (response.data?.materials) {
        // Handle API response
      }
      */
      
      // Use the fallback method instead
      applyFallbackEstimateChanges(partChanges);
    } catch (error) {
      console.error('Error updating material estimates:', error);
      applyFallbackEstimateChanges(partChanges);
    }
  };

  // Fallback method to apply basic material changes without API call
  const applyFallbackEstimateChanges = (partChanges) => {
    const existingMaterials = projectDetails.materials;
    
    if (!existingMaterials) {
      return;
    }
    
    // Create a working copy of materials
    let updatedMaterials;
    
    // Handle different material formats
    if (Array.isArray(existingMaterials)) {
      updatedMaterials = [...existingMaterials];
      
      // Apply changes to each material based on part changes
      Object.entries(partChanges).forEach(([materialType, changes]) => {
        const materialIndex = updatedMaterials.findIndex(
          m => m.material === materialType || m.name === materialType
        );
        
        if (materialIndex >= 0) {
          // Calculate adjustment factor based on impact
          const adjustmentFactor = 1 + (changes.impact * 0.1); // 10% change per impact unit
          
          // Apply adjustment to the material
          const material = updatedMaterials[materialIndex];
          const newQuantity = Math.max(0.1, material.quantity * adjustmentFactor);
          
          // Update the material
          updatedMaterials[materialIndex] = {
            ...material,
            quantity: Math.round(newQuantity * 100) / 100,
            totalPrice: Math.round(newQuantity * material.unitPrice * 100) / 100
          };
        }
      });
    } else {
      // Handle object-based materials
      updatedMaterials = { ...existingMaterials };
      
      // Apply changes to each material based on part changes
      Object.entries(partChanges).forEach(([materialType, changes]) => {
        if (updatedMaterials[materialType]) {
          // Calculate adjustment factor based on impact
          const adjustmentFactor = 1 + (changes.impact * 0.1); // 10% change per impact unit
          
          // Apply adjustment to the material
          const material = updatedMaterials[materialType];
          const newQuantity = Math.max(0.1, material.quantity * adjustmentFactor);
          
          // Update the material
          updatedMaterials[materialType] = {
            ...material,
            quantity: Math.round(newQuantity * 100) / 100,
            total_price: Math.round(newQuantity * material.unit_price * 100) / 100
          };
        }
      });
    }
    
    // Update state and notify parent component
    setMaterialQuantities(updatedMaterials);
    setModifiedMaterials(updatedMaterials);
    
    if (typeof onMaterialsChanged === 'function') {
      onMaterialsChanged(updatedMaterials);
    }
  };

  // Don't render anything visible - this is a logic component
  return null;
};

export default ProjectModelChangeTracker;