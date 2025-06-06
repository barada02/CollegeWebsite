"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const eventController_1 = require("../controllers/eventController");
const auth_1 = require("../middleware/auth");
const adminAuth_1 = require("../middleware/adminAuth");
const router = express_1.default.Router();
// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', eventController_1.getAllEvents);
// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', eventController_1.getEventById);
// @route   POST /api/events
// @desc    Create a new event
// @access  Private/Admin
router.post('/', [
    auth_1.auth,
    adminAuth_1.adminAuth,
    (0, express_validator_1.check)('title', 'Title is required').not().isEmpty(),
    (0, express_validator_1.check)('description', 'Description is required').not().isEmpty(),
    (0, express_validator_1.check)('date', 'Valid date is required').isISO8601().toDate(),
    (0, express_validator_1.check)('location', 'Location is required').not().isEmpty(),
    (0, express_validator_1.check)('organizer', 'Organizer is required').not().isEmpty()
], eventController_1.createEvent);
// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private/Admin
router.put('/:id', [
    auth_1.auth,
    adminAuth_1.adminAuth,
    (0, express_validator_1.check)('title', 'Title is required if provided').optional().not().isEmpty(),
    (0, express_validator_1.check)('description', 'Description is required if provided').optional().not().isEmpty(),
    (0, express_validator_1.check)('date', 'Valid date is required if provided').optional().isISO8601().toDate(),
    (0, express_validator_1.check)('location', 'Location is required if provided').optional().not().isEmpty(),
    (0, express_validator_1.check)('organizer', 'Organizer is required if provided').optional().not().isEmpty()
], eventController_1.updateEvent);
// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private/Admin
router.delete('/:id', [auth_1.auth, adminAuth_1.adminAuth], eventController_1.deleteEvent);
exports.default = router;
//# sourceMappingURL=events.js.map