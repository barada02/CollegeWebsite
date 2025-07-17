import React, { useState, useEffect } from 'react';
import Button from '../../components/shared/Button';
import ContactApiService from '../../services/contactApi';
import type { ContactSubmission } from '../../services/contactApi';
import { ReportService } from '../../services/reportService';
import './ManageStudentLeads.css';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface FilterOptions {
  dateRange: DateRange;
  subject: string;
  status: string;
  leadStatus: string;
}

export const ManageStudentLeads: React.FC = () => {
  const [leads, setLeads] = useState<ContactSubmission[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: {
      startDate: '',
      endDate: ''
    },
    subject: '',
    status: 'all',
    leadStatus: 'all'
  });

  // Load all leads
  const loadLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ContactApiService.getContacts(1, 1000); // Get all contacts
      
      if (response.success && response.data) {
        setLeads(response.data.contacts);
        setFilteredLeads(response.data.contacts);
      } else {
        setError('Failed to load leads');
      }
    } catch (err) {
      setError('Error loading leads');
      console.error('Error loading leads:', err);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...leads];

    // Date range filter
    if (filters.dateRange.startDate && filters.dateRange.endDate) {
      const startDate = new Date(filters.dateRange.startDate);
      const endDate = new Date(filters.dateRange.endDate);
      endDate.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(lead => {
        const leadDate = new Date(lead.submittedAt);
        return leadDate >= startDate && leadDate <= endDate;
      });
    }

    // Subject filter
    if (filters.subject) {
      filtered = filtered.filter(lead =>
        lead.subject.toLowerCase().includes(filters.subject.toLowerCase())
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    setFilteredLeads(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      dateRange: { startDate: '', endDate: '' },
      subject: '',
      status: 'all',
      leadStatus: 'all'
    });
    setFilteredLeads(leads);
  };

  // Download reports
  const downloadReport = (format: 'csv' | 'excel' | 'pdf') => {
    try {
      if (format === 'csv') {
        ReportService.generateCSVReport(filteredLeads);
      } else if (format === 'excel') {
        ReportService.generateExcelReport(filteredLeads, filters);
      } else if (format === 'pdf') {
        ReportService.generatePDFReport(filteredLeads, filters);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
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
  const getStatusBadge = (status: string) => {
    const classes = {
      new: 'badge-new',
      read: 'badge-read',
      replied: 'badge-replied',
      archived: 'badge-archived'
    };
    return classes[status as keyof typeof classes] || 'badge-default';
  };

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, leads]);

  if (loading) {
    return <div className="loading">Loading student leads...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="manage-student-leads" style={{ 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '25px',
      margin: '-2rem',
      minHeight: 'calc(100vh - 100px)',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div className="page-header" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '15px',
        marginBottom: '30px',
        boxShadow: '0 10px 25px -5px rgba(102, 126, 234, 0.3)',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          margin: '0 0 10px 0',
          fontSize: '2.5rem',
          fontWeight: '800',
          color: 'white'
        }}>Student Leads Management</h1>
        <p style={{
          margin: '0',
          fontSize: '1.1rem',
          opacity: '0.9',
          color: 'white'
        }}>Filter and export student inquiry data</p>
      </div>

      {/* Filters Section */}
      <div className="filters-section" style={{
        background: 'white',
        padding: '25px',
        borderRadius: '12px',
        marginBottom: '25px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0',
          color: '#374151',
          fontSize: '1.3rem',
          fontWeight: '600'
        }}>🔍 Filters</h3>
        <div className="filters-grid">
          {/* Date Range */}
          <div className="filter-group">
            <label>Date Range:</label>
            <div className="date-range">
              <input
                type="date"
                value={filters.dateRange.startDate}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, startDate: e.target.value }
                }))}
                placeholder="Start Date"
              />
              <span>to</span>
              <input
                type="date"
                value={filters.dateRange.endDate}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  dateRange: { ...prev.dateRange, endDate: e.target.value }
                }))}
                placeholder="End Date"
              />
            </div>
          </div>

          {/* Subject Filter */}
          <div className="filter-group">
            <label>Subject Contains:</label>
            <input
              type="text"
              value={filters.subject}
              onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Enter keywords..."
            />
          </div>

          {/* Status Filter */}
          <div className="filter-group">
            <label>Status:</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Filter Actions */}
          <div className="filter-actions">
            <Button onClick={resetFilters} variant="admin">
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary" style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '25px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <div className="summary-item" style={{
          background: 'white',
          padding: '20px 30px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          minWidth: '150px'
        }}>
          <span className="summary-number" style={{
            display: 'block',
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#3b82f6',
            lineHeight: '1',
            marginBottom: '5px'
          }}>{filteredLeads.length}</span>
          <span className="summary-label" style={{
            display: 'block',
            fontSize: '0.95rem',
            color: '#6b7280',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>Total Results</span>
        </div>
        <div className="summary-item" style={{
          background: 'white',
          padding: '20px 30px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          minWidth: '150px'
        }}>
          <span className="summary-number" style={{
            display: 'block',
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#3b82f6',
            lineHeight: '1',
            marginBottom: '5px'
          }}>{leads.length}</span>
          <span className="summary-label" style={{
            display: 'block',
            fontSize: '0.95rem',
            color: '#6b7280',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>Total Leads</span>
        </div>
      </div>

      {/* Export Options */}
      <div className="export-section" style={{
        marginBottom: '25px',
        padding: '25px',
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          margin: '0 0 20px 0',
          color: '#374151',
          fontSize: '1.3rem',
          fontWeight: '600'
        }}>📊 Export Options</h3>
        <div className="export-buttons" style={{
          display: 'flex',
          gap: '15px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <Button onClick={() => downloadReport('csv')} variant="admin">
            📄 Download CSV
          </Button>
          <Button onClick={() => downloadReport('excel')} variant="admin">
            📊 Download Excel
          </Button>
          <Button onClick={() => downloadReport('pdf')} variant="admin">
            📋 Download PDF
          </Button>
        </div>
      </div>

      {/* Leads Table */}
      <div className="leads-table-container" style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        maxHeight: '70vh',
        overflowY: 'auto'
      }}>
        <table className="leads-table" style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.9rem'
        }}>
          <thead>
            <tr>
              <th style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                color: '#475569',
                fontWeight: '700',
                padding: '16px 12px',
                textAlign: 'left',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                border: 'none',
                position: 'sticky',
                top: '0',
                zIndex: '10'
              }}>Date</th>
              <th style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                color: '#475569',
                fontWeight: '700',
                padding: '16px 12px',
                textAlign: 'left',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                border: 'none',
                position: 'sticky',
                top: '0',
                zIndex: '10'
              }}>Name</th>
              <th style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                color: '#475569',
                fontWeight: '700',
                padding: '16px 12px',
                textAlign: 'left',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                border: 'none',
                position: 'sticky',
                top: '0',
                zIndex: '10'
              }}>Email</th>
              <th style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                color: '#475569',
                fontWeight: '700',
                padding: '16px 12px',
                textAlign: 'left',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                border: 'none',
                position: 'sticky',
                top: '0',
                zIndex: '10'
              }}>Phone</th>
              <th style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                color: '#475569',
                fontWeight: '700',
                padding: '16px 12px',
                textAlign: 'left',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                border: 'none',
                position: 'sticky',
                top: '0',
                zIndex: '10'
              }}>Subject</th>
              <th style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                color: '#475569',
                fontWeight: '700',
                padding: '16px 12px',
                textAlign: 'left',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                border: 'none',
                position: 'sticky',
                top: '0',
                zIndex: '10'
              }}>Status</th>
              <th style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                color: '#475569',
                fontWeight: '700',
                padding: '16px 12px',
                textAlign: 'left',
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                border: 'none',
                position: 'sticky',
                top: '0',
                zIndex: '10'
              }}>Message</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-data">
                  No leads found with current filters
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead._id}>
                  <td>{formatDate(lead.submittedAt)}</td>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone || 'N/A'}</td>
                  <td title={lead.subject}>
                    {lead.subject.length > 30 
                      ? lead.subject.substring(0, 30) + '...' 
                      : lead.subject
                    }
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadge(lead.status)}`}>
                      {lead.status.toUpperCase()}
                    </span>
                  </td>
                  <td title={lead.message}>
                    {lead.message.length > 50 
                      ? lead.message.substring(0, 50) + '...' 
                      : lead.message
                    }
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};