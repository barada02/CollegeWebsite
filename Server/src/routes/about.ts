import { Router } from 'express';
import { AboutController } from '../controllers/aboutController';
// import { adminAuth } from '../middleware/adminAuth'; // Uncomment when auth is implemented

const router = Router();
const aboutController = new AboutController();

// Public routes
router.get('/', aboutController.getAbout);

// Admin routes (protected - uncomment middleware when auth is ready)
router.put('/', /* adminAuth, */ aboutController.updateAbout);
router.put('/stats', /* adminAuth, */ aboutController.updateStats);
router.post('/achievements', /* adminAuth, */ aboutController.addAchievement);
router.delete('/achievements/:id', /* adminAuth, */ aboutController.deleteAchievement);
router.post('/leadership', /* adminAuth, */ aboutController.addLeadershipMember);
router.delete('/leadership/:id', /* adminAuth, */ aboutController.deleteLeadershipMember);

// Development/initialization route (remove in production)
router.post('/initialize', aboutController.initializeAbout);

export default router;
