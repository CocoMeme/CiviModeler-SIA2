import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ProjectOverview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { backendUrl, userData } = useContext(AppContext);
  const projectData = location.state;

  const { clientDetails, materials, totalCost, sloyd, ...rest } = projectData || {};

  const [openDialog, setOpenDialog] = useState(false);
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [infoDialog, setInfoDialog] = useState({ open: false, content: '' });
  const [loading, setLoading] = useState(true);
  const [clientDetailsState, setClientDetailsState] = useState(clientDetails || {});
  const [projectDetailsState, setProjectDetailsState] = useState(rest || {});
  const [projectUpdated, setProjectUpdated] = useState(false);

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

    // Random loading time between 300ms to 1s
    const loadingTime = Math.random() * (1000 - 300) + 300;
    setTimeout(() => setLoading(false), loadingTime);
  }, [backendUrl, projectData._id]); // Add projectData._id to dependencies

  const handleConfirm = async () => {
    try {
      const updatedProject = {
        clientDetails: {
          clientName: clientDetailsState.clientName,
          email: clientDetailsState.email,
          phoneNumber: clientDetailsState.phoneNumber,
          companyName: clientDetailsState.companyName,
        },
        ...projectDetailsState,
      };

      const response = await axios.put(`${backendUrl}/api/project/${projectData._id}`, updatedProject);
      console.log('Project updated successfully:', response.data);
      setOpenDialog(false);
      setProjectUpdated(true); // Set the flag to true
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  // Fetch updated project data when projectUpdated flag is true
  useEffect(() => {
    if (projectUpdated) {
      const fetchUpdatedProject = async () => {
        try {
          const response = await axios.get(`${backendUrl}/api/project/${projectData._id}`);
          const updatedProjectData = response.data;
          setClientDetailsState(updatedProjectData.clientDetails || {});
          setProjectDetailsState(updatedProjectData || {});
          setProjectUpdated(false); // Reset the flag
        } catch (error) {
          console.error('Error fetching updated project data:', error);
        }
      };

      fetchUpdatedProject();
    }
  }, [projectUpdated, backendUrl, projectData._id]);

  const handleClientDetailsChange = (e) => {
    const { name, value } = e.target;
    setClientDetailsState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleProjectDetailsChange = (e) => {
    const { name, value } = e.target;
    setProjectDetailsState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleGoTo3D = () => {
    navigate('/user/project-viewer', { state: { modelUrl: sloyd?.modelUrl } });
  };

  const materialData = materials
    ? Object.entries(materials).map(([material, details]) => ({
      name: material,
      quantity: details.quantity
    }))
    : [];

  return (
    <div className="container mx-auto">
      {/* Header */}
      <img className="rounded-lg mb-4 w-full" src="/project images/H5.png" alt="CiviModeler H5" />

      {/* Loading Animation */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-purple-700 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Main Layout */}
      {!loading && (
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
                  className="px-4 py-2 bg-lime-700 text-white font-bold rounded hover:bg-lime-800 transition-all"
                  onClick={handleGoTo3D}
                >
                  Go to 3D
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
                {/* <p><strong>Thumbnail Preview:</strong> <img src={sloyd?.thumbnailPreview} alt="Thumbnail Preview" /></p> */}
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
                      <th className="p-2">Unit Price (₱)</th>
                      <th className="p-2">Total Price (₱)</th>
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
                  {/* Total Cost Row */}
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
      )}
    </div>
  );
}
