import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import jsPDF from 'jspdf';
import { applyPlugin } from 'jspdf-autotable'
applyPlugin(jsPDF)

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
  const [contractorDetails, setContractorDetails] = useState(null);
  const [openMaterialsModal, setOpenMaterialsModal] = useState(false);

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

  const handleOpenMaterialsModal = async (project) => {
    setSelectedProject(project);
    if (project.contractorId) {
      try {
        const response = await axios.get(`${backendUrl}/api/contractor/${project.contractorId}`);
        setContractorDetails(response.data.contractor);
      } catch (error) {
        console.error('Error fetching contractor:', error);
      }
    } else {
      setContractorDetails(null);
    }
    setOpenMaterialsModal(true);
  };

  const handleCloseMaterialsModal = () => setOpenMaterialsModal(false);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredProjects);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Projects');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, 'projects.xlsx');
  };

  const handleGeneratePDF = async (project) => {
    if (!project) {
      console.error('No project selected');
      alert('No project selected');
      return;
    }
  
    setSelectedProject(project);
  
    try {
      // Fetch user details using userId from the project
      let userName = 'N/A';
      if (project.userId) {
        try {
          const response = await axios.get(`${backendUrl}/api/user/${project.userId}`);
          userName = response.data.name || 'N/A';
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
  
      // Fetch contractor details if contractorId is present
      let contractorName = 'N/A';
      if (project.contractorId) {
        try {
          const response = await axios.get(`${backendUrl}/api/contractor/${project.contractorId}`);
          contractorName = response.data.contractor.name || 'N/A';
        } catch (error) {
          console.error('Error fetching contractor:', error);
        }
      }
  
      const doc = new jsPDF('p', 'pt', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      let currentY = margin;
  
      // **Add Logo to Header**
      const logoPath = '/images/CiviModeler - NBG.png'; // Your logo path
      const logoWidth = 60;
      const logoHeight = 60;
      doc.addImage(logoPath, 'PNG', margin, currentY, logoWidth, logoHeight);
  
      // **Header Title Beside Logo**
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(102, 51, 153); // Purple color
      doc.text("CiviModeler Project Report", margin + logoWidth + 15, currentY + 40);
  
      currentY += 70; // Move cursor down
  
      // **Styled Header Line**
      doc.setLineWidth(1);
      doc.setDrawColor(102, 51, 153);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 20; // Adjust spacing
  
      // **Move Date Below Divider**
      doc.setFontSize(12);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(0, 0, 0);
      const date = new Date().toLocaleDateString();
      doc.text(`Generated on: ${date}`, margin, currentY);
  
      currentY += 30; // Move cursor down for project details
  
      // **Project Details**
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(102, 51, 153);
      doc.text("Project Details", margin, currentY);
      currentY += 15;
  
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const details = [
        `Project Name: ${project.projectName || 'N/A'}`,
        `Contractor: ${contractorName}`,
        `Total Cost: ${project.totalCost?.toLocaleString() || '0.00'}`
      ];
      details.forEach(text => {
        doc.text(text, margin, currentY);
        currentY += 18;
      });
  
      // **Section Divider**
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 20;
  
      // **Additional Project Details**
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(102, 51, 153);
      doc.text("Additional Project Details", margin, currentY);
      currentY += 15;
  
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const projectDetails = [
        `Location Size: ${project.size || 'N/A'}`,
        `Budget: ${project.budget?.toLocaleString() || 'N/A'}`,
        `Design Style: ${project.style || 'N/A'}`,
        `Description: ${project.projectDescription || 'N/A'}`
      ];
      projectDetails.forEach(text => {
        doc.text(text, margin, currentY);
        currentY += 18;
      });
  
      // **Section Divider**
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 20;
  
      // **Material Table**
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(102, 51, 153);
      doc.text("Material Table", margin, currentY);
      currentY += 15;
  
      const materialRows = project.materials?.map(material => [
        material.material,
        material.quantity.toString(),
        `${material.unitPrice.toFixed(2)}`,
        `${material.totalPrice.toFixed(2)}`
      ]) || [];
  
      doc.autoTable({
        startY: currentY,
        head: [['Material', 'Quantity', 'Unit Price', 'Total Price']],
        body: materialRows,
        theme: 'striped',
        headStyles: { fillColor: [102, 51, 153], textColor: [255, 255, 255] }, // Purple header
        styles: { font: "helvetica", fontSize: 10, cellPadding: 5 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: margin, right: margin },
        didDrawPage: (data) => {
          // Footer
          doc.setFontSize(10);
          doc.setTextColor(102, 51, 153);
          doc.text("This is an autogenerated report by CiviModeler", margin, pageHeight - 20);
        }
      });
  
      // Save the document
      doc.save('User_report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Error generating PDF: ${error.message}`);
    }
  };

  const columns = [
    { field: '_id', headerName: 'Project ID', flex: 1, minWidth: 180 },
    { field: 'projectName', headerName: 'Project Name', flex: 1.5, minWidth: 220 },
    { 
      field: 'budget', 
      headerName: 'Budget', 
      flex: 1, 
      minWidth: 150, 
      renderCell: (params) => `${params.value.toLocaleString()}`
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 2,
      minWidth: 420,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-between" gap={1} width="100%">
          <Button variant="contained" size="small" sx={{ bgcolor: 'primary.main' }} onClick={() => handleOpenMaterialsModal(params.row)}>
            Project Overview
          </Button>
          <Button variant="contained" size="small" sx={{ bgcolor: 'warning.main' }}>
            View 3D
          </Button>
          <Button variant="contained" size="small" sx={{ bgcolor: 'primary.main' }} onClick={() => handleGeneratePDF(params.row)}>
            Generate PDF
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
          },
          '& .MuiTablePagination-root, & .MuiTablePagination-caption': {
            color: 'white', // Makes "Rows per page" and pagination text white
          },
          '& .MuiSvgIcon-root': {
            color: 'white', // Makes pagination arrows white
          },
        }} 
      />

      {/* Materials Modal */}
      <Modal open={openMaterialsModal} onClose={handleCloseMaterialsModal}>
        <Box sx={{ ...modalStyle, width: '50%', maxWidth: 600, p: 4 }}>
          <Typography variant="h6" className="mb-4 font-semibold text-center">Project Overview</Typography>
          {selectedProject ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6">Materials</Typography>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid black', padding: '8px', color: 'black' }}>Material</th>
                    <th style={{ border: '1px solid black', padding: '8px', color: 'black' }}>Quantity</th>
                    <th style={{ border: '1px solid black', padding: '8px', color: 'black' }}>Unit Price</th>
                    <th style={{ border: '1px solid black', padding: '8px', color: 'black' }}>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProject.materials.map((material, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid black', padding: '8px' }}>{material.material}</td>
                      <td style={{ border: '1px solid black', padding: '8px' }}>{material.quantity}</td>
                      <td style={{ border: '1px solid black', padding: '8px' }}>₱{material.unitPrice.toLocaleString()}</td>
                      <td style={{ border: '1px solid black', padding: '8px' }}>₱{material.totalPrice.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Typography variant="h6" className="mt-4">Contractor</Typography>
              <Typography>Name: {contractorDetails ? contractorDetails.name : 'N/A'}</Typography>
            </Box>
          ) : (
            <Typography>No project details available.</Typography>
          )}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleCloseMaterialsModal}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}