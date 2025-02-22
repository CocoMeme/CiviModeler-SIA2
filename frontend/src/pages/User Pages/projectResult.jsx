import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';



export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { backendUrl, userData } = useContext(AppContext);
  const { clientName, email, phoneNumber, companyName, projectName, locationSize, projectBudget, projectDescription, result, designStyle } = location.state || {};
  const [openDialog, setOpenDialog] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [contractorDialog, setContractorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirm = async () => {
    setOpenDialog(true);
    try {
      // Ensure userData exists (i.e. the user is logged in)
      if (!userData) {
        console.error('User data not available');
        setErrorMessage('User is not logged in');
        return;
      }
      
      console.log("Backend URL:", backendUrl);
      const projectUrl = backendUrl.endsWith('/')
        ? `${backendUrl}api/project/create`
        : `${backendUrl}/api/project/create`;
      
      const projectData = {
        projectName: projectName,
        size: Number(locationSize),
        budget: Number(projectBudget),
        style: designStyle, // Ensure this matches one of the allowed enum values
        projectDescription: projectDescription,
        author: userData.name,
        clientDetails: {
          clientName: clientName,
          email: email,
          phoneNumber: phoneNumber,
          companyName: companyName
        },
        materials: Object.entries(result.materials).map(([material, details]) => ({
          material: material,
          quantity: details.quantity,
          unitPrice: details.unit_price,
          totalPrice: details.total_price
        })),
        totalCost: result.total_cost,
        userId: userData._id // Ensure userId is included
      };
      
      console.log('Creating project with payload:', projectData);
      const projectResponse = await axios.post(projectUrl, projectData);
  
      if (projectResponse.status === 201) {
        console.log('Project created successfully:', projectResponse.data);
        setIsConfirmed(true);
        alert('Data saved to your account.');
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error 
        ? String(error.response.data.error) 
        : error.message || 'An error occurred';
      setErrorMessage(errorMsg);
      console.error('Error processing request:', error);
    }
    setOpenDialog(false);
  };

  const handleDialogClose = (confirm) => {
    if (confirm) {
      handleConfirm();
    } else {
      setOpenDialog(false);
    }
  };

  // const materialData = result
  // ? Object.entries(result.materials).map(([material, details]) => ({
  //     name: material,
  //     totalCost: details.total_price
  //   }))
  // : [];

  const materialData = [
    { name: 'Cement', totalCost: 5000 },
    { name: 'Steel Bars', totalCost: 8000 },
    { name: 'Paint', totalCost: 2000 },
    { name: 'Bricks', totalCost: 4000 },
    { name: 'Glass', totalCost: 3000 }
  ];
  

  return (
    <Box sx={{ maxWidth: 1000, margin: 'auto', padding: 4, backgroundColor: '#f8f9fa', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom color="purple">
        Project Result
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper sx={{ padding: 3, borderRadius: 2 }} elevation={3}>
            <Typography variant="h6" fontWeight="bold">Client Details</Typography>
            <Typography>Name: {clientName}</Typography>
            <Typography>Email: {email}</Typography>
            <Typography>Phone Number: {phoneNumber}</Typography>
            <Typography>Company Name: {companyName}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ padding: 3, borderRadius: 2 }} elevation={3}>
            <Typography variant="h6" fontWeight="bold">Project Details</Typography>
            <Typography>Project Name: {projectName}</Typography>
            <Typography>Location Size: {locationSize} sqft</Typography>
            <Typography>Project Budget: ₱{projectBudget}</Typography>
            <Typography>Project Description: {projectDescription}</Typography>
            <Typography>Design Style: {designStyle}</Typography> {/* Display design style */}
          </Paper>
        </Grid>
      </Grid>
      
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#9c27b0' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Material</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Unit Price (₱)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total Price (₱)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result && Object.entries(result.materials).map(([material, details]) => (
              <TableRow key={material} hover>
                <TableCell>{material}</TableCell>
                <TableCell>{details.quantity}</TableCell>
                <TableCell>{details.unit_price.toFixed(2)}</TableCell>
                <TableCell>{details.total_price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: '#f4f4f4' }}>
              <TableCell colSpan={3} sx={{ fontWeight: 'bold' }}>Total Estimated Cost</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>₱{result?.total_cost.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>


      <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, textAlign: 'center' }}>
  Material Cost Breakdown
</Typography>

<ResponsiveContainer width="100%" height={300}>
  <BarChart layout="vertical" data={materialData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
    <XAxis type="number" />
    <YAxis dataKey="name" type="category" width={100} />
    <Tooltip />
    <Legend />
    <Bar dataKey="totalCost" fill="#9c27b0" barSize={30} />
  </BarChart>
</ResponsiveContainer>
      

      <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: 'gray', textAlign: 'center' }}>
        *Disclaimer: The prices listed above are estimates and may vary depending on the contractor, supplier, and market conditions. 
        The material prices are based on publicly available data from <a href="https://philconprices.com/category/list-of-construction-materials-prices-in-the-philippines/" target="_blank" rel="noopener noreferrer">Philcon Prices</a>.
      </Typography>
      
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 4 }}>Choose a Contractor</Typography>
<Grid container spacing={2} sx={{ mt: 2 }}>
  {[1, 2, 3, 4, 5].map((num) => (
    <Grid item xs={2.4} key={num}>
      <Button 
        variant="contained" 
        sx={{ 
          width: '100%', 
          padding: 3, 
          fontSize: 16, 
          textTransform: 'none', 
          backgroundColor: 'purple', 
          '&:hover': { backgroundColor: 'darkpurple' } 
        }}
        onClick={() => setContractorDialog(true)}
      >
        Contractor {num}
      </Button>
    </Grid>
  ))}
</Grid>

<Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
          sx={{ backgroundColor: '#9c27b0', fontWeight: 'bold', px: 4, py: 1, '&:hover': { backgroundColor: '#9c27b0' } }}
        >
          Confirm
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to save this to your account?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">Cancel</Button>
          <Button onClick={() => handleDialogClose(true)} color="primary">Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={contractorDialog} onClose={() => setContractorDialog(false)} fullWidth maxWidth="sm">
  <DialogTitle>Contractor Information</DialogTitle>
  <DialogContent>
    <Typography variant="h6" fontWeight="bold">Name:</Typography>
    <Typography>John Doe</Typography>

    <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>License Number:</Typography>
    <Typography>123456789</Typography>

    <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>Business Address:</Typography>
    <Typography>123 Main Street, City, Country</Typography>

    <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>Contact Information:</Typography>
    <Typography>(123) 456-7890 | email@example.com</Typography>

    <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>Experience:</Typography>
    <Typography>10+ years in residential and commercial projects</Typography>

    <Typography variant="h6" fontWeight="bold" sx={{ mt: 2 }}>Contract Terms:</Typography>
    <Typography>Standard terms and conditions apply.</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setContractorDialog(false)} variant="contained" sx={{ backgroundColor: 'purple', color: 'white' }}>
      Close
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
}