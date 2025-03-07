import express from 'express';
import { createProject, getAllProject, getDashboardData, getUserProjects, getProjectReportsData, getRecentProjects, create3DModel, getProjectData, updateProject, getModelVersions, saveModel } from '../controllers/projectController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.post('/create', userAuth, createProject);
router.get('/get-all-projects', getAllProject);
router.get('/get-user-projects/:userId', userAuth, getUserProjects);
router.get('/dashboard-data', userAuth, getDashboardData);
router.get('/reports-data', getProjectReportsData);
router.get('/recent-projects', getRecentProjects);
router.post('/generate-project', create3DModel);
router.post('/save-model', userAuth, saveModel);
router.get('/:projectId', getProjectData);
router.put('/:projectId', userAuth, updateProject);

// Version management route
router.get('/:projectId/versions', getModelVersions);

export default router;