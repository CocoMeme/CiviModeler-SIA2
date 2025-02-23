import express from 'express';
import { createContractor, getAllContractors, updateContractor, deleteContractor, getContractorById } from '../controllers/contractorController.js';

const router = express.Router();

router.post('/create', createContractor);
router.get('/all', getAllContractors);
router.put('/update/:id', updateContractor);
router.delete('/delete/:id', deleteContractor);
router.get('/:id', getContractorById);

export default router;