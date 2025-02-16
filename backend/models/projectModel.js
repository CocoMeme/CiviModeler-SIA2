import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  author: { type: String, required: true }, // changed from ObjectId to String to store user's name
  size: { type: Number, required: true },
  budget: { type: Number, required: true },
  style: { type: String, enum: ["Modern", "Classic", "Rustic"], required: true },
  projectDescription: { type: String },
  clientDetails: {
    clientName: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    companyName: { type: String }
  },
  materials: [
    {
      material: { type: String },
      quantity: { type: Number },
      unitPrice: { type: Number },
      totalPrice: { type: Number }
    }
  ],
  totalCost: { type: Number },
  thumbnail: { type: String }
}, { timestamps: true });

const projectModel = mongoose.models.project || mongoose.model("project", projectSchema);
export default projectModel;