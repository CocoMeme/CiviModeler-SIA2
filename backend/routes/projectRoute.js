import express from 'express';
import { createProject, getAllProject, getDashboardData, getUserProjects, getProjectReportsData, getRecentProjects, create3DModel, getProjectData, updateProject, getMaterialData, saveModel, getModelVersions, deleteProject } from '../controllers/projectController.js';
import userAuth from '../middleware/userAuth.js';

const router = express.Router();

router.post('/create', userAuth, createProject);
router.get('/get-all-projects', getAllProject);
router.get('/get-user-projects/:userId', userAuth, getUserProjects);
router.get('/dashboard-data', userAuth, getDashboardData);
router.get('/reports-data', getProjectReportsData);
router.get('/recent-projects', getRecentProjects);
router.post('/generate-project', create3DModel);
router.get('/material-data', getMaterialData)
router.get('/:projectId', getProjectData);
router.put('/:projectId', userAuth, updateProject);

router.post('/save-model', userAuth, saveModel);
router.get('/:projectId/versions', getModelVersions);
router.delete('/:projectId', userAuth, deleteProject);

// Model-based material estimation endpoint
router.post('/estimate-from-model-changes', async (req, res) => {
  try {
    const { baseMaterials, modelChanges, designStyle } = req.body;
    
    if (!baseMaterials || !modelChanges) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Call Python estimation endpoint
    const response = await axios.post('http://localhost:5001/estimate-from-components', {
      components: Object.entries(modelChanges).map(([material, changes]) => ({
        name: material,
        added: changes.added,
        removed: changes.removed,
        impact: changes.impact
      })),
      materials: baseMaterials,
      design_style: designStyle || 'Modern'
    });

    // Return the formatted materials
    res.json({
      materials: response.data.materials,
      total_cost: response.data.total_cost
    });
  } catch (error) {
    console.error('Error estimating materials:', error);
    res.status(500).json({ error: 'Failed to estimate materials' });
  }
});

export default router;