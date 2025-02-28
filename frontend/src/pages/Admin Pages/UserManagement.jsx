import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Modal, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import axios from 'axios';

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

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch users excluding soft deleted ones
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/all`, { withCredentials: true });
        if (response.data.success) {
          const activeUsers = response.data.users.filter(user => !user.isDeleted);
          setUsers(activeUsers);
          setFilteredUsers(activeUsers);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(users.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    ));
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/user/delete/${selectedUser._id}`, { withCredentials: true });

      if (response.data.success) {
        const updatedUsers = users.filter(user => user._id !== selectedUser._id);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setIsDeleteModalOpen(false);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(data, 'users.xlsx');
  };

  const columns = [
    { field: 'name', headerName: 'User Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { 
      field: 'isAccountVerified', 
      headerName: 'Account Status', 
      width: 150, 
      renderCell: (params) => (params.value ? 'Verified' : 'Not Verified')
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button variant="contained" color="primary" size="small">
            Update
          </Button>
          <Button variant="contained" color="secondary" size="small" onClick={() => handleDeleteClick(params.row)}>
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">User Management</h1>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField 
          sx={{ bgcolor: 'white', borderRadius: 1 }} 
          placeholder="Search Table" 
          value={searchQuery}
          onChange={handleSearch}
        />
        <Button variant="contained" sx={{ backgroundColor: '#007FFF', color: 'white' }} onClick={exportToExcel}>
          Export to Excel
        </Button>
      </Box>
      <Box sx={{ height: 500, width: '100%', backgroundColor: '#1E1E1E', borderRadius: 2, padding: 2, color: 'white' }}>
        <DataGrid 
          rows={filteredUsers} 
          columns={columns} 
          getRowId={(row) => row._id} 
          pageSize={10} 
          rowsPerPageOptions={[10, 20, 50]} 
          checkboxSelection 
          sx={{
            color: 'black',
            borderColor: 'white',
            '& .MuiDataGrid-cell': { color: 'white' },
            '& .MuiDataGrid-columnHeaders': { backgroundColor: '#333', textAlign: 'center' },
            '& .MuiDataGrid-columnHeaderTitle': { textAlign: 'center', width: '100%' },
            '& .MuiDataGrid-row:nth-of-type(even)': { backgroundColor: '#252525' },
          }}
        />
      </Box>

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Are you sure you want to delete this user?
          </Typography>
          <Typography sx={{ mb: 3 }}>
            {selectedUser?.name} ({selectedUser?.email})
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="contained" color="error" onClick={confirmDelete}>
              Delete
            </Button>
            <Button variant="contained" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
