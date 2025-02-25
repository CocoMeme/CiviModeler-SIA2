import projectModel from '../models/projectModel.js';
import userModel from '../models/userModel.js';

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


export const generate3DHouse = async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(process.env.SLOYD_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        Prompt: prompt,
        ClientId: process.env.SLOYD_CLIENT_ID,
        ClientSecret: process.env.SLOYD_CLIENT_SECRET,
        ModelOutputType: "gltf",
        ResponseEncoding: "json"
      })
    });

    if (!response.ok) {
      throw new Error(`Sloyd API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Sloyd API response:", data);

    res.status(200).json({
      message: "3D model generated successfully!",
      modelUrl: data.modelUrl // Ensure this is the correct path to the model URL
    });
  } catch (error) {
    console.error("Error generating 3D model:", error);
    res.status(500).json({ message: "Failed to generate 3D model", error: error.message });
  }
};
