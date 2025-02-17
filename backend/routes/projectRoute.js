import express from 'express';
import { createProject, getAllProject, getDashboardData } from '../controllers/projectController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.post('/create', userAuth, createProject);
router.get('/get-all-projects', userAuth, getAllProject);
router.get('/dashboard-data', userAuth, getDashboardData)


export default router;