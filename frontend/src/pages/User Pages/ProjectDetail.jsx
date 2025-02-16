import * as React from 'react';
import { Box, Stepper, Step, StepLabel, Button, TextField, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '/styles/ProjectDetail.css?url';
import { AppContext } from '../../context/AppContext';

const steps = ['Client Details', 'Project Details', 'Setting-up'];

export default function ProjectDetail() {

  const { backendUrl, userData } = React.useContext(AppContext);

  const [activeStep, setActiveStep] = React.useState(0);
  const [formData, setFormData] = React.useState({
    clientName: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    projectName: '',
    locationSize: '',
    projectBudget: '',
    projectDescription: '',
    designStyle: 'Modern' // Default design style
  });
  const [errorMessage, setErrorMessage] = React.useState('');
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

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGetQuote = async () => {
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
        projectName: formData.projectName,
        size: Number(formData.locationSize),
        budget: Number(formData.projectBudget),
        style: formData.designStyle,
        projectDescription: formData.projectDescription,
        author: userData.name,
        clientDetails: {
          clientName: formData.clientName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          companyName: formData.companyName
        }
      };
      
      console.log('Creating project with payload:', projectData);
      const projectResponse = await axios.post(projectUrl, projectData);
  
      if (projectResponse.status === 201) {
        console.log('Project created successfully:', projectResponse.data);
        
        const estimateResponse = await axios.post('http://localhost:5001/estimate', {
          budget: projectData.budget,
          size: projectData.size,
          design_style: projectData.style
        });
  
        navigate('/user/project-result', { state: { ...formData, result: estimateResponse.data } });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error 
        ? String(error.response.data.error) 
        : error.message || 'An error occurred';
      setErrorMessage(errorMsg);
      console.error('Error processing request:', error);
    }
  };


  const handleGenerateModel = async () => {
    try {
      const response = await axios.post('http://localhost:5001/generate-model', {
        size: formData.locationSize,
        design_style: formData.designStyle
      });
      navigate('/model-generator', { state: { modelUrl: response.data.model_url } });
    } catch (error) {
      console.error('Error generating model:', error);
    }
  };
  
  return (
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
              <FaArrowLeft /> Back
            </Button>
            <button onClick={handleGetQuote} className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md shadow-md hover:bg-purple-700 transition duration-300">
              Get a Quote!
            </button>
            <button onClick={handleGenerateModel} className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition duration-300">
              Generate 3D Model
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
  );
}