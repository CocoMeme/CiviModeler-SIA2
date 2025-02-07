import React, { useState } from 'react';
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

export default function Result() {
  const [openDialog, setOpenDialog] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Example result data, you can replace this with the actual data passed to the component
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

  const handleConfirm = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = (confirm) => {
    if (confirm) {
      setIsConfirmed(true);
      alert('Data saved to your account.');
    }
    setOpenDialog(false);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 900, margin: 'auto', padding: 4, paddingTop: 10, marginTop: 4 }}>
      <Typography variant="h6" gutterBottom>Project Result</Typography>
      <Typography variant="body1" gutterBottom>
        Estimated Total Cost: ₱{result.total_cost.toFixed(2)}
      </Typography>
      <Typography variant="body1" gutterBottom>{result.budget_status}</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Material</TableCell>
              <TableCell>Quantity (Units)</TableCell>
              <TableCell>Unit Price (₱)</TableCell>
              <TableCell>Total Price (₱)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(result.materials).map(([material, details]) => (
              <TableRow key={material}>
                <TableCell>{material}</TableCell>
                <TableCell>{details.quantity}</TableCell>
                <TableCell>{details.unit_price.toFixed(2)}</TableCell>
                <TableCell>{details.total_price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ marginTop: 3 }}>
        <Button
          variant="contained"
          onClick={handleConfirm}
          sx={{
            backgroundColor: '#4CAF50',
            color: 'white',
            fontWeight: 'bold',
            padding: '10px 20px',
            '&:hover': {
              backgroundColor: '#45a049',
            },
          }}
        >
          Confirm
        </Button>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to save this to your account?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDialogClose(true)} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {isConfirmed && (
        <Typography variant="body2" color="green" sx={{ marginTop: 2 }}>
          Data has been successfully saved to your account.
        </Typography>
      )}
    </Box>
  );
}
