import { Request, Response } from 'express';
import Contact, { IContact } from '../models/Contact';

export class ContactController {
  // Submit contact form (public endpoint)
  public async submitContact(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, phone, subject, message } = req.body;

      // Validate required fields
      if (!name || !email || !subject || !message) {
        res.status(400).json({
          success: false,
          message: 'Name, email, subject, and message are required'
        });
        return;
      }

      // Validate email format
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
        return;
      }

      // Validate message length
      if (message.length < 10) {
        res.status(400).json({
          success: false,
          message: 'Message must be at least 10 characters long'
        });
        return;
      }

      if (message.length > 2000) {
        res.status(400).json({
          success: false,
          message: 'Message cannot exceed 2000 characters'
        });
        return;
      }

      // Create new contact submission
      const newContact = new Contact({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : undefined,
        subject: subject.trim(),
        message: message.trim(),
        status: 'new'
      });

      await newContact.save();

      res.status(201).json({
        success: true,
        message: 'Thank you for your message! We will get back to you soon.',
        data: {
          id: newContact._id,
          submittedAt: newContact.submittedAt
        }
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      res.status(500).json({
        success: false,
        message: 'Error submitting your message. Please try again later.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get all contact submissions (admin only)
  public async getContacts(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        search
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build query
      const query: any = {};
      
      if (status && typeof status === 'string') {
        query.status = status;
      }

      if (search && typeof search === 'string') {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } }
        ];
      }

      // Get contacts with pagination
      const contacts = await Contact.find(query)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limitNum);

      // Get total count for pagination
      const total = await Contact.countDocuments(query);

      // Get status counts
      const statusCounts = await Contact.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const statusSummary = statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      res.status(200).json({
        success: true,
        data: {
          contacts,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalItems: total,
            itemsPerPage: limitNum
          },
          statusSummary
        }
      });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching contact submissions',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get single contact by ID (admin only)
  public async getContactById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Contact ID is required'
        });
        return;
      }

      const contact = await Contact.findById(id);

      if (!contact) {
        res.status(404).json({
          success: false,
          message: 'Contact submission not found'
        });
        return;
      }

      // Mark as read if it was new
      if (contact.status === 'new') {
        contact.status = 'read';
        await contact.save();
      }

      res.status(200).json({
        success: true,
        data: contact
      });
    } catch (error) {
      console.error('Error fetching contact:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching contact submission',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update contact status (admin only)
  public async updateContactStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, adminNotes } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Contact ID is required'
        });
        return;
      }

      const validStatuses = ['new', 'read', 'replied', 'archived'];
      if (status && !validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
        });
        return;
      }

      const contact = await Contact.findById(id);

      if (!contact) {
        res.status(404).json({
          success: false,
          message: 'Contact submission not found'
        });
        return;
      }

      // Update fields
      if (status) {
        contact.status = status;
        if (status === 'replied') {
          contact.repliedAt = new Date();
        }
      }
      
      if (adminNotes !== undefined) {
        contact.adminNotes = adminNotes;
      }

      await contact.save();

      res.status(200).json({
        success: true,
        message: 'Contact status updated successfully',
        data: contact
      });
    } catch (error) {
      console.error('Error updating contact status:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating contact status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete contact submission (admin only)
  public async deleteContact(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Contact ID is required'
        });
        return;
      }

      const contact = await Contact.findByIdAndDelete(id);

      if (!contact) {
        res.status(404).json({
          success: false,
          message: 'Contact submission not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Contact submission deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting contact submission',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
