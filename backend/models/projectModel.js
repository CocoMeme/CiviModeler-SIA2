import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    author: { type: String, required: true },
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
    thumbnail: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true } // Reference to userModel
}, { timestamps: true });

const projectModel = mongoose.models.project || mongoose.model("project", projectSchema);
export default projectModel;
