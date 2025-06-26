import { Router } from 'express';
import { SchoolController } from '../controllers/schoolController';

const router = Router();
const schoolController = new SchoolController();

// Public routes
router.get('/', schoolController.getSchools);
router.get('/:id', schoolController.getSchoolById);

// Admin routes (protected - uncomment middleware when auth is ready)
router.post('/', /* adminAuth, */ schoolController.createSchool);
router.put('/:id', /* adminAuth, */ schoolController.updateSchool);
router.delete('/:id', /* adminAuth, */ schoolController.deleteSchool);
router.get('/:id/stats', /* adminAuth, */ schoolController.getSchoolStats);

export default router;
