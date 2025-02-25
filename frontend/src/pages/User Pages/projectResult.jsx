import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Result() {
  const location = useLocation();
  const { backendUrl, userData } = useContext(AppContext);
  const { clientName, email, phoneNumber, companyName, projectName, locationSize, projectBudget, projectDescription, result, designStyle } = location.state || {};

  const [openDialog, setOpenDialog] = useState(false);
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [infoDialog, setInfoDialog] = useState({ open: false, content: '' });

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/contractor/all`);
        setContractors(response.data);
      } catch (error) {
        console.error('Error fetching contractors:', error);
      }
    };

    fetchContractors();
  }, [backendUrl]);

  const handleConfirm = async () => {
    setOpenDialog(true);
    try {
      if (!userData) {
        console.error('User data not available');
        return;
      }

      const projectData = {
        projectName,
        size: Number(locationSize),
        budget: Number(projectBudget),
        style: designStyle,
        projectDescription,
        author: userData.name,
        clientDetails: { clientName, email, phoneNumber, companyName },
        materials: Object.entries(result.materials).map(([material, details]) => ({
          material,
          quantity: details.quantity,
          unitPrice: details.unit_price,
          totalPrice: details.total_price
        })),
        totalCost: result.total_cost,
        userId: userData._id,
        contractorId: selectedContractor?._id
      };

      const response = await axios.post(`${backendUrl}/api/project/create`, projectData);

      if (response.status === 201) {
        alert('Data saved to your account.');
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      console.error('Error processing request:', error);
    }
    setOpenDialog(false);
  };

  const materialData = result
    ? Object.entries(result.materials).map(([material, details]) => ({
      name: material,
      quantity: details.quantity
    }))
    : [];

  return (
    <div className="container mx-auto">
      {/* Header */}
      <img className="rounded-lg mb-4 w-full" src="/project images/H5.png" alt="CiviModeler H5" />

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left Side - Client, Project & Contractor Details */}
        <div className="lg:col-span-1 flex flex-col h-full">

          {/* Client Details */}
          <div className="bg-white p-4 shadow-lg rounded-lg">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold">Client Details</h2>
              <button onClick={() => setInfoDialog({ open: true, content: 'Client details include essential contact information for project management.' })}>⋮</button>
            </div>
            <div className="mt-4">
              <p><strong>Name:</strong> {clientName}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Phone Number:</strong> {phoneNumber}</p>
              <p><strong>Company Name:</strong> {companyName}</p>
            </div>
          </div>

          {/* Project Details */}
          <div className="mt-4 bg-white p-4 shadow-lg rounded-lg">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold">Project Details</h2>
              <button onClick={() => setInfoDialog({ open: true, content: 'Project details outline the scope, budget, and design style for planning and execution.' })}>⋮</button>
            </div>
            <div className="mt-4">
              <p><strong>Project Name:</strong> {projectName}</p>
              <p><strong>Location Size:</strong> {locationSize} sqft</p>
              <p><strong>Project Budget:</strong> ₱{projectBudget}</p>
              <p><strong>Project Description:</strong> {projectDescription}</p>
              <p><strong>Design Style:</strong> {designStyle}</p>
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
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
                    className="px-4 py-2 bg-purple-700 text-white rounded"
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
          {/* Material Graph */}
          <div className="bg-white p-4 shadow-lg rounded-lg">
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

          {/* Material Table */}
          <div className="mt-4 bg-white p-4 shadow-lg rounded-lg">
            <h2 className="text-lg font-semibold border-b pb-2">Material Table</h2>
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-purple-700">
                  <tr className=''>
                    <th className="p-2">Material</th>
                    <th className="p-2">Quantity</th>
                    <th className="p-2">Unit Price (₱)</th>
                    <th className="p-2">Total Price (₱)</th>
                  </tr>
                </thead>
                <tbody>
                  {result && Object.entries(result.materials).map(([material, details]) => (
                    <tr key={material} className="border-b border-gray-300">
                      <td className="p-2">{material}</td>
                      <td className="p-2">{details.quantity}</td>
                      <td className="p-2">{details.unit_price.toFixed(2)}</td>
                      <td className="p-2">{details.total_price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                {/* Total Cost Row */}
                <tfoot>
                  <tr className="bg-gray-200 font-bold">
                    <td colSpan={3} className="p-2 text-left">Total Estimated Cost</td>
                    <td className="p-2">₱{result?.total_cost.toFixed(2) || '0.00'}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Confirm Button */}
      <div className="text-center mt-6">
        <button className="px-6 py-2 bg-purple-700 text-white font-bold rounded hover:bg-purple-800" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
}
