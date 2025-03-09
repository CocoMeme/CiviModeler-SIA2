import mongoose from 'mongoose';

const contractorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  officeAddress: { type: String, required: true },
  contactNumber: { type: String, required: true },
  notableProjects: { type: [String], required: true }, // Changed to an array of strings
}, { timestamps: true });

const contractorModel = mongoose.model('Contractor', contractorSchema);
export default contractorModel;