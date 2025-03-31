import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { backendUrl, userData } = useContext(AppContext);

  const {
    clientName,
    email,
    phoneNumber,
    companyName,
    projectName,
    locationSize,
    projectBudget,
    projectDescription,
    result,
    designStyle,
  } = location.state || {};

  const [openDialog, setOpenDialog] = useState(false);
  const [contractors, setContractors] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [infoDialog, setInfoDialog] = useState({ open: false, content: '' });
  const [loading, setLoading] = useState(false);

  // Fetch contractors on component mount
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

  // Handle project confirmation
  const handleConfirm = async () => {
    if (!selectedContractor) {
      toast.error('Please select a contractor before confirming.');
      return;
    }

    setOpenDialog(false);
    setLoading(true);

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
        materials: Object.entries(result.materials).map(([material, details]) => ({
          material,
          quantity: details.quantity,
          unitPrice: details.unit_price,
          totalPrice: details.total_price,
        })),
        totalCost: result.total_cost,
        userId: userData._id,
        contractorId: selectedContractor?._id,
      };

      const response = await axios.post(`${backendUrl}/api/project/create`, projectData);

      if (response.status === 201) {
        const userProjectsResponse = await fetch(
          `${backendUrl}/api/project/get-user-projects/${userData._id}`,
          { credentials: 'include' }
        );
        const userProjectsData = await userProjectsResponse.json();

        if (userProjectsData.success) {
          const createdProject = userProjectsData.projects.find(
            (p) => p.projectName === projectName
          );
          if (createdProject) {
            navigate('/user/project-overview', { state: createdProject });
          } else {
            console.error('New project not found in user projects list.');
          }
        } else {
          console.error('Failed to fetch updated user projects.');
        }
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      console.error('Error processing request:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare material data for the chart
  const materialData = result
    ? Object.entries(result.materials)
        .map(([material, details]) => ({
          name: material,
          quantity: details.quantity,
        }))
        .sort((a, b) => b.quantity - a.quantity) // Sort in descending order
    : [];

  return (
    <div className="container mx-auto">
      {/* Header */}
      <img className="rounded-lg mb-4 w-full" src="/project images/H6.png" alt="CiviModeler H5" />

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Side - Client, Project & Contractor Details */}
        <div className="lg:col-span-1 flex flex-col h-full">
          {/* Project Configuration */}
          <ProjectConfiguration
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            handleConfirm={handleConfirm}
          />

          {/* Project Details */}
          <ProjectDetails
            projectName={projectName}
            locationSize={locationSize}
            projectBudget={projectBudget}
            projectDescription={projectDescription}
            designStyle={designStyle}
            setInfoDialog={setInfoDialog}
          />

          {/* Contractor Selection */}
          <ContractorSelection
            contractors={contractors}
            selectedContractor={selectedContractor}
            setSelectedContractor={setSelectedContractor}
            setInfoDialog={setInfoDialog}
          />

          {/* Contractor Modal */}
          {selectedContractor && infoDialog.open && (
            <ContractorModal
              selectedContractor={selectedContractor}
              setInfoDialog={setInfoDialog}
            />
          )}
        </div>

        {/* Right Side - Graph & Material Table */}
        <div className="lg:col-span-2 flex flex-col h-full">
          {/* Material Graph */}
          <MaterialGraph materialData={materialData} />

          {/* Material Table */}
          <MaterialTable result={result} />
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && <LoadingSpinner />}
    </div>
  );
}

// Component: Project Configuration
function ProjectConfiguration({ openDialog, setOpenDialog, handleConfirm }) {
  return (
    <div className="bg-white p-4 shadow-lg rounded-lg mb-4">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold">Project Configuration</h2>
        <button onClick={() => setOpenDialog(true)}>⋮</button>
      </div>
      <div className="mt-4">
        <p className="text-gray-600 text-sm">
          Clicking "Confirm" will save all project details, including client, contractor, and
          material data, and create a new record in the database.
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <button
          className="px-4 py-2 bg-purple-700 text-white font-bold rounded hover:bg-purple-800 transition-all"
          onClick={() => setOpenDialog(true)}
        >
          Confirm
        </button>
      </div>

      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <h2 className="text-lg font-semibold border-b pb-2">Confirm Project Save</h2>
            <p className="mt-4 text-gray-600">
              Are you sure you want to save this project? This action will create a permanent
              record in the database with all provided information.
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
    </div>
  );
}

