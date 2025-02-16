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
	Materials: { 
		material_name: { type: String },
		quantity: { type: Number },
		unit_price: { type: Number }
		
	},
	total_cost: { type: Number },
	thumbnail: { type: String }
	
}, { timestamps: true });

const projectModel = mongoose.models.project || mongoose.model("project", projectSchema);
export default projectModel;
