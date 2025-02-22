import contractorModel from '../models/contractorModel.js';

// Create a new contractor
export const createContractor = async (req, res) => {
  try {
    const contractor = new contractorModel(req.body);
    const savedContractor = await contractor.save();
    res.status(201).json(savedContractor);
  } catch (error) {
    res.status(500).json({ message: 'Error creating contractor', error });
  }
};

// Get all contractors
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
    res.status(200).json(updatedContractor);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contractor', error });
  }
};

// Delete a contractor
export const deleteContractor = async (req, res) => {
  try {
    await contractorModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Contractor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contractor', error });
  }
};