// Component: Project Details
function ProjectDetails({
  projectName,
  locationSize,
  projectBudget,
  projectDescription,
  designStyle,
  setInfoDialog,
}) {
  return (
    <div className="mt-4 bg-white p-4 shadow-lg rounded-lg">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold">Project Details</h2>
        <button
          onClick={() =>
            setInfoDialog({
              open: true,
              content:
                'Project details outline the scope, budget, and design style for planning and execution.',
            })
          }
        >
          ⋮
        </button>
      </div>
      <div className="mt-4">
        <p>
          <strong>Project Name:</strong> {projectName}
        </p>
        <p>
          <strong>Location Size:</strong> {locationSize} sqft
        </p>
        <p>
          <strong>Project Budget:</strong> ₱{projectBudget}
        </p>
        <p>
          <strong>Project Description:</strong> {projectDescription}
        </p>
        <p>
          <strong>Design Style:</strong> {designStyle}
        </p>
      </div>
    </div>
  );
}

// Component: Contractor Selection
function ContractorSelection({
  contractors,
  selectedContractor,
  setSelectedContractor,
  setInfoDialog,
}) {
  return (
    <div className="mt-4 bg-white p-4 shadow-lg rounded-lg">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold">Choose a Contractor</h2>
        <button
          onClick={() =>
            setInfoDialog({
              open: true,
              content: 'Select a contractor for your project before confirming.',
            })
          }
        >
          ⋮
        </button>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-purple-700 text-white">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Office Address</th>
              <th className="p-2">Contact Number</th>
              <th className="p-2">Email</th>
              <th className="p-2">Website</th>
              <th className="p-2">Facebook</th>
              <th className="p-2">Notable Projects</th>
              <th className="p-2">Services</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contractors.map((contractor) => (
              <tr key={contractor._id} className="border-b border-gray-300">
                <td className="p-2">{contractor.name}</td>
                <td className="p-2">{contractor.officeAddress}</td>
                <td className="p-2">{contractor.contactNumber}</td>
                <td className="p-2">{contractor.email}</td>
                <td className="p-2">{contractor.website}</td>
                <td className="p-2">{contractor.facebook}</td>
                <td className="p-2">{contractor.notableProjects.join(', ')}</td>
                <td className="p-2">{contractor.services.join(', ')}</td>
                <td className="p-2">
                  <button
                    className={`px-4 py-2 rounded ${
                      selectedContractor?._id === contractor._id
                        ? 'bg-purple-700 text-white'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    onClick={() => setSelectedContractor(contractor)}
                  >
                    {selectedContractor?._id === contractor._id ? 'Selected' : 'Select'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Component: Contractor Modal
function ContractorModal({ selectedContractor, setInfoDialog }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold border-b pb-2">{selectedContractor.name}</h2>
        <div className="mt-4">
          <p>
            <strong>Office Address:</strong> {selectedContractor.officeAddress}
          </p>
          <p>
            <strong>Contact Number:</strong> {selectedContractor.contactNumber}
          </p>
          <p>
            <strong>Email:</strong> {selectedContractor.email || 'N/A'}
          </p>
          <p>
            <strong>Website:</strong>{' '}
            {selectedContractor.website ? (
              <a
                href={selectedContractor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {selectedContractor.website}
              </a>
            ) : (
              'N/A'
            )}
          </p>
          <p>
            <strong>Facebook:</strong>{' '}
            {selectedContractor.facebook ? (
              <a
                href={selectedContractor.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {selectedContractor.facebook}
              </a>
            ) : (
              'N/A'
            )}
          </p>
          <p>
            <strong>Notable Projects:</strong> {selectedContractor.notableProjects.join(', ')}
          </p>
          <p>
            <strong>Services:</strong> {selectedContractor.services.join(', ')}
          </p>
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
  );
}

// Component: Material Graph
function MaterialGraph({ materialData }) {
  return (
    <div className="bg-white p-4 shadow-lg rounded-lg relative z-0">
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
  );
}

// Component: Material Table
function MaterialTable({ result }) {
  return (
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
            {result &&
              Object.entries(result.materials).map(([material, details]) => (
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
  );
}

// Component: Loading Spinner
function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-purple-700 rounded-full animate-spin"></div>
        <p className="mt-2 text-white">Saving project...</p>
      </div>
    </div>
  );
}