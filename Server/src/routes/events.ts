import express from 'express';
import { check } from 'express-validator';
import { 
  getAllEvents, 
  getEventById, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from '../controllers/eventController';
import { auth } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', getAllEvents);

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', getEventById);

// @route   POST /api/events
// @desc    Create a new event
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    adminAuth,
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('date', 'Valid date is required').isISO8601().toDate(),
    check('location', 'Location is required').not().isEmpty(),
    check('organizer', 'Organizer is required').not().isEmpty()
  ],
  createEvent
);

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private/Admin
router.put(
  '/:id',
  [
    auth,
    adminAuth,
    check('title', 'Title is required if provided').optional().not().isEmpty(),
    check('description', 'Description is required if provided').optional().not().isEmpty(),
    check('date', 'Valid date is required if provided').optional().isISO8601().toDate(),
    check('location', 'Location is required if provided').optional().not().isEmpty(),
    check('organizer', 'Organizer is required if provided').optional().not().isEmpty()
  ],
  updateEvent
);

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private/Admin
router.delete('/:id', [auth, adminAuth], deleteEvent);

export default router;
