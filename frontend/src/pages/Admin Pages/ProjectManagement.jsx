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
            const projectsData = response.data;

            // Fetch user details for each project
            const projectsWithUserNames = await Promise.all(projectsData.map(async (project) => {
                if (project.userId) {
                    try {
                        const userResponse = await axios.get(`${backendUrl}/api/user/${project.userId}`);
                        project.userName = userResponse.data.user.name || 'N/A';
                    } catch (error) {
                        console.error('Error fetching user:', error);
                        project.userName = 'N/A';
                    }
                } else {
                    project.userName = 'N/A';
                }
                return project;
            }));

            setProjects(projectsWithUserNames);
            setFilteredProjects(projectsWithUserNames);
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
  
      // **Enhanced Header with Logo and Title**
      const logoPath = '/images/CiviModeler - NBG.png';
      const logoWidth = 60;
      const logoHeight = 60;
      doc.addImage(logoPath, 'PNG', margin, currentY, logoWidth, logoHeight);
  
      // Modern Typography for Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.setTextColor(44, 62, 80); // Dark blue-gray for professionalism
      doc.text("Project Documentation", margin + logoWidth + 15, currentY + 40);
  
      currentY += 70;
  
      // Professional header divider
      doc.setLineWidth(1.5);
      doc.setDrawColor(52, 152, 219); // Professional blue
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 25;
  
      // Document metadata with elegant typography
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      const date = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      doc.text(`Generated: ${date}`, margin, currentY);
      doc.text(`Project ID: ${project._id}`, pageWidth - margin - 200, currentY);
  
      currentY += 40;
  
      // Primary Project Information with improved styling
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      doc.text("Project Information", margin, currentY);
      currentY += 15;
  
      // Sophisticated background for information sections
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(margin - 10, currentY - 5, pageWidth - (margin * 2) + 20, 70, 3, 3, 'F');
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(70, 70, 70);
      const details = [
        `Project Name: ${project.projectName || 'N/A'}`,
        `Contractor: ${contractorName}`,
        `Total Cost: ${project.totalCost?.toLocaleString()} (Value in local currency)`
      ];
      details.forEach(text => {
        doc.text(text, margin, currentY);
        currentY += 18;
      });
  
      // Subtle section divider
      doc.setLineDashPattern([1, 1], 0);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, currentY + 10, pageWidth - margin, currentY + 10);
      doc.setLineDashPattern([], 0);
      currentY += 30;
  
      // Additional specifications section with consistent styling
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      doc.text("Project Specifications", margin, currentY);
      currentY += 15;
  
      // Consistent styling for secondary information
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(margin - 10, currentY - 5, pageWidth - (margin * 2) + 20, 90, 3, 3, 'F');
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(70, 70, 70);
      const projectDetails = [
        `Location Size: ${project.size || 'N/A'}`,
        `Budget Allocation: ${project.budget?.toLocaleString() || 'N/A'} (Value in local currency)`,
        `Design Style: ${project.style || 'N/A'}`,
        `Description: ${project.projectDescription || 'N/A'}`
      ];
      projectDetails.forEach(text => {
        doc.text(text, margin, currentY);
        currentY += 18;
      });
  
      // Subtle section divider
      doc.setLineDashPattern([1, 1], 0);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, currentY + 10, pageWidth - margin, currentY + 10);
      doc.setLineDashPattern([], 0);
      currentY += 30;
      
      // **ENHANCED: Executive Summary Section with professional styling**
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      doc.text("Executive Summary", margin, currentY);
      currentY += 15;
      
      // Elegant accent line
      doc.setDrawColor(52, 152, 219);
      doc.setLineWidth(0.75);
      doc.line(margin, currentY, margin + 120, currentY);
      currentY += 15;
      
      // Premium background with subtle gradient effect
      doc.setFillColor(244, 246, 248);
      doc.roundedRect(margin - 10, currentY - 5, pageWidth - (margin * 2) + 20, 140, 5, 5, 'F');
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(70, 70, 70);
      
      // Create a professional executive summary based on project details
      const synthesisText = 
        `The ${project.projectName || 'Project'} integrates ${project.style || 'contemporary'} design principles ` + 
        `across its ${project.size || 'specified'} dimensions to achieve optimal spatial efficiency. With a total valuation of ` + 
        `${project.totalCost?.toLocaleString() || '0'}, this project incorporates premium-grade materials and expert craftsmanship ` +
        `to ensure structural integrity and aesthetic excellence. Under the management of ${contractorName}, all construction ` +
        `phases will be executed in strict adherence to established industry protocols and regulatory requirements.\n\n` +
        
        `A distinguishing feature of this project is its strategic balance of form and function, with particular emphasis on ` +
        `material quality and sustainable practices. The allocated budget of ${project.budget?.toLocaleString() || 'N/A'} ` +
        `has been methodically distributed to maximize efficiency without compromising the established quality benchmarks.\n\n` +
        
        `This development represents a significant capital investment that promises substantial long-term returns through enhanced ` +
        `functionality and market value appreciation, fully aligned with the strategic objectives and specifications.`;
        
      const textLines = doc.splitTextToSize(synthesisText, pageWidth - 2 * margin - 20);
      doc.text(textLines, margin + 10, currentY + 15);
      currentY += textLines.length * 13 + 30;
  
      // **Material Specifications Table with professional styling**
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(44, 62, 80);
      doc.text("Material Specifications", margin, currentY);
      currentY += 15;
  
      const materialRows = project.materials?.map(material => [
        material.material,
        material.quantity.toString(),
        material.unitPrice.toLocaleString(),
        material.totalPrice.toLocaleString()
      ]) || [];
  
      doc.autoTable({
        startY: currentY,
        head: [['Material', 'Quantity', 'Unit Price', 'Total']],
        body: materialRows,
        theme: 'grid',
        headStyles: { 
          fillColor: [52, 73, 94], // Dark blue-gray for professional headers
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center'
        },
        styles: { 
          font: "helvetica", 
          fontSize: 10, 
          cellPadding: 8,
          lineColor: [220, 220, 220]
        },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        margin: { left: margin, right: margin },
        didDrawPage: (data) => {
          // Professional footer with page numbers and branding
          doc.setFontSize(9);
          doc.setTextColor(120, 120, 120);
          doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth - margin - 40, pageHeight - 20);
          
          // Company branding in footer
          doc.setFontSize(9);
          doc.setTextColor(44, 62, 80);
          doc.setFont('helvetica', 'bold');
          doc.text("CiviModeler Professional Documentation", margin, pageHeight - 20);
        }
      });
  
      // Save the document with a professional filename
      const safeProjectName = (project.projectName || 'Project').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      doc.save(`CiviModeler_${safeProjectName}_Documentation.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Error generating PDF: ${error.message}`);
    }
  };

  const columns = [
    { field: 'userName', headerName: 'Name', flex: 1, minWidth: 180 },
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
        <Box display="flex" justifyContent="space-between" gap={1} width="%">
          <Button variant="contained" size="small" sx={{ bgcolor: 'primary.main' }} onClick={() => handleOpenMaterialsModal(params.row)}>
            Project Overview
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
                      <td style={{ border: '1px solid black', padding: '8px' }}>{material.unitPrice.toLocaleString()}</td>
                      <td style={{ border: '1px solid black', padding: '8px' }}>{material.totalPrice.toLocaleString()}</td>
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