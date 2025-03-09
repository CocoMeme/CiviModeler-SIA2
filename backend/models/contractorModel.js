import mongoose from 'mongoose';

const contractorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  officeAddress: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String },
  website: { type: String },
  facebook: { type: String },
  notableProjects: { type: [String], required: true },
  services: { type: [String], default: ['Residential Construction', 'Commercial Projects', 'Renovation'] }
}, { timestamps: true });

const contractorModel = mongoose.model('Contractor', contractorSchema);
export default contractorModel;