import mongoose from "mongoose";

// Define the schema for the project
const projectSchema = new mongoose.Schema({
	projectName: { type: String, required: true },
	size: { type: Number, required: true },
	budget: { type: Number, required: true },
	style: { type: String, enum: ["modern", "classic", "rustic"], required: true },
	promptMessage: { type: String },
	clientDetials: [{
		clientName: { type: String, required: true },
		email: { type: String, required: true },
		phoneNumber: { type: String },
		companyName: { type: String }
	}]
});

const projectModel = mongoose.models.project || mongoose.model("project", projectSchema);
export default projectModel;
