import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Typography, Modal } from '@mui/material';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ProjectManagement() {
  const { backendUrl } = useContext(AppContext);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openClientModal, setOpenClientModal] = useState(false);
  const [openMaterialsModal, setOpenMaterialsModal] = useState(false);
  const [openContractorModal, setOpenContractorModal] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/project/get-all-projects`, { withCredentials: true });
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [backendUrl]);

  const handleOpenClientModal = (project) => {
    setSelectedProject(project);
    setOpenClientModal(true);
  };

  const handleOpenMaterialsModal = (project) => {
    setSelectedProject(project);
    setOpenMaterialsModal(true);
  };

  const handleOpenContractorModal = (project) => {
    console.log('Selected Project:', project);
    if (project.contractorId) {
      const fetchContractor = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/contractor/${project.contractorId}`);
          console.log('Contractor Details:', response.data);
          setSelectedContractor(response.data);
        } catch (error) {
          console.error('Error fetching contractor:', error);
        }
      };

      fetchContractor();
    } else {
      setSelectedContractor(null);
    }
    setSelectedProject(project);
    setOpenContractorModal(true);
  };

  const handleCloseClientModal = () => setOpenClientModal(false);
  const handleCloseMaterialsModal = () => setOpenMaterialsModal(false);
  const handleCloseContractorModal = () => setOpenContractorModal(false);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Project Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 shadow-md overflow-hidden">
          <thead className="bg-white text-black">
            <tr>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Project ID</th>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Project Name</th>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Budget</th>
              <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {projects.map((project) => (
              <tr key={project._id} className="border-b border-gray-700">
                <td className="w-1/4 py-3 px-4 text-center">{project._id}</td>
                <td className="w-1/4 py-3 px-4 text-center">{project.projectName}</td>
                <td className="w-1/4 py-3 px-4 text-center">₱{project.budget.toLocaleString()}</td>
                <td className="w-1/4 py-3 px-2 text-center">
                  <button
                    className="mr-2 bg-blue-500 text-white px-4 py-2 hover:bg-blue-700 border border-white"
                    onClick={() => handleOpenClientModal(project)}
                  >
                    Client Details
                  </button>
                  <button
                    className="mr-2 bg-green-500 text-white px-4 py-2 hover:bg-green-700 border border-white"
                    onClick={() => handleOpenMaterialsModal(project)}
                  >
                    Materials
                  </button>
                  <button
                    className="mr-2 bg-purple-500 text-white px-4 py-2 hover:bg-purple-700 border border-white"
                    onClick={() => handleOpenContractorModal(project)}
                  >
                    Contractor
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 hover:bg-green-700 border border-white"
                    onClick={() => alert('View 3D not implemented yet')}
                  >
                    View 3D
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     {/* Client Details Modal */}
<Modal open={openClientModal} onClose={handleCloseClientModal}>
  <Box
    sx={{
      ...modalStyle,
      width: "80%",  
      maxWidth: "800px", 
      p: 4, 
    }}
    className="bg-white rounded-lg shadow-lg"
  >
    <Typography 
      variant="h6" 
      className="mb-4 font-semibold text-center text-2xl"
    >
      Client Details
    </Typography>
    {selectedProject && selectedProject.clientDetails ? (
      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: "1.2rem", fontWeight: "500" }}>
          Name: {selectedProject.clientDetails.clientName}
        </Typography>
        <Typography sx={{ fontSize: "1.2rem", fontWeight: "500" }}>
          Email: {selectedProject.clientDetails.email}
        </Typography>
        <Typography sx={{ fontSize: "1.2rem", fontWeight: "500" }}>
          Phone: {selectedProject.clientDetails.phoneNumber}
        </Typography>
        <Typography sx={{ fontSize: "1.2rem", fontWeight: "500" }}>
          Company: {selectedProject.clientDetails.companyName}
        </Typography>
      </Box>
    ) : (
      <Typography sx={{ fontSize: "1.2rem", mt: 2 }}>
        No client details available.
      </Typography>
    )}
    <Box sx={{ mt: 3, textAlign: "center" }}>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ fontSize: "1.1rem", padding: "10px 20px" }}
        onClick={handleCloseClientModal}
      >
        Close
      </Button>
    </Box>
  </Box>
