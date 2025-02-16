import projectModel from '../models/projectModel.js';

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

// Add getAllProject controller to fetch all projects
export const getAllProject = async (req, res) => {
  try {
    const projects = await projectModel.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
};
