import projectModel from '../models/projectModel.js';
import userModel from '../models/userModel.js';
import axios from 'axios';
import cloudinary from '../config/cloudinary.js'; // Ensure this import is correct
import Project from '../models/projectModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update an existing project
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const updatedProject = await projectModel.findByIdAndUpdate(projectId, req.body, { new: true });
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project', error });
  }
};

// Create a new project
export const createProject = async (req, res) => {
  try {
    //console.log('Request body:', req.body); // Log the request body
    const project = new projectModel(req.body);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error); // Log the error
    res.status(500).json({ message: 'Error creating project', error });
  }
};

// Fetch all projects
export const getAllProject = async (req, res) => {
  try {
    const projects = await projectModel.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
};

// Fetch all projects created by the specified user
export const getUserProjects = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from URL parameter
    const userProjects = await projectModel.find({ userId });
    res.status(200).json({ success: true, projects: userProjects });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user projects', error });
  }
};

// Fetch specific project data
export const getProjectData = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await projectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project data', error });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const totalProjects = await projectModel.countDocuments();
    const totalCost = await projectModel.aggregate([
      { $group: { _id: null, total: { $sum: "$totalCost" } } }
    ]);

    res.status(200).json({
      totalUsers,
      totalProjects,
      totalCost: totalCost[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error });
  }
};


export const getProjectReportsData = async (req, res) => {
  try {
    const projects = await projectModel.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$createdAt" },
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          totalProjects: { $sum: 1 },
          totalBudget: { $sum: { $ifNull: ["$budget", 0] } },
          totalCost: { $sum: { $ifNull: ["$totalCost", 0] } }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports data', error });
  }
};

// Fetch top 5 recent projects --- this is for the admin dashboard
export const getRecentProjects = async (req, res) => {
  try {
    const projects = await projectModel.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent projects', error });
  }
};


export const create3DModel = async (req, res) => {
  try {
    const { prompt, projectId } = req.body;

    // Make a POST request to the Sloyd API with the required fields
    const sloydResponse = await axios.post(process.env.SLOYD_API_URL, {
      Prompt: prompt,
      ClientId: process.env.SLOYD_CLIENT_ID,
      ClientSecret: process.env.SLOYD_CLIENT_SECRET,
      ModelOutputType: "glb",   // or "glb" if that's your desired output
      ResponseEncoding: "json"
    });

    // Destructure the Sloyd API response
    const {
      InteractionId,
      ConfidenceScore,
      ResponseEncoding: SloydResponseEncoding,
      ModelOutputType: SloydModelOutputType,
      ModelData,
      ThumbnailPreview
    } = sloydResponse.data;

    // Retrieve the project document from MongoDB to get the project name
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Ensure the temp directory exists
    const tempDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Save the model data to a temporary file using the project name
    const tempFileName = `${project.projectName.replace(/\s+/g, '_')}.glb`; // Replace spaces with underscores
    const tempFilePath = path.join(tempDir, tempFileName);
    fs.writeFileSync(tempFilePath, Buffer.from(ModelData, 'base64'));

    // Upload the model file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(tempFilePath, {
      resource_type: 'raw',
    });

    // Delete the temporary file
    fs.unlinkSync(tempFilePath);

    // Update the project document in MongoDB
    project.sloyd = {
      interactionId: InteractionId,
      confidenceScore: ConfidenceScore,
      responseEncoding: SloydResponseEncoding,
      modelOutputType: SloydModelOutputType,
      modelUrl: uploadResponse.secure_url,         // URL of the uploaded model file
      thumbnailPreview: ThumbnailPreview || uploadResponse.secure_url, // fallback if thumbnail not provided
    };

    await project.save();

    res.json({ ModelData: project.sloyd });
  } catch (error) {
    console.error("Error creating 3D model:", error);
    res.status(500).send("Server Error");
  }
};