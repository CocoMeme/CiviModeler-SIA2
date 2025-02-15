import express from 'express';
import { createProject } from '../controllers/projectController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

// Route to create a new project
router.post('/create', userAuth, createProject);

// ...existing routes...

export default router;
