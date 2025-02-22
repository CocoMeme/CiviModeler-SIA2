import mongoose from 'mongoose';

const contractorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  businessAddress: { type: String, required: true },
  contactNumber: { type: String, required: true },
  experience: { type: String, required: true },
  contractTerms: { type: String, required: true },
}, { timestamps: true });

const contractorModel = mongoose.model('Contractor', contractorSchema);
export default contractorModel;