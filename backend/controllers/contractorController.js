import contractorModel from '../models/contractorModel.js';

// Create a new contractor
export const createContractor = async (req, res) => {
  try {
    const contractor = new contractorModel(req.body);
    const savedContractor = await contractor.save();
    res.status(201).json({ success: true, contractor: savedContractor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating contractor', error });
  }
};

// Get all contractors - returns the array directly for compatibility with ProjectContent.jsx
export const getAllContractors = async (req, res) => {
  try {
    const contractors = await contractorModel.find();
    res.status(200).json(contractors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contractors', error });
  }
};

// Update a contractor
export const updateContractor = async (req, res) => {
  try {
    const updatedContractor = await contractorModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, contractor: updatedContractor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating contractor', error });
  }
};

// Delete a contractor
export const deleteContractor = async (req, res) => {
  try {
    await contractorModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Contractor deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting contractor', error });
  }
};

// Get contractor by ID
export const getContractorById = async (req, res) => {
  try {
    const contractor = await contractorModel.findById(req.params.id);
    if (!contractor) {
      return res.status(404).json({ success: false, message: 'Contractor not found' });
    }
    res.status(200).json({ success: true, contractor });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching contractor', error });
  }
};

// Get contractors by specialized endpoint - specifically for frontend component
export const getContractors = async (req, res) => {
  try {
    const { limit, sort } = req.query;
    
    const query = contractorModel.find();
    
    // Apply sorting if specified
    if (sort === 'newest') {
      query.sort('-createdAt');
    } else if (sort === 'rating') {
      query.sort('-rating');
    }
    
    // Apply limit only if explicitly specified
    if (limit) {
      query.limit(parseInt(limit));
    }
    
    const contractors = await query.exec();
    res.status(200).json({ success: true, contractors });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching contractors', error });
  }
};