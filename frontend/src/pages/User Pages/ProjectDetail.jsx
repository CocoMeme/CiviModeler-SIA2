import * as React from 'react';
import { Box, Stepper, Step, StepLabel, Button, TextField, Typography } from '@mui/material';
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import './ProjectDetail.css';

const steps = ['Client Details', 'Project Details', 'Setting-up'];

export default function ProjectDetail() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    clientName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    projectName: '',
    locationSize: '',
    projectBudget: '',
    projectDescription: ''
  });
  const navigate = useNavigate();
  
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleGetQuote = () => {
    navigate('/project-result', { state: formData });
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
            <TextField fullWidth label="Client Full Name" id="clientName" margin="normal" className="custom-textfield" value={formData.clientName} onChange={handleChange} />
            <TextField fullWidth label="Email" id="email" type="email" margin="normal" className="custom-textfield" value={formData.email} onChange={handleChange} />
            <TextField fullWidth label="Phone Number" id="phoneNumber" type="tel" margin="normal" className="custom-textfield" value={formData.phoneNumber} onChange={handleChange} />
            <TextField fullWidth label="Company Name" id="companyName" margin="normal" className="custom-textfield" value={formData.companyName} onChange={handleChange} />
            <Button variant="contained" onClick={handleNext} className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 transition duration-300">Next</Button>
          </Box>
        )}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" className="custom-typography">Project Details</Typography>
            <TextField fullWidth label="Project Name" id="projectName" margin="normal" className="custom-textfield" value={formData.projectName} onChange={handleChange} />
            <TextField fullWidth label="Location Size (sqft)" id="locationSize" margin="normal" className="custom-textfield" value={formData.locationSize} onChange={handleChange} />
            <TextField fullWidth label="Project Budget (₱)" id="projectBudget" type="number" margin="normal" className="custom-textfield" value={formData.projectBudget} onChange={handleChange} />
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
              id="projectDescription"
              multiline
              rows={4}
              margin="normal"
              className="custom-textfield"
              value={formData.projectDescription}
              onChange={handleChange}
            />
            <Button onClick={handleBack} className="px-6 py-3 bg-white text-blue-600 border border-blue-600 font-semibold rounded-md shadow-md hover:bg-blue-100 flex items-center gap-2 transition duration-300">
              Back <FaArrowRight />
            </Button>
            <button onClick={handleGetQuote} className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 transition duration-300">
              Get a Quote!
            </button>
          </Box>
        )}
      </Box>
    </Box>
  );
}