</Modal>

      {/* Materials Modal */}
<Modal open={openMaterialsModal} onClose={handleCloseMaterialsModal}>
  <Box
    sx={{
      ...modalStyle,
      width: "80%",  
      maxWidth: "900px", 
      p: 4,
    }}
    className="bg-white rounded-lg shadow-lg"
  >
    <Typography 
      variant="h6" 
      className="mb-4 font-semibold text-center text-2xl text-gray-800"
    >
      Materials
    </Typography>
    {selectedProject && selectedProject.materials && selectedProject.materials.length > 0 ? (
      <Box sx={{ mt: 2 }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead className="bg-white text-black">
              <tr>
                <th className="py-3 px-4 text-left">Material</th>
                <th className="py-3 px-4 text-left">Quantity</th>
                <th className="py-3 px-4 text-left">Unit Price</th>
                <th className="py-3 px-4 text-left">Total Price</th>
              </tr>
            </thead>
            <tbody className="bg-gray-100 text-gray-900 text-lg">
              {selectedProject.materials.map((material, index) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="py-3 px-4">{material.material}</td>
                  <td className="py-3 px-4">{material.quantity}</td>
                  <td className="py-3 px-4">₱{material.unitPrice.toLocaleString()}</td>
                  <td className="py-3 px-4 font-semibold">₱{material.totalPrice.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Typography 
          variant="h6" 
          className="mt-4 text-right font-bold text-xl text-gray-900"
        >
          Total Cost: <span className="text-green-600">₱{selectedProject.materials.reduce((acc, material) => acc + material.totalPrice, 0).toLocaleString()}</span>
        </Typography>
      </Box>
    ) : (
      <Typography className="mt-2 text-gray-600 text-center text-lg">
        No materials available.
      </Typography>
    )}
    <button 
      onClick={handleCloseMaterialsModal} 
      className="mt-6 w-full py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Close
    </button>
  </Box>
</Modal>


      {/* Contractor Modal */}
<Modal open={openContractorModal} onClose={handleCloseContractorModal}>
  <Box
    sx={{
      ...modalStyle,
      width: "80%",  // Increased width
      maxWidth: "700px", // Set max width
      p: 5, // Increased padding for better spacing
    }}
    className="bg-white rounded-lg shadow-lg"
  >
    <Typography 
      variant="h6" 
      className="mb-4 text-center text-2xl font-semibold text-gray-800"
    >
      Contractor Details
    </Typography>
    {selectedContractor ? (
      <Box sx={{ mt: 2 }} className="space-y-3">
        <Typography className="text-lg"><strong>Name:</strong> {selectedContractor.name}</Typography>
        <Typography className="text-lg"><strong>License Number:</strong> {selectedContractor.licenseNumber}</Typography>
        <Typography className="text-lg"><strong>Business Address:</strong> {selectedContractor.businessAddress}</Typography>
        <Typography className="text-lg"><strong>Contact Information:</strong> {selectedContractor.contactNumber}</Typography>
        <Typography className="text-lg"><strong>Experience:</strong> {selectedContractor.experience}</Typography>
        <Typography className="text-lg"><strong>Contract Terms:</strong> {selectedContractor.contractTerms}</Typography>
      </Box>
    ) : (
      <Typography className="mt-2 text-gray-600 text-center text-lg">
        No contractor selected.
      </Typography>
    )}
    <button 
      onClick={handleCloseContractorModal} 
      className="mt-6 w-full py-3 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    >
      Close
    </button>
  </Box>
</Modal>

    </div>
  );
}