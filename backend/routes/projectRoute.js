import express from 'express';
import { createProject, getAllProject } from '../controllers/projectController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.post('/create', userAuth, createProject);
router.get('/get-all-projects', userAuth, getAllProject);


export default router;
