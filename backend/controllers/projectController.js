import projectModel from '../models/projectModel.js';
import userModel from '../models/userModel.js';

// Create a new project
export const createProject = async (req, res) => {
  try {
    const project = new projectModel(req.body);
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
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
    res.status(200).json(userProjects);
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
