import * as React from 'react';
import { Box, Stepper, Step, StepLabel, Button, TextField, Typography } from '@mui/material';
import './ProjectDetail.css';
import { FaArrowRight } from "react-icons/fa";

const steps = ['Client Details', 'Project Details', 'Setting-up'];

export default function ProjectDetail() {
  const [activeStep, setActiveStep] = React.useState(0);
  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto', padding: 4, paddingTop: 10, fontFamily: 'Outfit, sans-serif', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}> 
      <Stepper activeStep={activeStep} alternativeLabel sx={{ '& .MuiStepIcon-root.Mui-active': { color: '#5a2b79' }, '& .MuiStepIcon-root.Mui-completed': { color: '#5a2b79' } }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ mt: 4 }}>
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" className="custom-typography">Client Details</Typography>
            <TextField fullWidth label="Client Full Name" margin="normal" className="custom-textfield" />
            <TextField fullWidth label="Email" type="email" margin="normal" className="custom-textfield" />
            <TextField fullWidth label="Phone Number" type="tel" margin="normal" className="custom-textfield" />
            <TextField fullWidth label="Company Name" margin="normal" className="custom-textfield" />
            <Button variant="contained" onClick={handleNext} className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 transition duration-300">Next</Button>
          </Box>
        )}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" className="custom-typography">Project Details</Typography>
            <TextField fullWidth label="Project Name" margin="normal" className="custom-textfield" />
            <TextField fullWidth label="Location Size (sqft)" margin="normal" className="custom-textfield" />
            <TextField fullWidth label="Project Budget (₱)" type="number" margin="normal" className="custom-textfield" />
            <Button onClick={handleBack} className="px-6 py-3 bg-white text-blue-600 border border-blue-600 font-semibold rounded-md shadow-md hover:bg-blue-100 flex items-center gap-2 transition duration-300">
              Back <FaArrowRight />
            </Button>
            <Button variant="contained" onClick={handleNext} className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 transition duration-300">Next</Button>
          </Box>
        )}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" className="custom-typography">Setting-up</Typography>
            <TextField
              fullWidth
              label="Project Description"
              multiline
              rows={4}
              margin="normal"
              className="custom-textfield"
            />
            <Button onClick={handleBack} className="px-6 py-3 bg-white text-blue-600 border border-blue-600 font-semibold rounded-md shadow-md hover:bg-blue-100 flex items-center gap-2 transition duration-300">
              Back <FaArrowRight />
            </Button>
            <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 transition duration-300">
              Get a Quote!
            </button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

