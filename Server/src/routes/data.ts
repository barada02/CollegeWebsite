import express from 'express';
import { getAllData, createData } from '../controllers/dataController';

const router = express.Router();

// GET all data
router.get('/', getAllData);

// POST create new data
router.post('/', createData);

export default router;
