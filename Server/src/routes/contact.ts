import { Router } from 'express';
import { ContactController } from '../controllers/contactController';

const router = Router();
const contactController = new ContactController();

// Public routes
router.post('/submit', contactController.submitContact);

// Admin routes (protected - uncomment middleware when auth is ready)
// Note: Specific routes must come before parameterized routes
router.get('/leads/analytics', /* adminAuth, */ contactController.getLeadsAnalytics);
router.get('/', /* adminAuth, */ contactController.getContacts);
router.get('/:id', /* adminAuth, */ contactController.getContactById);
router.put('/:id/status', /* adminAuth, */ contactController.updateContactStatus);
router.post('/:id/reply', /* adminAuth, */ contactController.replyToContact);
router.delete('/:id', /* adminAuth, */ contactController.deleteContact);

export default router;
