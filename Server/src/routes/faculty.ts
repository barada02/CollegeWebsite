import { Router } from 'express';
import { FacultyController } from '../controllers/facultyController';

const router = Router();
const facultyController = new FacultyController();

// Public routes
router.get('/', facultyController.getFaculty);
router.get('/department/:departmentId', facultyController.getFacultyByDepartment);
router.get('/search', facultyController.searchFaculty);
router.get('/stats', facultyController.getFacultyStats);
router.get('/:id', facultyController.getFacultyById);

// Admin routes (protected - uncomment middleware when auth is ready)
router.post('/', /* adminAuth, */ facultyController.createFaculty);
router.put('/:id', /* adminAuth, */ facultyController.updateFaculty);
router.delete('/:id', /* adminAuth, */ facultyController.deleteFaculty);

export default router;
