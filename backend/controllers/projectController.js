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

    const contractorProjects = await projectModel.aggregate([
      {
        $group: {
          _id: "$contractorId",
          totalProjects: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "contractors", // Ensure this matches your contractors collection name
          localField: "_id",
          foreignField: "_id",
          as: "contractor"
        }
      },
      {
        $unwind: "$contractor"
      },
      {
        $project: {
          _id: 0,
          contractorName: "$contractor.name",
          totalProjects: 1
        }
      }
    ]);

    res.status(200).json({ projects, contractorProjects });
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
    const { prompt, projectId, description } = req.body;

    // Make a POST request to the Sloyd API with the required fields
    const sloydResponse = await axios.post(process.env.SLOYD_API_URL, {
      Prompt: prompt,
      ClientId: process.env.SLOYD_CLIENT_ID,
      ClientSecret: process.env.SLOYD_CLIENT_SECRET,
      ModelOutputType: "glb",
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

    // Retrieve the project document from MongoDB
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Ensure the temp directory exists
    const tempDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Save the model data to a temporary file using the project name and version
    const nextVersion = (project.currentVersion || 0) + 1;
    const tempFileName = `${project.projectName.replace(/\s+/g, '_')}_v${nextVersion}.glb`;
    const tempFilePath = path.join(tempDir, tempFileName);
    fs.writeFileSync(tempFilePath, Buffer.from(ModelData, 'base64'));

    // Upload the model file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(tempFilePath, {
      resource_type: 'raw',
    });

    // Delete the temporary file
    fs.unlinkSync(tempFilePath);

    // Create the new version data
    const newVersion = {
      interactionId: InteractionId,
      confidenceScore: ConfidenceScore,
      responseEncoding: SloydResponseEncoding,
      modelOutputType: SloydModelOutputType,
      modelUrl: uploadResponse.secure_url,
      thumbnailPreview: ThumbnailPreview || uploadResponse.secure_url,
      version: nextVersion,
      description: description || `Version ${nextVersion}`,
      createdAt: new Date()
    };

    // Update current sloyd data and add to versions array
    project.sloyd = { ...newVersion };
    if (!project.modelVersions) {
      project.modelVersions = [];
    }
    project.modelVersions.push(newVersion);
    project.currentVersion = nextVersion;

    await project.save();

    res.json({ 
      currentVersion: project.sloyd,
      allVersions: project.modelVersions,
      versionNumber: nextVersion
    });
  } catch (error) {
    console.error("Error creating 3D model:", error);
    res.status(500).send("Server Error");
  }
};

export const getMaterialData = async (req, res) => {
  try {
    console.log("Fetching material data...");
    const materialData = await projectModel.aggregate([
      { $unwind: "$materials" },
      {
        $group: {
          _id: "$materials.material",
          totalQuantity: { $sum: "$materials.quantity" }
        }
      },
      { $sort: { totalQuantity: -1 } }
    ]);

    console.log("Material data fetched:", materialData);
    res.status(200).json(materialData);
  } catch (error) {
    console.error('Error fetching material data:', error);
    res.status(500).json({ message: 'Error fetching material data', error });
  }
};

// Add a new controller to get all versions of a model
export const getModelVersions = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({
      currentVersion: project.sloyd,
      allVersions: project.modelVersions,
      currentVersionNumber: project.currentVersion
    });
  } catch (error) {
    console.error("Error fetching model versions:", error);
    res.status(500).send("Server Error");
  }
};

export const saveModel = async (req, res) => {
  try {
    const { projectId, description } = req.body;
    const modelFile = req.files?.model;

    if (!modelFile) {
      return res.status(400).json({ error: "No model file provided" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Upload the model file to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(modelFile.tempFilePath, {
      resource_type: 'raw',
      folder: 'model_versions',
    });

    // Create the new version data
    const nextVersion = (project.currentVersion || 0) + 1;
    const newVersion = {
      interactionId: `manual_update_${Date.now()}`,
      confidenceScore: 1.0,
      responseEncoding: "binary",
      modelOutputType: "glb",
      modelUrl: uploadResponse.secure_url,
      thumbnailPreview: project.sloyd.thumbnailPreview, // Keep the current thumbnail
      version: nextVersion,
      description: description || `Manual update - Version ${nextVersion}`,
      createdAt: new Date()
    };

    // Update current sloyd data and add to versions array
    project.sloyd = { ...newVersion };
    if (!project.modelVersions) {
      project.modelVersions = [];
    }
    project.modelVersions.push(newVersion);
    project.currentVersion = nextVersion;

    await project.save();

    res.json({
      success: true,
      newVersion,
      message: "Model updated successfully"
    });
  } catch (error) {
    console.error("Error saving model:", error);
    res.status(500).json({ error: "Failed to save model" });
  }
};