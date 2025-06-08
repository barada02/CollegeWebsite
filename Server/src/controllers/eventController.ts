import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import Event, { IEvent } from '../models/Event';

// Get all events
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    // Query parameters for filtering
    const { past, upcoming, limit = 10, page = 1 } = req.query;
    
    // Build query based on filters
    let query: any = {};
    
    // Filter by date if specified
    const currentDate = new Date();
    if (past === 'true') {
      query.date = { $lt: currentDate };
    } else if (upcoming === 'true') {
      query.date = { $gte: currentDate };
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Execute query with pagination and sorting
    const events = await Event.find(query)
      .sort({ date: upcoming === 'true' ? 1 : -1 }) // Ascending for upcoming, descending for past
      .skip(skip)
      .limit(Number(limit));
    
    // Get total count for pagination
    const total = await Event.countDocuments(query);
    
    res.status(200).json({
      events,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error while fetching events' });
  }
};

// Get single event by ID
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Server error while fetching event' });
  }
};

// Create new event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { title, description, date, location, image, registrationLink, organizer } = req.body;
    
    // Create new event
    const newEvent = new Event({
      title,
      description,
      date,
      location,
      image,
      registrationLink,
      organizer
    });
    
    // Save to database
    const savedEvent = await newEvent.save();
    
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error while creating event' });
  }
};

// Update an event
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  try {
    const { title, description, date, location, image, registrationLink, organizer } = req.body;
    
    // Build event object
    const eventFields: Partial<IEvent> = {};
    if (title !== undefined) eventFields.title = title;
    if (description !== undefined) eventFields.description = description;
    if (date !== undefined) eventFields.date = new Date(date);
    if (location !== undefined) eventFields.location = location;
    if (image !== undefined) eventFields.image = image;
    if (registrationLink !== undefined) eventFields.registrationLink = registrationLink;
    if (organizer !== undefined) eventFields.organizer = organizer;
    
    // Update event
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: eventFields },
      { new: true }
    );
    
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    
    res.status(200).json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Server error while updating event' });
  }
};

// Delete an event
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    // Find and remove event
    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    
    res.status(200).json({ message: 'Event removed' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Server error while deleting event' });
  }
};
