import express from 'express';
import { createProject, getAllProject, getDashboardData, getUserProjects } from '../controllers/projectController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.post('/create', userAuth, createProject);
router.get('/get-all-projects', userAuth, getAllProject);
router.get('/get-user-projects/:userId', userAuth, getUserProjects); // Updated route to accept userId as a parameter
router.get('/dashboard-data', userAuth, getDashboardData);

export default router;