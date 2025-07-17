import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface DashboardStats {
  totalContacts: number;
  totalEvents: number;
  totalFaculty: number;
  totalAboutSections: number;
  contactsByStatus: {
    new: number;
    read: number;
    replied: number;
    archived: number;
  };
  recentContacts: Array<{
    id: string;
    name: string;
    email: string;
    subject: string;
    status: string;
    submittedAt: string;
  }>;
  recentEvents: Array<{
    id: string;
    title: string;
    date: string;
    location: string;
  }>;
}

export class DashboardService {
  /**
   * Get dashboard statistics
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [contactsResponse, eventsResponse, facultyResponse] = await Promise.all([
        api.get('/contact'),
        api.get('/events'),
        api.get('/faculty')
      ]);

      const contacts = contactsResponse.data.success ? contactsResponse.data.data.contacts : [];
      const events = eventsResponse.data.events || eventsResponse.data;
      const faculty = facultyResponse.data.success ? facultyResponse.data.data.faculty : [];

      // Calculate contact status distribution
      const contactsByStatus = {
        new: contacts.filter((c: any) => c.status === 'new').length,
        read: contacts.filter((c: any) => c.status === 'read').length,
        replied: contacts.filter((c: any) => c.status === 'replied').length,
        archived: contacts.filter((c: any) => c.status === 'archived').length,
      };

      // Get recent contacts (last 5)
      const recentContacts = contacts
        .sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
        .slice(0, 5)
        .map((contact: any) => ({
          id: contact._id,
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          status: contact.status,
          submittedAt: contact.submittedAt
        }));

      // Get recent events (last 3)
      const recentEvents = events
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)
        .map((event: any) => ({
          id: event._id,
          title: event.title,
          date: event.date,
          location: event.location || 'TBA'
        }));

      return {
        totalContacts: contacts.length,
        totalEvents: events.length,
        totalFaculty: faculty.length,
        totalAboutSections: 4, // Static for about sections
        contactsByStatus,
        recentContacts,
        recentEvents
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }

  /**
   * Get quick activity summary
   */
  static async getRecentActivity(): Promise<Array<{
    id: string;
    type: 'contact' | 'event' | 'faculty';
    description: string;
    timestamp: string;
    icon: string;
  }>> {
    try {
      const stats = await this.getDashboardStats();
      const activities: Array<{
        id: string;
        type: 'contact' | 'event' | 'faculty';
        description: string;
        timestamp: string;
        icon: string;
      }> = [];

      // Add recent contact activities
      stats.recentContacts.slice(0, 3).forEach(contact => {
        activities.push({
          id: `contact-${contact.id}`,
          type: 'contact' as const,
          description: `New inquiry from ${contact.name} - ${contact.subject}`,
          timestamp: contact.submittedAt,
          icon: '📧'
        });
      });

      // Add recent event activities
      stats.recentEvents.slice(0, 2).forEach(event => {
        activities.push({
          id: `event-${event.id}`,
          type: 'event' as const,
          description: `Event "${event.title}" scheduled for ${new Date(event.date).toLocaleDateString()}`,
          timestamp: event.date,
          icon: '📅'
        });
      });

      // Sort by timestamp (most recent first)
      return activities.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ).slice(0, 5);

    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return [];
    }
  }
}
