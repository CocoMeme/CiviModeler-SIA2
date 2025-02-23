import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalCost: 0,
  });
  const [contractors, setContractors] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [contractorToDelete, setContractorToDelete] = useState(null);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    licenseNumber: '',
    businessAddress: '',
    contactNumber: '',
    experience: '',
    contractTerms: '',
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/project/dashboard-data`, { withCredentials: true });
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    const fetchContractors = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/contractor/all`, { withCredentials: true });
        console.log('Fetched contractors:', data); // Log the fetched data
        setContractors(data);
      } catch (error) {
        console.error('Error fetching contractors:', error);
      }
    };

    fetchDashboardData();
    fetchContractors();
  }, []);

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateSave = async () => {
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/contractor/create`, formData, { withCredentials: true });
      setContractors([...contractors, data]);
      setOpenCreateModal(false);
      setFormData({
        name: '',
        licenseNumber: '',
        businessAddress: '',
        contactNumber: '',
        experience: '',
        contractTerms: '',
      });
    } catch (error) {
      console.error('Error creating contractor:', error);
    }
  };

  const handleUpdate = (contractor) => {
    setSelectedContractor(contractor);
    setFormData(contractor);
    setOpenUpdateModal(true);
  };

  const handleUpdateSave = async () => {
    try {
      const { data } = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/contractor/update/${selectedContractor._id}`, formData, { withCredentials: true });
      setContractors(contractors.map(contractor => contractor._id === data._id ? data : contractor));
      setOpenUpdateModal(false);
      setSelectedContractor(null);
      setFormData({
        name: '',
        licenseNumber: '',
        businessAddress: '',
        contactNumber: '',
        experience: '',
        contractTerms: '',
      });
    } catch (error) {
      console.error('Error updating contractor:', error);
    }
  };

  const handleDelete = (contractor) => {
    setContractorToDelete(contractor);
    setOpenDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/contractor/delete/${contractorToDelete._id}`, { withCredentials: true });
      setContractors(contractors.filter(contractor => contractor._id !== contractorToDelete._id));
      setOpenDeleteModal(false);
      setContractorToDelete(null);
    } catch (error) {
      console.error('Error deleting contractor:', error);
    }
  };

  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4 text-white">Admin Dashboard</h1>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold">Total Cost</h2>
            <p className="text-xl mt-2">₱{dashboardData.totalCost.toLocaleString()}</p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold">Users</h2>
            <p className="text-xl mt-2">{dashboardData.totalUsers}</p>
          </div>
          <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold">Total layouts</h2>
            <p className="text-xl mt-2">{dashboardData.totalProjects}</p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Contractors</h2>
            <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)}>
              Add Contractor
            </Button>
          </div>
          <table className="min-w-full bg-gray-800 border-collapse ">
          <thead className="bg-white text-black">
  <tr>
    <th className="py-2 px-4 border-b text-left">Name</th>
    <th className="py-2 px-4 border-b text-left">License Number</th>
    <th className="py-2 px-4 border-b text-left">Business Address</th>
    <th className="py-2 px-4 border-b text-left">Contact Number</th>
    <th className="py-2 px-4 border-b text-left">Experience</th>
    <th className="py-2 px-4 border-b text-left">Contract Terms</th>
    <th className="py-2 px-4 border-b text-left">Actions</th>
  </tr>
</thead>

            <tbody>
              {contractors.map((contractor) => (
                <tr key={contractor._id}>
                  <td className="py-2 px-4 border-b">{contractor.name}</td>
                  <td className="py-2 px-4 border-b">{contractor.licenseNumber}</td>
                  <td className="py-2 px-4 border-b">{contractor.businessAddress}</td>
                  <td className="py-2 px-4 border-b">{contractor.contactNumber}</td>
                  <td className="py-2 px-4 border-b">{contractor.experience}</td>
                  <td className="py-2 px-4 border-b">{contractor.contractTerms}</td>
                  <td className="py-2 px-4 border-b">
                    <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 mr-2" onClick={() => handleUpdate(contractor)}>Update</button>
                    <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600" onClick={() => handleDelete(contractor)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create Contractor</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="licenseNumber"
            label="License Number"
            type="text"
            fullWidth
            value={formData.licenseNumber}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="businessAddress"
            label="Business Address"
            type="text"
            fullWidth
            value={formData.businessAddress}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="contactNumber"
            label="Contact Number"
            type="text"
            fullWidth
            value={formData.contactNumber}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="experience"
            label="Experience"
            type="text"
            fullWidth
            value={formData.experience}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="contractTerms"
            label="Contract Terms"
            type="text"
            fullWidth
            value={formData.contractTerms}
            onChange={handleCreateChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateModal(false)} color="primary">Cancel</Button>
          <Button onClick={handleCreateSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openUpdateModal} onClose={() => setOpenUpdateModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Update Contractor</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="licenseNumber"
            label="License Number"
            type="text"
            fullWidth
            value={formData.licenseNumber}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="businessAddress"
            label="Business Address"
            type="text"
            fullWidth
            value={formData.businessAddress}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="contactNumber"
            label="Contact Number"
            type="text"
            fullWidth
            value={formData.contactNumber}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="experience"
            label="Experience"
            type="text"
            fullWidth
            value={formData.experience}
            onChange={handleCreateChange}
          />
          <TextField
            margin="dense"
            name="contractTerms"
            label="Contract Terms"
            type="text"
            fullWidth
            value={formData.contractTerms}
            onChange={handleCreateChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateModal(false)} color="primary">Cancel</Button>
          <Button onClick={handleUpdateSave} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Delete Contractor</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this contractor?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="primary">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;