import { Router } from 'express';
import { CourseController } from '../controllers/courseController';

const router = Router();
const courseController = new CourseController();

// Public routes
router.get('/', courseController.getCourses);
router.get('/level/:level', courseController.getCoursesByLevel);
router.get('/department/:departmentId', courseController.getCoursesByDepartment);
router.get('/search', courseController.searchCourses);
router.get('/:id', courseController.getCourseById);

// Admin routes (protected - uncomment middleware when auth is ready)
router.post('/', /* adminAuth, */ courseController.createCourse);
router.put('/:id', /* adminAuth, */ courseController.updateCourse);
router.delete('/:id', /* adminAuth, */ courseController.deleteCourse);

export default router;
