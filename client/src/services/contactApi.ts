import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Contact API interface types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactSubmission {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  submittedAt: string;
  repliedAt?: string;
  adminNotes?: string;
}

export interface ContactResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    submittedAt: string;
  };
  error?: string;
}

export interface ContactListResponse {
  success: boolean;
  data?: {
    contacts: ContactSubmission[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
    statusSummary: { [key: string]: number };
  };
  message?: string;
  error?: string;
}

// Contact API service
export class ContactApiService {
  // Submit contact form (public)
  static async submitContact(formData: ContactFormData): Promise<ContactResponse> {
    try {
      const response = await api.post<ContactResponse>('/contact/submit', formData);
      return response.data;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw new Error('Failed to submit contact form');
    }
  }

  // Get all contacts (admin)
  static async getContacts(
    page = 1,
    limit = 20,
    status?: string,
    search?: string
  ): Promise<ContactListResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (status) params.append('status', status);
      if (search) params.append('search', search);

      const response = await api.get<ContactListResponse>(`/contact?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw new Error('Failed to fetch contacts');
    }
  }

  // Get contact by ID (admin)
  static async getContactById(id: string): Promise<{ success: boolean; data?: ContactSubmission; message?: string }> {
    try {
      const response = await api.get(`/contact/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contact:', error);
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw new Error('Failed to fetch contact');
    }
  }

  // Update contact status (admin)
  static async updateContactStatus(
    id: string,
    status: string,
    adminNotes?: string
  ): Promise<{ success: boolean; data?: ContactSubmission; message?: string }> {
    try {
      const response = await api.put(`/contact/${id}/status`, { status, adminNotes });
      return response.data;
    } catch (error) {
      console.error('Error updating contact status:', error);
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw new Error('Failed to update contact status');
    }
  }

  // Delete contact (admin)
  static async deleteContact(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.delete(`/contact/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting contact:', error);
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw new Error('Failed to delete contact');
    }
  }

  // Reply to contact (admin)
  static async replyToContact(
    id: string, 
    replyMessage: string
  ): Promise<{ success: boolean; data?: ContactSubmission; message?: string }> {
    try {
      const response = await api.post(`/contact/${id}/reply`, { replyMessage });
      return response.data;
    } catch (error) {
      console.error('Error sending reply:', error);
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw new Error('Failed to send reply');
    }
  }

  // Get leads analytics (admin)
  static async getLeadsAnalytics(params?: {
    startDate?: string;
    endDate?: string;
    subject?: string;
    status?: string;
  }): Promise<{
    success: boolean;
    data?: {
      contacts: ContactSubmission[];
      analytics: any;
      filters: any;
      total: number;
    };
    message?: string;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.startDate) queryParams.append('startDate', params.startDate);
      if (params?.endDate) queryParams.append('endDate', params.endDate);
      if (params?.subject) queryParams.append('subject', params.subject);
      if (params?.status) queryParams.append('status', params.status);

      const response = await api.get(`/contact/leads/analytics?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching leads analytics:', error);
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw new Error('Failed to fetch leads analytics');
    }
  }
}

export default ContactApiService;
