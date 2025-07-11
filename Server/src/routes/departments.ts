import { Router } from 'express';
import { DepartmentController } from '../controllers/departmentController';

const router = Router();
const departmentController = new DepartmentController();

// Public routes
router.get('/', departmentController.getDepartments);
router.get('/school/:schoolId', departmentController.getDepartmentsBySchool);
router.get('/:id', departmentController.getDepartmentById);

// Admin routes (protected - uncomment middleware when auth is ready)
router.post('/', /* adminAuth, */ departmentController.createDepartment);
router.put('/:id', /* adminAuth, */ departmentController.updateDepartment);
router.delete('/:id', /* adminAuth, */ departmentController.deleteDepartment);
router.get('/:id/stats', /* adminAuth, */ departmentController.getDepartmentStats);

export default router;
