import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import ProjectContent from '../../components/Project Components/ProjectContent';
import Collaborators from '../../components/Project Components/Collaborators';
import ProjectReports from '../../components/Project Components/ProjectReports'; 
import { toast } from 'react-toastify'; // Import toast

export default function ProjectOverview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { backendUrl, userData } = useContext(AppContext);
  const projectData = location.state;
  if (!projectData) {
    return <div>No project data available. Please select a project from the sidebar.</div>;
  }

  const { clientDetails, materials, totalCost, sloyd, contractorId, ...rest } = projectData || {};

  const [openDialog, setOpenDialog] = useState(false);
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [infoDialog, setInfoDialog] = useState({ open: false, content: '' });
  const [loading, setLoading] = useState(true);
  const [clientDetailsState, setClientDetailsState] = useState(clientDetails || {});
  const [projectDetailsState, setProjectDetailsState] = useState(rest || {});
  const [projectUpdated, setProjectUpdated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [projectLoading, setProjectLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [currentMaterials, setCurrentMaterials] = useState(materials || {});
  const [currentTotalCost, setCurrentTotalCost] = useState(totalCost || 0);
  const [currentSloyd, setCurrentSloyd] = useState(sloyd || {});

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        // Use the standard /all endpoint instead of the specialized one
        const response = await axios.get(`${backendUrl}/api/contractor/all`);
        
        // The response from /all is directly the array, with no success property
        if (Array.isArray(response.data)) {
          setContractors(response.data);
        } else {
          console.error('Unexpected response format for contractors:', response.data);
          // Initialize with an empty array to prevent the map error
          setContractors([]);
        }
      } catch (error) {
        console.error('Error fetching contractors:', error);
        // Initialize with an empty array to prevent the map error
        setContractors([]);
      }
    };

    const fetchSelectedContractor = async () => {
      if (contractorId) {
        try {
          const response = await axios.get(`${backendUrl}/api/contractor/${contractorId}`);
          // Check if the response has the expected structure
          if (response.data && response.data.success) {
            setSelectedContractor(response.data.contractor);
          }
        } catch (error) {
          console.error('Error fetching selected contractor:', error);
        }
      }
    };

    fetchContractors();
    fetchSelectedContractor();
    
    // Random loading time between 300ms to 1s
    const loadingTime = Math.random() * (1000 - 300) + 300;
    setTimeout(() => setLoading(false), loadingTime);
  }, [backendUrl, projectData._id, contractorId]); // Add projectData._id and contractorId to dependencies

  useEffect(() => {
    setProjectLoading(true);
    setClientDetailsState(projectData.clientDetails || {});
    setProjectDetailsState(rest || {});
    setCurrentMaterials(materials || {});
    setCurrentTotalCost(totalCost || 0);
    setCurrentSloyd(sloyd || {});
    setTimeout(() => setProjectLoading(false), 500);
  }, [projectData]);

  const handleConfirm = async () => {
    setSaveLoading(true);
    try {
      const updatedProject = {
        clientDetails: {
          clientName: clientDetailsState.clientName,
          email: clientDetailsState.email,
          phoneNumber: clientDetailsState.phoneNumber,
          companyName: clientDetailsState.companyName,
        },
        ...projectDetailsState,
        contractorId: selectedContractor?._id
      };
      
      const response = await axios.put(`${backendUrl}/api/project/${projectData._id}`, updatedProject);
      setOpenDialog(false);
      setProjectUpdated(true); // Set the flag to true
      toast.success('Project updated successfully!');
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Error updating project.');
    } finally {
      setSaveLoading(false);
    }
  };

  // Fetch updated project data when projectUpdated flag is true
  useEffect(() => {
    if (projectUpdated) {
      const fetchUpdatedProject = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/project/${projectData._id}`);
          const updatedProjectData = response.data;
          
          // Properly extract and update the different parts of the project data
          const { clientDetails, materials, totalCost, sloyd, contractorId, ...restDetails } = updatedProjectData;
          
          setClientDetailsState(clientDetails || {});
          setProjectDetailsState(restDetails || {});
          setCurrentMaterials(materials || {});
          setCurrentTotalCost(totalCost || 0);
          setCurrentSloyd(sloyd || {});
          
          // Update the contractor if it changed
          if (contractorId && contractorId !== selectedContractor?._id) {
            try {
              const contractorResponse = await axios.get(`${backendUrl}/api/contractor/${contractorId}`);
              if (contractorResponse.data && contractorResponse.data.success) {
                setSelectedContractor(contractorResponse.data.contractor);
              }
            } catch (error) {
              console.error('Error fetching updated contractor:', error);
            }
          }
          
          setProjectUpdated(false); // Reset the flag
          toast.info('Project data refreshed with latest changes.');
        } catch (error) {
          console.error('Error fetching updated project data:', error);
        }
      };

      fetchUpdatedProject();
    }
  }, [projectUpdated, backendUrl, projectData._id, selectedContractor]);

  const handleClientDetailsChange = (e) => {
    const { name, value } = e.target;
    setClientDetailsState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleProjectDetailsChange = (e) => {
    const { name, value } = e.target;
    setProjectDetailsState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleGoTo3D = () => {
    navigate('/project-viewer/work-station', { 
      state: { 
        modelUrl: currentSloyd?.modelUrl,
        projectId: projectData._id // Add projectId to the state
      } 
    });
  };

  const handleGenerate3D = async () => {
    try {
      setGenerating(true);
      const prompt = `The size of model is ${projectDetailsState.size} sqft. ${projectDetailsState.projectDescription}`;
      const response = await axios.post(`${backendUrl}/api/project/generate-project`, {
        prompt,
        projectId: projectData._id
      });

      // Set project updated to refresh the data
      setProjectUpdated(true);
      setGenerating(false);
      
      // Show success message
      toast.success('3D model generated successfully!');
      
      // Navigate to viewer with the latest model
      setTimeout(() => {
        navigate('/project-viewer/work-station', { 
          state: { 
            projectId: projectData._id 
          } 
        });
      }, 1000);
    } catch (error) {
      console.error("Error generating 3D model:", error);
      setGenerating(false);
      toast.error('Error generating 3D model.');
    }
  };

  const materialData = currentMaterials
    ? Object.entries(currentMaterials).map(([material, details]) => ({
      name: material,
      quantity: details.quantity
    }))
    : [];

  return (
    <div className="container mx-auto">
      {/* Header */}
      <img className="rounded-lg mb-4 w-full" src="/project images/H5.png" alt="CiviModeler H5" />

      {/* Overall Loading Animation */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-purple-700 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Main Layout */}
      {!loading && activeTab === 'overview' && (
        <ProjectContent
          clientDetailsState={clientDetailsState}
          projectDetailsState={projectDetailsState}
          contractors={contractors}
          selectedContractor={selectedContractor}
          setSelectedContractor={setSelectedContractor}
          handleClientDetailsChange={handleClientDetailsChange}
          handleProjectDetailsChange={handleProjectDetailsChange}
          handleGoTo3D={handleGoTo3D}
          handleGenerate3D={handleGenerate3D} // Pass the new function
          handleConfirm={handleConfirm}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          infoDialog={infoDialog}
          setInfoDialog={setInfoDialog}
          materials={currentMaterials}
          totalCost={currentTotalCost}
          sloyd={currentSloyd}
          materialData={materialData}
        />
      )}

      {!loading && activeTab === 'collaborators' && (
        <Collaborators />
      )}

      {!loading && activeTab === 'reports' && (
        <ProjectReports />
      )}

      {/* NEW: Saving Updates Loading Animation */}
      {saveLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-700 rounded-full animate-spin"></div>
          <p className="text-white mt-2">Saving updates...</p>
        </div>
      )}

      {/* Generating Animation */}
      {generating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-purple-700 rounded-full animate-spin"></div>
          <p className="text-white mt-2">Generating 3D model...</p>
        </div>
      )}
    </div>
  );
}