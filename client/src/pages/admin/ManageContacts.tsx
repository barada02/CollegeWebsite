import React, { useState, useEffect } from 'react';
import Button from '../../components/shared/Button';
import ContactApiService from '../../services/contactApi';
import type { ContactSubmission, ContactListResponse } from '../../services/contactApi';
import './ManageContacts.css';

export const ManageContacts: React.FC = () => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [statusSummary, setStatusSummary] = useState<{ [key: string]: number }>({});
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  // Load contacts
  const loadContacts = async (page = 1, status?: string, search?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: ContactListResponse = await ContactApiService.getContacts(
        page,
        10,
        status === 'all' ? undefined : status,
        search || undefined
      );

      if (response.success && response.data) {
        setContacts(response.data.contacts);
        setPagination(response.data.pagination);
        setStatusSummary(response.data.statusSummary);
      } else {
        setError(response.message || 'Failed to load contacts');
      }
    } catch (err) {
      setError('Error loading contacts');
      console.error('Error loading contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadContacts(currentPage, statusFilter, searchTerm);
  }, [currentPage, statusFilter, searchTerm]);

  // Handle status filter change
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // View contact details
  const handleViewContact = async (contact: ContactSubmission) => {
    try {
      const response = await ContactApiService.getContactById(contact._id!);
      if (response.success && response.data) {
        setSelectedContact(response.data);
        setAdminNotes(response.data.adminNotes || '');
        // Reload contacts to update status if it was marked as read
        loadContacts(currentPage, statusFilter, searchTerm);
      }
    } catch (err) {
      console.error('Error fetching contact details:', err);
    }
  };

  // Update contact status
  const handleStatusUpdate = async (contactId: string, newStatus: string) => {
    try {
      setUpdating(true);
      const response = await ContactApiService.updateContactStatus(
        contactId,
        newStatus,
        adminNotes
      );

      if (response.success) {
        // Update selected contact
        if (selectedContact && selectedContact._id === contactId) {
          setSelectedContact({
            ...selectedContact,
            status: newStatus as any,
            adminNotes,
            repliedAt: newStatus === 'replied' ? new Date().toISOString() : selectedContact.repliedAt
          });
        }
        
        // Reload contacts
        loadContacts(currentPage, statusFilter, searchTerm);
      } else {
        setError(response.message || 'Failed to update status');
      }
    } catch (err) {
      setError('Error updating contact status');
      console.error('Error updating contact status:', err);
    } finally {
      setUpdating(false);
    }
  };

  // Delete contact
  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) {
      return;
    }

    try {
      setUpdating(true);
      const response = await ContactApiService.deleteContact(contactId);

      if (response.success) {
        // Close modal if deleted contact was selected
        if (selectedContact && selectedContact._id === contactId) {
          setSelectedContact(null);
        }
        
        // Reload contacts
        loadContacts(currentPage, statusFilter, searchTerm);
      } else {
        setError(response.message || 'Failed to delete contact');
      }
    } catch (err) {
      setError('Error deleting contact');
      console.error('Error deleting contact:', err);
    } finally {
      setUpdating(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new': return 'status-new';
      case 'read': return 'status-read';
      case 'replied': return 'status-replied';
      case 'archived': return 'status-archived';
      default: return 'status-new';
    }
  };

  return (
    <div className="manage-contacts">
      <div className="page-header">
        <h1>Manage Contacts</h1>
        <p>View and manage contact form submissions</p>
      </div>

      {/* Status Summary */}
      <div className="status-summary">
        <div className="summary-cards">
          <div 
            className={`summary-card ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleStatusFilterChange('all')}
          >
            <h3>Total</h3>
            <p>{Object.values(statusSummary).reduce((sum, count) => sum + count, 0)}</p>
          </div>
          <div 
            className={`summary-card new ${statusFilter === 'new' ? 'active' : ''}`}
            onClick={() => handleStatusFilterChange('new')}
          >
            <h3>New</h3>
            <p>{statusSummary.new || 0}</p>
          </div>
          <div 
            className={`summary-card read ${statusFilter === 'read' ? 'active' : ''}`}
            onClick={() => handleStatusFilterChange('read')}
          >
            <h3>Read</h3>
            <p>{statusSummary.read || 0}</p>
          </div>
          <div 
            className={`summary-card replied ${statusFilter === 'replied' ? 'active' : ''}`}
            onClick={() => handleStatusFilterChange('replied')}
          >
            <h3>Replied</h3>
            <p>{statusSummary.replied || 0}</p>
          </div>
          <div 
            className={`summary-card archived ${statusFilter === 'archived' ? 'active' : ''}`}
            onClick={() => handleStatusFilterChange('archived')}
          >
            <h3>Archived</h3>
            <p>{statusSummary.archived || 0}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search by name, email, or subject..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <Button variant="admin" size="sm" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </div>
      )}

      {/* Contacts Table */}
      <div className="contacts-section">
        {loading ? (
          <div className="loading-state">
            <p>Loading contacts...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="empty-state">
            <h3>No contacts found</h3>
            <p>No contact submissions match your current filters.</p>
          </div>
        ) : (
          <>
            <div className="contacts-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact._id}>
                      <td>{formatDate(contact.submittedAt)}</td>
                      <td>{contact.name}</td>
                      <td>{contact.email}</td>
                      <td className="subject-cell" title={contact.subject}>
                        {contact.subject.length > 30 
                          ? `${contact.subject.substring(0, 30)}...` 
                          : contact.subject
                        }
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(contact.status)}`}>
                          {contact.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Button
                            variant="admin"
                            size="sm"
                            onClick={() => handleViewContact(contact)}
                          >
                            View
                          </Button>
                          <Button
                            variant="admin"
                            size="sm"
                            onClick={() => handleDeleteContact(contact._id!)}
                            disabled={updating}
                            className="delete-btn"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <Button
                  variant="admin"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="page-info">
                  Page {pagination.currentPage} of {pagination.totalPages} 
                  ({pagination.totalItems} total)
                </span>
                <Button
                  variant="admin"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="modal-overlay" onClick={() => setSelectedContact(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Contact Details</h2>
              <button 
                className="close-button"
                onClick={() => setSelectedContact(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="contact-info">
                <div className="info-row">
                  <label>Name:</label>
                  <span>{selectedContact.name}</span>
                </div>
                <div className="info-row">
                  <label>Email:</label>
                  <span>{selectedContact.email}</span>
                </div>
                {selectedContact.phone && (
                  <div className="info-row">
                    <label>Phone:</label>
                    <span>{selectedContact.phone}</span>
                  </div>
                )}
                <div className="info-row">
                  <label>Subject:</label>
                  <span>{selectedContact.subject}</span>
                </div>
                <div className="info-row">
                  <label>Submitted:</label>
                  <span>{formatDate(selectedContact.submittedAt)}</span>
                </div>
                <div className="info-row">
                  <label>Status:</label>
                  <span className={`status-badge ${getStatusBadgeClass(selectedContact.status)}`}>
                    {selectedContact.status}
                  </span>
                </div>
                {selectedContact.repliedAt && (
                  <div className="info-row">
                    <label>Replied:</label>
                    <span>{formatDate(selectedContact.repliedAt)}</span>
                  </div>
                )}
              </div>

              <div className="message-section">
                <label>Message:</label>
                <div className="message-content">
                  {selectedContact.message}
                </div>
              </div>

              <div className="admin-section">
                <div className="status-update">
                  <label>Update Status:</label>
                  <div className="status-buttons">
                    <Button
                      variant={selectedContact.status === 'new' ? 'admin' : 'college'}
                      size="sm"
                      onClick={() => handleStatusUpdate(selectedContact._id!, 'new')}
                      disabled={updating}
                      className={selectedContact.status !== 'new' ? 'outline-btn' : ''}
                    >
                      New
                    </Button>
                    <Button
                      variant={selectedContact.status === 'read' ? 'admin' : 'college'}
                      size="sm"
                      onClick={() => handleStatusUpdate(selectedContact._id!, 'read')}
                      disabled={updating}
                      className={selectedContact.status !== 'read' ? 'outline-btn' : ''}
                    >
                      Read
                    </Button>
                    <Button
                      variant={selectedContact.status === 'replied' ? 'admin' : 'college'}
                      size="sm"
                      onClick={() => handleStatusUpdate(selectedContact._id!, 'replied')}
                      disabled={updating}
                      className={selectedContact.status !== 'replied' ? 'outline-btn' : ''}
                    >
                      Replied
                    </Button>
                    <Button
                      variant={selectedContact.status === 'archived' ? 'admin' : 'college'}
                      size="sm"
                      onClick={() => handleStatusUpdate(selectedContact._id!, 'archived')}
                      disabled={updating}
                      className={selectedContact.status !== 'archived' ? 'outline-btn' : ''}
                    >
                      Archived
                    </Button>
                  </div>
                </div>

                <div className="admin-notes">
                  <label htmlFor="adminNotes">Admin Notes:</label>
                  <textarea
                    id="adminNotes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes about this contact..."
                    rows={4}
                  />
                  <Button
                    variant="admin"
                    size="sm"
                    onClick={() => handleStatusUpdate(selectedContact._id!, selectedContact.status)}
                    disabled={updating}
                  >
                    {updating ? 'Updating...' : 'Save Notes'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageContacts;
