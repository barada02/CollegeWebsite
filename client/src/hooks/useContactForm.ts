import { useState } from 'react';
import ContactApiService from '../services/contactApi';
import type { ContactFormData, ContactResponse } from '../services/contactApi';

export const useContactForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submitContact = async (formData: ContactFormData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response: ContactResponse = await ContactApiService.submitContact(formData);

      if (response.success) {
        setSuccess(true);
        return true;
      } else {
        setError(response.message || 'Failed to submit contact form');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setError(null);
    setLoading(false);
  };

  return {
    loading,
    success,
    error,
    submitContact,
    resetForm,
  };
};
