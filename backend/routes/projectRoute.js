import express from 'express';
import { createProject, getAllProject, getDashboardData, getUserProjects, getProjectReportsData, getRecentProjects, generate3DHouse, create3DModel } from '../controllers/projectController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.post('/create', userAuth, createProject);
router.get('/get-all-projects', getAllProject);
router.get('/get-user-projects/:userId', userAuth, getUserProjects);
router.get('/dashboard-data', userAuth, getDashboardData);
router.get('/reports-data', getProjectReportsData);
router.get('/recent-projects', getRecentProjects);
router.post('/generate-3d', generate3DHouse);
router.post('/generate-project', create3DModel);

export default router;