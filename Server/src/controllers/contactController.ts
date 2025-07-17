import { Request, Response } from 'express';
import Contact, { IContact } from '../models/Contact';
import EmailService from '../services/emailService';

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

  // Reply to contact submission (admin only)
  public async replyToContact(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { replyMessage } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Contact ID is required'
        });
        return;
      }

      if (!replyMessage || replyMessage.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: 'Reply message is required'
        });
        return;
      }

      if (replyMessage.trim().length < 10) {
        res.status(400).json({
          success: false,
          message: 'Reply message must be at least 10 characters long'
        });
        return;
      }

      // Find the contact
      const contact = await Contact.findById(id);

      if (!contact) {
        res.status(404).json({
          success: false,
          message: 'Contact submission not found'
        });
        return;
      }

      // Initialize email service
      const emailService = new EmailService();

      // Verify email service connection
      const isEmailServiceReady = await emailService.verifyConnection();
      if (!isEmailServiceReady) {
        res.status(500).json({
          success: false,
          message: 'Email service is not available. Please try again later.'
        });
        return;
      }

      // Send reply email
      const emailSent = await emailService.sendContactReply(contact, replyMessage.trim());

      if (!emailSent) {
        res.status(500).json({
          success: false,
          message: 'Failed to send reply email. Please try again.'
        });
        return;
      }

      // Update contact with reply message in adminNotes and set status to replied
      contact.adminNotes = replyMessage.trim();
      contact.status = 'replied';
      contact.repliedAt = new Date();
      
      await contact.save();

      res.status(200).json({
        success: true,
        message: 'Reply sent successfully and contact updated',
        data: contact
      });

    } catch (error) {
      console.error('Error replying to contact:', error);
      res.status(500).json({
        success: false,
        message: 'Error sending reply. Please try again later.',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get leads analytics for admin dashboard
  public async getLeadsAnalytics(req: Request, res: Response): Promise<void> {
    try {
      console.log('getLeadsAnalytics called with query:', req.query);
      
      const { startDate, endDate, subject, status } = req.query;

      // Build filter criteria
      const filter: any = {};

      // Date range filter
      if (startDate || endDate) {
        filter.submittedAt = {};
        if (startDate) {
          const start = new Date(startDate as string);
          if (isNaN(start.getTime())) {
            res.status(400).json({
              success: false,
              message: 'Invalid start date format'
            });
            return;
          }
          filter.submittedAt.$gte = start;
        }
        if (endDate) {
          const end = new Date(endDate as string);
          if (isNaN(end.getTime())) {
            res.status(400).json({
              success: false,
              message: 'Invalid end date format'
            });
            return;
          }
          filter.submittedAt.$lte = end;
        }
      }

      // Subject filter
      if (subject && subject !== '') {
        filter.subject = { $regex: subject, $options: 'i' };
      }

      // Status filter
      if (status && status !== '') {
        filter.status = status;
      }

      console.log('Filter criteria:', filter);

      // Get filtered contacts
      const contacts = await Contact.find(filter).sort({ submittedAt: -1 });
      console.log(`Found ${contacts.length} contacts`);

      // Calculate analytics
      const analytics = this.calculateLeadsAnalytics(contacts);

      res.json({
        success: true,
        data: {
          contacts,
          analytics,
          filters: { startDate, endDate, subject, status },
          total: contacts.length
        }
      });

    } catch (error) {
      console.error('Error getting leads analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching leads analytics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Calculate leads analytics
  private calculateLeadsAnalytics(contacts: IContact[]) {
    const total = contacts.length;
    
    // Status breakdown
    const statusBreakdown = {
      new: contacts.filter(c => c.status === 'new').length,
      read: contacts.filter(c => c.status === 'read').length,
      replied: contacts.filter(c => c.status === 'replied').length,
      archived: contacts.filter(c => c.status === 'archived').length
    };

    // Priority calculation based on keywords
    const highPriorityKeywords = [
      'admission', 'enrollment', 'apply', 'application', 'program', 'course',
      'fee', 'fees', 'scholarship', 'deadline', 'urgent', 'immediate'
    ];
    
    const mediumPriorityKeywords = [
      'information', 'details', 'about', 'inquiry', 'question', 'help',
      'guidance', 'counseling', 'career', 'placement'
    ];

    const priorityBreakdown = {
      high: 0,
      medium: 0,
      low: 0
    };

    contacts.forEach(contact => {
      const text = (contact.subject + ' ' + contact.message).toLowerCase();
      
      const hasHighPriority = highPriorityKeywords.some(keyword => text.includes(keyword));
      const hasMediumPriority = mediumPriorityKeywords.some(keyword => text.includes(keyword));
      
      if (hasHighPriority) {
        priorityBreakdown.high++;
      } else if (hasMediumPriority) {
        priorityBreakdown.medium++;
      } else {
        priorityBreakdown.low++;
      }
    });

    // Subject analysis
    const subjectAnalysis: { [key: string]: number } = {};
    contacts.forEach(contact => {
      const subject = contact.subject.toLowerCase();
      // Extract key topics
      if (subject.includes('admission') || subject.includes('enrollment')) {
        subjectAnalysis['Admissions'] = (subjectAnalysis['Admissions'] || 0) + 1;
      } else if (subject.includes('course') || subject.includes('program')) {
        subjectAnalysis['Courses'] = (subjectAnalysis['Courses'] || 0) + 1;
      } else if (subject.includes('fee') || subject.includes('scholarship')) {
        subjectAnalysis['Financial'] = (subjectAnalysis['Financial'] || 0) + 1;
      } else if (subject.includes('placement') || subject.includes('career')) {
        subjectAnalysis['Placement'] = (subjectAnalysis['Placement'] || 0) + 1;
      } else {
        subjectAnalysis['General'] = (subjectAnalysis['General'] || 0) + 1;
      }
    });

    // Time-based analysis (last 7 days vs previous period)
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const previous7Days = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentLeads = contacts.filter(c => new Date(c.submittedAt) >= last7Days).length;
    const previousLeads = contacts.filter(c => 
      new Date(c.submittedAt) >= previous7Days && 
      new Date(c.submittedAt) < last7Days
    ).length;

    const growth = previousLeads > 0 ? ((recentLeads - previousLeads) / previousLeads) * 100 : 0;

    // Potential students (based on admin notes and keywords)
    const potentialStudents = contacts.filter(contact => {
      const notes = contact.adminNotes?.toLowerCase() || '';
      const text = (contact.subject + ' ' + contact.message).toLowerCase();
      
      return notes.includes('student') || 
             notes.includes('admission') || 
             notes.includes('enrollment') ||
             text.includes('admission') ||
             text.includes('enrollment') ||
             text.includes('apply');
    }).length;

    const conversionRate = total > 0 ? Math.round((potentialStudents / total) * 100 * 100) / 100 : 0;

    return {
      totalLeads: total,
      statusBreakdown,
      priorityBreakdown,
      subjectAnalysis,
      recentLeads,
      growth: Math.round(growth * 100) / 100,
      potentialStudents,
      conversionRate,
      responseRate: total > 0 ? Math.round((statusBreakdown.replied / total) * 100 * 100) / 100 : 0
    };
  }
}
