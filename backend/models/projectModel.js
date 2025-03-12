import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  author: { type: String, required: true },
  size: { type: Number, required: true },
  budget: { type: Number, required: true },
  style: { type: String, enum: ["Modern", "Classic", "Rustic"], required: true },
  projectDescription: { type: String },
  materials: [
    {
      material: { type: String },
      quantity: { type: Number },
      unitPrice: { type: Number },
      totalPrice: { type: Number }
    }
  ],
  totalCost: { type: Number },
  thumbnail: { type: String },
  contractorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contractor' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  sloyd: {
    interactionId: { type: String },
    confidenceScore: { type: Number },
    responseEncoding: { type: String },
    modelOutputType: { type: String },
    modelUrl: { type: String },
    thumbnailPreview: { type: String },
    createdAt: { type: Date, default: Date.now }
  },
  modelVersions: [{
    interactionId: { type: String },
    confidenceScore: { type: Number },
    responseEncoding: { type: String },
    modelOutputType: { type: String },
    modelUrl: { type: String },
    thumbnailPreview: { type: String },
    createdAt: { type: Date, default: Date.now },
    version: { type: Number },
    description: { type: String }
  }],
  currentVersion: { type: Number, default: 1 }
}, { timestamps: true });

const projectModel = mongoose.models.project || mongoose.model("project", projectSchema);
export default projectModel;