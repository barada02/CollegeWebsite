import { Router } from 'express';
import { ContactController } from '../controllers/contactController';

const router = Router();
const contactController = new ContactController();

// Public routes
router.post('/submit', contactController.submitContact);

// Admin routes (protected - uncomment middleware when auth is ready)
router.get('/', /* adminAuth, */ contactController.getContacts);
router.get('/:id', /* adminAuth, */ contactController.getContactById);
router.put('/:id/status', /* adminAuth, */ contactController.updateContactStatus);
router.delete('/:id', /* adminAuth, */ contactController.deleteContact);

export default router;
