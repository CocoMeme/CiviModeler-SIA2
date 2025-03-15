import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';
import ModalCreate3D from './ModalCreate3D';
import DeleteProject from './DeleteProject';
import axios from "axios";
import ProjectConfiguration from './ProjectConfiguration';
import { FiInfo, FiUsers, FiCpu, FiPackage, FiBarChart2 } from 'react-icons/fi';
applyPlugin(jsPDF)


const ProjectContent = ({
  clientDetailsState,
  projectDetailsState,
  contractors,
  selectedContractor,
  setSelectedContractor,
  handleClientDetailsChange,
  handleProjectDetailsChange,
  handleGoTo3D,
  handleGenerate3D,
  handleConfirm,
  openDialog,
  setOpenDialog,
  infoDialog,
  setInfoDialog,
  materials,
  totalCost,
  sloyd,
  materialData
}) => {
  const [showCreate3DModal, setShowCreate3DModal] = useState(!sloyd?.modelUrl);

  const handleGeneratePDF = async () => {
    try {
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
      currentY += 20;
  
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
          `Project Name: ${projectDetailsState.projectName || 'N/A'}`,
          `Contractor: ${selectedContractor?.name || 'N/A'}`,
          `Total Cost: ${(totalCost?.toFixed(2) || '0.00')}`
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
          `Location Size: ${projectDetailsState.size || 'N/A'}`,
          `Budget: ${projectDetailsState.budget || 'N/A'}`,
          `Design Style: ${projectDetailsState.style || 'N/A'}`,
          `Description: ${projectDetailsState.projectDescription || 'N/A'}`
      ];
      projectDetails.forEach(text => {
          doc.text(text, margin, currentY);
          currentY += 18;
      });
  
      // **Section Divider**
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 20;
  
      // **Synthesis Section**
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(102, 51, 153);
      doc.text("Project Synthesis", margin, currentY);
      currentY += 15;
  
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const synthesisText = 
          `The ${projectDetailsState.projectName || 'Project'} is an ambitious and stylish residential design tailored to reflect elegance and charm. ` +
          `Commissioned by the client, this project is a collaboration with ${clientDetailsState.companyName || 'a company'}, ` +
          `ensuring high-quality execution under the expertise of ${selectedContractor?.name || 'a contractor'}. The client envisions a ${projectDetailsState.style || 'design'} ` +
          `that encapsulates both modern comfort and timeless aesthetics.\n\n` +
  
          `With a total budget of ${(projectDetailsState.budget || 'N/A')}, the ${projectDetailsState.projectName || 'house'} spans ${projectDetailsState.size || 'N/A'} ` +
          `square meters, maximizing the use of space while ensuring a functional and aesthetically appealing structure. The home's ${projectDetailsState.projectDescription || 'design details'} ` +
          `further highlight the attention to detail and craftsmanship involved in bringing this vision to life.\n\n` +
  
          `The project's financial plan, totaling $${totalCost?.toFixed(2) || '0.00'}, ensures that high-quality materials and labor contribute to its successful execution. ` +
          `By combining careful architectural planning, quality craftsmanship, and a well-defined budget, the ${projectDetailsState.projectName || 'project'} is set to be a blend ` +
          `of elegance and functionality, reflecting the client's vision in a remarkable way.`;
  
      const textLines = doc.splitTextToSize(synthesisText, pageWidth - 2 * margin);
      doc.text(textLines, margin, currentY);
      currentY += textLines.length * 14;
  
      // **Material Table**
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(102, 51, 153);
      doc.text("Material Table", margin, currentY);
      currentY += 15;
  
      const materialRows = Object.entries(materials || {}).map(([material, details]) => [
          details.material,
          details.quantity.toString(),
          `${details.unitPrice.toFixed(2)}`,
          `${details.totalPrice.toFixed(2)}`
      ]);
  
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
              doc.text(`Page ${doc.internal.getNumberOfPages()}`, pageWidth - margin - 40, pageHeight - 20);
          }
      });
  
      // Download the 3D model
      if (sloyd?.modelUrl) {
          const link = document.createElement('a');
          link.href = sloyd.modelUrl;
          link.download = '3D_Model.glb';
          link.click();
      }
  
      // Save the document
      doc.save('User_report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Error generating PDF: ${error.message}`);
    }
  };
  

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left Side - Client, Project & Contractor Details */}
      <div className="lg:col-span-1 flex flex-col h-full">
        {/* Replace old configuration section with new component */}
        <ProjectConfiguration 
          projectDetailsState={projectDetailsState}
          handleGenerate3D={handleGenerate3D}
          handleGoTo3D={handleGoTo3D}
          setOpenDialog={setOpenDialog}
          handleGeneratePDF={handleGeneratePDF}
          setInfoDialog={setInfoDialog}
        />

        {/* Confirmation Modal */}
        {openDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
              <h2 className="text-lg font-semibold border-b pb-2">Confirm Project Update</h2>
              <p className="mt-4 text-gray-600">
                Are you sure you want to update this project? This will replace the existing data in the database with your current changes.
              </p>
              <div className="flex justify-end mt-6 gap-2">
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-all"
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition-all"
                  onClick={handleConfirm}
                >
                  Yes, Update Project
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Project Details */}
        <div className="mt-4 bg-white p-4 shadow-lg rounded-lg">
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center space-x-3">
              <FiInfo className="w-5 h-5 text-gray-800" />
              <h2 className="text-lg font-semibold">Project Details</h2>
            </div>
            <button onClick={() => setInfoDialog({ open: true, content: 'Project details outline the scope, budget, and design style for planning and execution.' })}>⋮</button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 items-center">
            <label className="text-left pr-2 col-span-1"><strong>Project Name:</strong></label>
            <input type="text" name="projectName" value={projectDetailsState.projectName || ''} onChange={handleProjectDetailsChange} className="col-span-2 w-full p-2 border rounded" />

            <label className="text-left pr-2 col-span-1"><strong>Location Size:</strong></label>
            <input type="number" name="size" value={projectDetailsState.size || ''} onChange={handleProjectDetailsChange} className="col-span-2 w-full p-2 border rounded" />

            <label className="text-left pr-2 col-span-1"><strong>Project Budget:</strong></label>
            <input type="number" name="budget" value={projectDetailsState.budget || ''} onChange={handleProjectDetailsChange} className="col-span-2 w-full p-2 border rounded" />

            <label className="text-left pr-2 col-span-1"><strong>Design Style:</strong></label>
            <input type="text" name="style" value={projectDetailsState.style || ''} onChange={handleProjectDetailsChange} className="col-span-2 w-full p-2 border rounded" />

            <label className="text-left pr-2 col-span-1"><strong>Project Description:</strong></label>
            <textarea name="projectDescription" value={projectDetailsState.projectDescription || ''} onChange={handleProjectDetailsChange} className="col-span-2 w-full p-2 border rounded" />
          </div>
        </div>

        {/* Contractor Selection */}
        <div className="mt-4 bg-white p-4 shadow-lg rounded-lg">
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center space-x-3">
              <FiUsers className="w-5 h-5 text-gray-800" />
              <h2 className="text-lg font-semibold">Choose a Contractor</h2>
            </div>
            <button onClick={() => setInfoDialog({ open: true, content: 'Select a contractor for your project before confirming.' })}>⋮</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.isArray(contractors) && contractors.length > 0 ? (
              contractors.map((contractor) => (
                <button
                  key={contractor._id}
                  className={`p-2 border rounded w-full text-left transition-all duration-300 ${
                    selectedContractor?._id === contractor._id 
                      ? 'bg-purple-700 text-white' 
                      : 'bg-white hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setSelectedContractor(contractor);
                    setInfoDialog({ open: true, content: '' });
                  }}
                >
                  <h2 className='font-bold'>{contractor.name}</h2>
                  <p>
                    <span className="font-sm">License Number:</span> {contractor.licenseNumber}
                  </p>
                </button>
              ))
            ) : (
              <p className="text-gray-500 italic">No contractors available. Please check back later.</p>
            )}
          </div>
        </div>

        {/* Contractor Modal */}
        {selectedContractor && infoDialog.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
              <h2 className="text-lg font-semibold border-b pb-2">{selectedContractor.name}</h2>
              <div className="mt-4">
                <p><strong>License Number:</strong> {selectedContractor.licenseNumber}</p>
                <p><strong>Business Address:</strong> {selectedContractor.businessAddress}</p>
                <p><strong>Contact Number:</strong> {selectedContractor.contactNumber}</p>
                <p><strong>Experience:</strong> {selectedContractor.experience}</p>
                <p className="text-gray-500 text-sm italic">Years of experience may vary based on project type and location.</p>
                <p><strong>Contract Terms:</strong> {selectedContractor.contractTerms}</p>
              </div>
              <div className="text-right mt-4">
                <button
                  className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800 transition-all"
                  onClick={() => setInfoDialog({ open: false, content: '' })}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Side - Graph & Material Table */}
      <div className="lg:col-span-2 flex flex-col h-full">
        {/* 3D Model Creation Modal */}
        <ModalCreate3D 
          isOpen={showCreate3DModal}
          onClose={() => setShowCreate3DModal(false)}
        />

        {/* Sloyd Details */}
        <div className=" bg-white p-4 shadow-lg rounded-lg">
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center space-x-3">
              <FiCpu className="w-5 h-5 text-gray-800" />
              <h2 className="text-lg font-semibold">Sloyd Details</h2>
            </div>
            <button onClick={() => setInfoDialog({ open: true, content: 'Project details outline the scope, budget, and design style for planning and execution.' })}>⋮</button>
          </div>
          <div className="mt-4">
            <p><strong>Interaction ID:</strong> {sloyd?.interactionId}</p>
            <p><strong>Confidence Score:</strong> {sloyd?.confidenceScore}</p>
            <p><strong>Response Encoding:</strong> {sloyd?.responseEncoding}</p>
            <p><strong>Model Output Type:</strong> {sloyd?.modelOutputType}</p>
            <p><strong>Model URL:</strong> <a href={sloyd?.modelUrl} target="_blank" rel="noopener noreferrer">{sloyd?.modelUrl}</a></p>
          </div>
        </div>

        {/* Material Table */}
        <div className="mt-4 bg-white p-4 shadow-lg rounded-lg">
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center space-x-3">
              <FiPackage className="w-5 h-5 text-gray-800" />
              <h2 className="text-lg font-semibold">Material Table</h2>
            </div>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-purple-700">
                <tr>
                  <th className="p-2">Material</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Unit Price</th>
                  <th className="p-2">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {materials && Object.entries(materials).map(([material, details]) => (
                  <tr key={material} className="border-b border-gray-300">
                    <td className="p-2">{details.material}</td>
                    <td className="p-2">{details.quantity}</td>
                    <td className="p-2">{details.unitPrice.toFixed(2)}</td>
                    <td className="p-2"> {details.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-200 font-bold">
                  <td colSpan={3} className="p-2 text-left">Total Estimated Cost</td>
                  <td className="p-2"> {totalCost?.toFixed(2) || '0.00'}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Material Graph */}
        <div className="bg-white p-4 shadow-lg rounded-lg relative z-0 mt-4">
          <div className="flex justify-between items-center border-b pb-2">
            <div className="flex items-center space-x-3">
              <FiBarChart2 className="w-5 h-5 text-gray-800" />
              <h2 className="text-lg font-semibold">Material Quantity Breakdown</h2>
            </div>
          </div>
          <div className="flex-grow flex justify-center items-center">
            <ResponsiveContainer width="100%" height={450}>
              <BarChart layout="vertical" data={materialData}>
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantity" fill="#9c27b0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectContent;