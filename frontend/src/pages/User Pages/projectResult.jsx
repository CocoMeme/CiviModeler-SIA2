import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export default function Result() {
  const location = useLocation();
  const { clientName, email, phoneNumber, companyName, projectName, locationSize, projectBudget, projectDescription, houseDesign } = location.state || {};
  const [openDialog, setOpenDialog] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const result = {
    total_cost: 35000.00,
    budget_status: 'Within Budget',
    materials: {
      Cement: { quantity: 3.2, unit_price: 250, total_price: 800 },
      Sand: { quantity: 2.5, unit_price: 500, total_price: 1250 },
      Gravel: { quantity: 3.0, unit_price: 700, total_price: 2100 },
      Bricks: { quantity: 1000, unit_price: 10, total_price: 10000 },
      Steel: { quantity: 100, unit_price: 150, total_price: 15000 },
      Paint: { quantity: 4.0, unit_price: 500, total_price: 2000 },
    },
  };

  const handleConfirm = () => setOpenDialog(true);

  const handleDialogClose = (confirm) => {
    if (confirm) {
      setIsConfirmed(true);
      alert('Data saved to your account.');
    }
    setOpenDialog(false);
  };

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', padding: 4, backgroundColor: '#f8f9fa', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom color="primary">
        Project Result
      </Typography>
      
      <Paper sx={{ padding: 3, borderRadius: 2, mb: 3 }} elevation={3}>
        <Typography variant="h6" fontWeight="bold">Client Details</Typography>
        <Typography>Name: {clientName}</Typography>
        <Typography>Email: {email}</Typography>
        <Typography>Phone Number: {phoneNumber}</Typography>
        <Typography>Company Name: {companyName}</Typography>
      </Paper>

      <Paper sx={{ padding: 3, borderRadius: 2, mb: 3 }} elevation={3}>
        <Typography variant="h6" fontWeight="bold">Project Details</Typography>
        <Typography>Project Name: {projectName}</Typography>
        <Typography>Location Size: {locationSize} sqft</Typography>
        <Typography>Project Budget: ₱{projectBudget}</Typography>
        <Typography>Project Description: {projectDescription}</Typography>
        <Typography><strong>House Design:</strong> {houseDesign || 'Not Selected'}</Typography>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Material</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Unit Price (₱)</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Total Price (₱)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(result.materials).map(([material, details]) => (
              <TableRow key={material} hover>
                <TableCell>{material}</TableCell>
                <TableCell>{details.quantity}</TableCell>
                <TableCell>{details.unit_price.toFixed(2)}</TableCell>
                <TableCell>{details.total_price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow sx={{ backgroundColor: '#f4f4f4' }}>
              <TableCell colSpan={3} sx={{ fontWeight: 'bold' }}>Total Estimated Cost</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>₱{result.total_cost.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleConfirm}
          sx={{ backgroundColor: '#4CAF50', fontWeight: 'bold', px: 4, py: 1, '&:hover': { backgroundColor: '#388E3C' } }}
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

      {isConfirmed && (
        <Typography variant="body2" color="green" sx={{ textAlign: 'center', mt: 2 }}>
          Data has been successfully saved to your account.
        </Typography>
      )}
    </Box>
  );
}
