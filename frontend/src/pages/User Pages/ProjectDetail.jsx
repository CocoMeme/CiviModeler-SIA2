import * as React from 'react';
import { Box, Stepper, Step, StepLabel, Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '/styles/ProjectDetail.css?url';
import { AppContext } from '../../context/AppContext';
import { useContext } from 'react';

const steps = ['Project Details', 'Setting-up'];

export default function ProjectDetail() {

  const { backendUrl, userData } = React.useContext(AppContext);

  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    projectName: '',
    locationSize: '',
    projectBudget: '',
    projectDescription: '',
    designStyle: 'Modern' // Default design style
  });
  const [errorMessage, setErrorMessage] = React.useState('');
  const [formErrors, setFormErrors] = React.useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (validateForm()) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGetQuote = async () => {
    if (validateForm())
      try {
        // Ensure userData exists (i.e. the user is logged in)
        if (!userData) {
          console.error('User data not available');
          setErrorMessage('User is not logged in');
          return;
        }

        const estimateResponse = await axios.post('http://localhost:5001/estimate', {
          budget: formData.projectBudget,
          size: formData.locationSize,
          design_style: formData.designStyle
        });

        navigate('/user/project-result', { state: { ...formData, result: estimateResponse.data } });
      } catch (error) {
        const errorMsg = error.response?.data?.error
          ? String(error.response.data.error)
          : error.message || 'An error occurred';
        setErrorMessage(errorMsg);
        console.error('Error processing request:', error);
      }
  };

  const validateForm = () => {
    let errors = {};
    if (activeStep === 0) {
      if (!formData.projectName) errors.projectName = 'Project name is required';
      if (!formData.locationSize) errors.locationSize = 'Location size is required';
      if (!formData.projectBudget) errors.projectBudget = 'Project budget is required';
    } else if (activeStep === 1) {
      if (!formData.projectDescription) errors.projectDescription = 'Project description is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="container mx-auto">
      {/* Header */}
      <img className="rounded-lg mb-4 w-full" src="/project images/H6.png" alt="CiviModeler H5" />
      <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto', padding: 4, fontFamily: 'Outfit, sans-serif', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
              <Typography variant="h6" className="custom-typography">Project Details</Typography>
              <TextField
                fullWidth
                label="Project Name"
                id="projectName"
                margin="normal"
                className="custom-textfield"
                value={formData.projectName}
                onChange={handleChange}
                error={!!formErrors.projectName}
                helperText={formErrors.projectName}
              />
              <TextField
                fullWidth
                label="Location Size (sqft)"
                id="locationSize"
                margin="normal"
                className="custom-textfield"
                value={formData.locationSize}
                onChange={handleChange}
                error={!!formErrors.locationSize}
                helperText={formErrors.locationSize}
              />
              <TextField
                fullWidth
                label="Project Budget (₱)"
                id="projectBudget"
                type="number"
                margin="normal"
                className="custom-textfield"
                value={formData.projectBudget}
                onChange={handleChange}
                error={!!formErrors.projectBudget}
                helperText={formErrors.projectBudget}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="designStyle-label">Design Style</InputLabel>
                <Select
                  labelId="designStyle-label"
                  name="designStyle"
                  value={formData.designStyle}
                  onChange={handleSelectChange}
                  className="custom-textfield"
                >
                  <MenuItem value="Modern">Modern</MenuItem>
                  <MenuItem value="Classic">Classic</MenuItem>
                  <MenuItem value="Rustic">Rustic</MenuItem>
                </Select>
              </FormControl>
              <Button onClick={handleBack} className="px-6 py-3 bg-white text-blue-600 border border-blue-600 font-semibold rounded-md shadow-md hover:bg-blue-100 flex items-center gap-2 transition duration-300">
                <FaArrowLeft /> Back
              </Button>
              <Button variant="contained" onClick={handleNext} className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 transition duration-300">Next</Button>
            </Box>
          )}
          {activeStep === 1 && (
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
                error={!!formErrors.projectDescription}
                helperText={formErrors.projectDescription}
              />
              <Button onClick={handleBack} className="px-6 py-3 bg-white text-blue-600 border border-blue-600 font-semibold rounded-md shadow-md hover:bg-blue-100 flex items-center gap-2 transition duration-300">
                <FaArrowLeft /> Back
              </Button>
              <button onClick={handleGetQuote} className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 transition duration-300">
                Get a Quote!
              </button>
              {errorMessage && (
                <Typography variant="body2" color="error" sx={{ textAlign: 'center', mt: 2 }}>
                  {errorMessage}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}