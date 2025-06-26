import { useState } from 'react';
import ContactApiService from '../services/contactApi';
import type { ContactSubmission, ContactListResponse } from '../services/contactApi';

export const useContactsManagement = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [statusSummary, setStatusSummary] = useState<{ [key: string]: number }>({});

  const loadContacts = async (
    page = 1,
    limit = 10,
    status?: string,
    search?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response: ContactListResponse = await ContactApiService.getContacts(
        page,
        limit,
        status === 'all' ? undefined : status,
        search || undefined
      );

      if (response.success && response.data) {
        setContacts(response.data.contacts);
        setPagination(response.data.pagination);
        setStatusSummary(response.data.statusSummary);
        return true;
      } else {
        setError(response.message || 'Failed to load contacts');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error loading contacts';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getContactById = async (id: string): Promise<ContactSubmission | null> => {
    try {
      setError(null);
      const response = await ContactApiService.getContactById(id);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch contact details');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching contact details';
      setError(errorMessage);
      return null;
    }
  };

  const updateContactStatus = async (
    id: string,
    status: string,
    adminNotes?: string
  ): Promise<boolean> => {
    try {
      setError(null);
      const response = await ContactApiService.updateContactStatus(id, status, adminNotes);
      
      if (response.success) {
        // Update the contact in the local state if it exists
        setContacts(prevContacts => 
          prevContacts.map(contact => 
            contact._id === id 
              ? { 
                  ...contact, 
                  status: status as any, 
                  adminNotes,
                  repliedAt: status === 'replied' ? new Date().toISOString() : contact.repliedAt
                }
              : contact
          )
        );
        return true;
      } else {
        setError(response.message || 'Failed to update contact status');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error updating contact status';
      setError(errorMessage);
      return false;
    }
  };

  const deleteContact = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      const response = await ContactApiService.deleteContact(id);
      
      if (response.success) {
        // Remove the contact from local state
        setContacts(prevContacts => prevContacts.filter(contact => contact._id !== id));
        
        // Update pagination if needed
        setPagination(prev => ({
          ...prev,
          totalItems: prev.totalItems - 1
        }));
        
        return true;
      } else {
        setError(response.message || 'Failed to delete contact');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error deleting contact';
      setError(errorMessage);
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    // State
    contacts,
    loading,
    error,
    pagination,
    statusSummary,
    
    // Actions
    loadContacts,
    getContactById,
    updateContactStatus,
    deleteContact,
    clearError,
  };
};
