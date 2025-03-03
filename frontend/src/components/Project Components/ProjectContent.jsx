import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import { applyPlugin } from 'jspdf-autotable'
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

  const handleGeneratePDF = () => {
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
            `Project Name: ${projectDetailsState.projectName || 'N/A'}`,
            `Client Name: ${clientDetailsState.clientName || 'N/A'}`,
            `Contractor: ${selectedContractor?.name || 'N/A'}`,
            `Total Cost: ₱${(totalCost?.toFixed(2) || '0.00')}`
        ];
        details.forEach(text => {
            doc.text(text, margin, currentY);
            currentY += 18;
        });

        // **Section Divider**
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 20;

        // **Client Details**
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(102, 51, 153);
        doc.text("Client Details", margin, currentY);
        currentY += 15;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        const clientDetails = [
            `Email: ${clientDetailsState.email || 'N/A'}`,
            `Phone: ${clientDetailsState.phoneNumber || 'N/A'}`,
            `Company: ${clientDetailsState.companyName || 'N/A'}`
        ];
        clientDetails.forEach(text => {
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
            `Budget: ₱${projectDetailsState.budget || 'N/A'}`,
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

        // **Material Table**
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(102, 51, 153);
        doc.text("Material Table", margin, currentY);
        currentY += 15;

        const materialRows = Object.entries(materials || {}).map(([_, details]) => [
            details.material,
            details.quantity.toString(),
            `₱${details.unitPrice.toFixed(2)}`,
            `₱${details.totalPrice.toFixed(2)}`
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
            }
        });

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
        {/* Project Configuration */}
        <div className="bg-white p-4 shadow-lg rounded-lg mb-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold">Project Configuration</h2>
            <button onClick={() => setInfoDialog({ open: true, content: 'Configure your project settings before generating a model or confirming the project.' })}>⋮</button>
          </div>
          <div className="mt-4">
            <p className="text-gray-600 text-sm">
              Clicking "Confirm" will save all project details, including client, contractor, and material data, and create a new record in the database.
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-2">
            <button
              className="px-4 py-2 bg-purple-700 text-white font-bold rounded hover:bg-purple-800 transition-all"
              onClick={() => setOpenDialog(true)}
            >
              Update
            </button>
            <button
              className="px-4 py-2 bg-cyan-700 text-white font-bold rounded hover:bg-cyan-800 transition-all"
              onClick={handleGenerate3D}
            >
              Generate 3D Model
            </button>
            <button
              className="px-4 py-2 bg-lime-700 text-white font-bold rounded hover:bg-lime-800 transition-all"
              onClick={handleGoTo3D}
            >
              Go to 3D
            </button>
            {/* Add PDF Generation Button */}
            <button
              className="px-4 py-2 bg-blue-700 text-white font-bold rounded hover:bg-blue-800 transition-all"
              onClick={handleGeneratePDF}
            >
              Generate PDF
            </button>
          </div>
        </div>

        {/* Confirmation Modal */}
        {openDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
              <h2 className="text-lg font-semibold border-b pb-2">Confirm Project Save</h2>
              <p className="mt-4 text-gray-600">
                Are you sure you want to save this project? This action will create a **permanent record** in the database with all provided information.
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
                  Yes, Save Project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Client Details */}
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold">Client Details</h2>
            <button onClick={() => setInfoDialog({ open: true, content: 'Client details include essential contact information for project management.' })}>⋮</button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 items-center">
            <label className="text-left pr-2 col-span-1"><strong>Name:</strong></label>
            <input type="text" name="clientName" value={clientDetailsState.clientName || ''} onChange={handleClientDetailsChange} className="col-span-2 w-full p-2 border rounded" />

            <label className="text-left pr-2 col-span-1"><strong>Email:</strong></label>
            <input type="email" name="email" value={clientDetailsState.email || ''} onChange={handleClientDetailsChange} className="col-span-2 w-full p-2 border rounded" />

            <label className="text-left pr-2 col-span-1"><strong>Phone Number:</strong></label>
            <input type="text" name="phoneNumber" value={clientDetailsState.phoneNumber || ''} onChange={handleClientDetailsChange} className="col-span-2 w-full p-2 border rounded" />

            <label className="text-left pr-2 col-span-1"><strong>Company Name:</strong></label>
            <input type="text" name="companyName" value={clientDetailsState.companyName || ''} onChange={handleClientDetailsChange} className="col-span-2 w-full p-2 border rounded" />
          </div>
        </div>

        {/* Project Details */}
        <div className="mt-4 bg-white p-4 shadow-lg rounded-lg">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold">Project Details</h2>
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
            <h2 className="text-lg font-semibold">Choose a Contractor</h2>
            <button onClick={() => setInfoDialog({ open: true, content: 'Select a contractor for your project before confirming.' })}>⋮</button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {contractors.map((contractor) => (
              <button
                key={contractor._id}
                className={`p-2 border rounded w-full text-left transition-all duration-300 ${selectedContractor?._id === contractor._id ? 'bg-purple-700 text-white' : 'bg-white hover:bg-gray-100'
                  }`}
                onClick={() => setSelectedContractor(contractor)}
              >
                <h2 className='font-bold'>{contractor.name}</h2>
                <p>
                  <span className="font-sm">License Number:</span> {contractor.licenseNumber}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Contractor Modal */}
        {selectedContractor && (
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
                  onClick={() => setSelectedContractor(null)}
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
        {/* Sloyd Details */}
        <div className=" bg-white p-4 shadow-lg rounded-lg">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-lg font-semibold">Sloyd Details</h2>
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
          <h2 className="text-lg font-semibold border-b pb-2">Material Table</h2>
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
                    <td className="p-2">₱ {details.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-200 font-bold">
                  <td colSpan={3} className="p-2 text-left">Total Estimated Cost</td>
                  <td className="p-2">₱ {totalCost?.toFixed(2) || '0.00'}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Material Graph */}
        <div className="bg-white p-4 shadow-lg rounded-lg relative z-0 mt-4">
          <h2 className="text-lg font-semibold border-b pb-2">Material Quantity Breakdown</h2>
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