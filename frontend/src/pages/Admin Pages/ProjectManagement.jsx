import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#2a2a2a',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
  color: 'white',
};

export default function ProjectManagement() {
  const { backendUrl } = useContext(AppContext);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [openClientModal, setOpenClientModal] = useState(false);
  const [openMaterialsModal, setOpenMaterialsModal] = useState(false);
  const [openContractorModal, setOpenContractorModal] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/project/get-all-projects`, { withCredentials: true });
        setProjects(response.data);
        setFilteredProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [backendUrl]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredProjects(projects.filter(project => 
      project.projectName.toLowerCase().includes(query) || 
      project._id.toLowerCase().includes(query)
    ));
  };

  const handleOpenClientModal = (project) => {
    setSelectedProject(project);
    setOpenClientModal(true);
  };

  const handleCloseClientModal = () => setOpenClientModal(false);

  const handleOpenMaterialsModal = (project) => {
    setSelectedProject(project);
    setOpenMaterialsModal(true);
  };

  const handleCloseMaterialsModal = () => setOpenMaterialsModal(false);

  const handleOpenContractorModal = (project) => {
    setSelectedProject(project);
    setOpenContractorModal(true);
  };

  const handleCloseContractorModal = () => setOpenContractorModal(false);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredProjects);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, 'projects.xlsx');
  };

  const columns = [
    { field: '_id', headerName: 'Project ID', width: 200 },
    { field: 'projectName', headerName: 'Project Name', width: 250 },
    { 
      field: 'budget', 
      headerName: 'Budget', 
      width: 150, 
      renderCell: (params) => `₱${params.value.toLocaleString()}`
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 400,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button variant="contained" color="primary" size="small" onClick={() => handleOpenClientModal(params.row)}>
            Client Details
          </Button>
          <Button variant="contained" color="success" size="small" onClick={() => handleOpenMaterialsModal(params.row)}>
            Materials
          </Button>
          <Button variant="contained" color="secondary" size="small" onClick={() => handleOpenContractorModal(params.row)}>
            Contractor
          </Button>
          <Button variant="contained" color="warning" size="small">
            View 3D
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Project Management</h1>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField 
          sx={{ bgcolor: 'white', borderRadius: 1 }} 
          placeholder="Search Table" 
          value={searchQuery}
          onChange={handleSearch}
        />
        <Button variant="contained" color="info" onClick={exportToExcel} sx={{ backgroundColor: '#007FFF', color: 'white' }}>
          Export to Excel
        </Button>
      </Box>
      <DataGrid 
        rows={filteredProjects} 
        columns={columns} 
        getRowId={(row) => row._id} 
        pageSize={5} 
        rowsPerPageOptions={[5, 10, 20]} 
        checkboxSelection 
        sx={{ 
          color: 'black', 
          borderColor: 'white', 
          '& .MuiDataGrid-cell': { 
            color: 'white', 
            textAlign: 'center', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
          }, 
          '& .MuiDataGrid-columnHeaders': { 
            backgroundColor: '#333' 
          } 
        }} 
      />

      {/* Client Details Modal */}
      <Modal open={openClientModal} onClose={handleCloseClientModal}>
        <Box sx={{ ...modalStyle, width: '50%', maxWidth: 600, p: 4 }}>
          <Typography variant="h6" className="mb-4 font-semibold text-center">Client Details</Typography>
          {selectedProject && selectedProject.clientDetails ? (
            <Box sx={{ mt: 2 }}>
              <Typography>Name: {selectedProject.clientDetails.clientName}</Typography>
              <Typography>Email: {selectedProject.clientDetails.email}</Typography>
              <Typography>Phone: {selectedProject.clientDetails.phoneNumber}</Typography>
              <Typography>Company: {selectedProject.clientDetails.companyName}</Typography>
            </Box>
          ) : (
            <Typography>No client details available.</Typography>
          )}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleCloseClientModal}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Materials Modal */}
      <Modal open={openMaterialsModal} onClose={handleCloseMaterialsModal}>
        <Box sx={{ ...modalStyle, width: '50%', maxWidth: 600, p: 4 }}>
          <Typography variant="h6" className="mb-4 font-semibold text-center">Materials</Typography>
          {selectedProject && selectedProject.materials ? (
            <Box sx={{ mt: 2 }}>
              {selectedProject.materials.map((material, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography>Material: {material.material}</Typography>
                  <Typography>Quantity: {material.quantity}</Typography>
                  <Typography>Unit Price: ₱{material.unitPrice.toLocaleString()}</Typography>
                  <Typography>Total Price: ₱{material.totalPrice.toLocaleString()}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography>No materials available.</Typography>
          )}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleCloseMaterialsModal}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Contractor Modal */}
      <Modal open={openContractorModal} onClose={handleCloseContractorModal}>
        <Box sx={{ ...modalStyle, width: '50%', maxWidth: 600, p: 4 }}>
          <Typography variant="h6" className="mb-4 font-semibold text-center">Contractor Details</Typography>
          {selectedProject && selectedProject.contractorDetails ? (
            <Box sx={{ mt: 2 }}>
              <Typography>Name: {selectedProject.contractorDetails.contractorName}</Typography>
              <Typography>Email: {selectedProject.contractorDetails.email}</Typography>
              <Typography>Phone: {selectedProject.contractorDetails.phoneNumber}</Typography>
              <Typography>Company: {selectedProject.contractorDetails.companyName}</Typography>
            </Box>
          ) : (
            <Typography>No contractor details available.</Typography>
          )}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleCloseContractorModal}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}