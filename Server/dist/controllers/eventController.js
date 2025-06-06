"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEventById = exports.getAllEvents = void 0;
const express_validator_1 = require("express-validator");
const Event_1 = __importDefault(require("../models/Event"));
// Get all events
const getAllEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Query parameters for filtering
        const { past, upcoming, limit = 10, page = 1 } = req.query;
        // Build query based on filters
        let query = {};
        // Filter by date if specified
        const currentDate = new Date();
        if (past === 'true') {
            query.date = { $lt: currentDate };
        }
        else if (upcoming === 'true') {
            query.date = { $gte: currentDate };
        }
        // Calculate pagination
        const skip = (Number(page) - 1) * Number(limit);
        // Execute query with pagination and sorting
        const events = yield Event_1.default.find(query)
            .sort({ date: upcoming === 'true' ? 1 : -1 }) // Ascending for upcoming, descending for past
            .skip(skip)
            .limit(Number(limit));
        // Get total count for pagination
        const total = yield Event_1.default.countDocuments(query);
        res.status(200).json({
            events,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server error while fetching events' });
    }
});
exports.getAllEvents = getAllEvents;
// Get single event by ID
const getEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = yield Event_1.default.findById(req.params.id);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        res.status(200).json(event);
    }
    catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Server error while fetching event' });
    }
});
exports.getEventById = getEventById;
// Create new event
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const { title, description, date, location, image, registrationLink, organizer } = req.body;
        // Create new event
        const newEvent = new Event_1.default({
            title,
            description,
            date,
            location,
            image,
            registrationLink,
            organizer
        });
        // Save to database
        const savedEvent = yield newEvent.save();
        res.status(201).json(savedEvent);
    }
    catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Server error while creating event' });
    }
});
exports.createEvent = createEvent;
// Update an event
const updateEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Check for validation errors
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const { title, description, date, location, image, registrationLink, organizer } = req.body;
        // Build event object
        const eventFields = {};
        if (title !== undefined)
            eventFields.title = title;
        if (description !== undefined)
            eventFields.description = description;
        if (date !== undefined)
            eventFields.date = new Date(date);
        if (location !== undefined)
            eventFields.location = location;
        if (image !== undefined)
            eventFields.image = image;
        if (registrationLink !== undefined)
            eventFields.registrationLink = registrationLink;
        if (organizer !== undefined)
            eventFields.organizer = organizer;
        // Update event
        const event = yield Event_1.default.findByIdAndUpdate(req.params.id, { $set: eventFields }, { new: true });
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        res.status(200).json(event);
    }
    catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Server error while updating event' });
    }
});
exports.updateEvent = updateEvent;
// Delete an event
const deleteEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find and remove event
        const event = yield Event_1.default.findByIdAndDelete(req.params.id);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        res.status(200).json({ message: 'Event removed' });
    }
    catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Server error while deleting event' });
    }
});
exports.deleteEvent = deleteEvent;
//# sourceMappingURL=eventController.js.map