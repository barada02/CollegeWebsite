import React, { useState, useEffect } from 'react';
import { useFacultyData, useAcademicStructure } from '../../hooks/useFacultyData';
import type { IFaculty, FacultyCreateData, FacultyUpdateData } from '../../services/facultyApi';
import Button from '../../components/shared/Button';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import FacultyForm from '../../components/admin/FacultyForm';
import './ManageFaculty.css';

export const ManageFaculty: React.FC = () => {
  const {
    faculty,
    loading,
    error,
    total,
    fetchFaculty,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    searchFaculty,
    clearError
  } = useFacultyData();

  const { departments, getDepartmentById, getSchoolById, loading: academicLoading } = useAcademicStructure();

  // Local state
  const [showForm, setShowForm] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<IFaculty | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Show loading spinner if either faculty data or academic structure is loading
  const isLoading = loading || academicLoading;

  // Filter faculty based on search and filters - add null check
  const filteredFaculty = (faculty || []).filter(f => {
    const matchesSearch = !searchQuery || 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.designation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = !selectedDepartment || f.departmentId === selectedDepartment;
    const matchesStatus = !selectedStatus || f.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchFaculty(query);
    } else {
      fetchFaculty();
    }
  };

  // Handle filter changes
  const handleFilterChange = () => {
    const filters = {
      ...(selectedDepartment && { department: selectedDepartment }),
      ...(selectedStatus && { status: selectedStatus })
    };
    fetchFaculty(filters);
  };

  // Effect for filter changes
  useEffect(() => {
    if (selectedDepartment || selectedStatus) {
      handleFilterChange();
    }
  }, [selectedDepartment, selectedStatus]);

  // Handle form submission
  const handleFormSubmit = async (data: FacultyCreateData | FacultyUpdateData) => {
    if (editingFaculty) {
      await handleUpdateFaculty(data);
    } else {
      await handleCreateFaculty(data as FacultyCreateData);
    }
  };

  // Handle create faculty
  const handleCreateFaculty = async (data: FacultyCreateData) => {
    try {
      setFormLoading(true);
      await createFaculty(data);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating faculty:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle update faculty
  const handleUpdateFaculty = async (data: FacultyUpdateData) => {
    if (!editingFaculty) return;
    
    try {
      setFormLoading(true);
      await updateFaculty(editingFaculty._id!, data);
      setShowForm(false);
      setEditingFaculty(null);
    } catch (error) {
      console.error('Error updating faculty:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete faculty
  const handleDeleteFaculty = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        await deleteFaculty(id);
      } catch (error) {
        console.error('Error deleting faculty:', error);
      }
    }
  };

  // Handle edit faculty
  const handleEditFaculty = (faculty: IFaculty) => {
    setEditingFaculty(faculty);
    setShowForm(true);
  };

  // Handle form close
  const handleFormClose = () => {
    setShowForm(false);
    setEditingFaculty(null);
  };

  // Get department and school names
  const getDepartmentName = (departmentId: string) => {
    const dept = getDepartmentById(departmentId);
    return dept ? dept.name : 'Unknown Department';
  };

  const getSchoolName = (schoolId: string) => {
    const school = getSchoolById(schoolId);
    return school ? school.name : 'Unknown School';
  };

  // Early return with loading state if critical data is not ready
  if (!departments && !academicLoading) {
    return (
      <div className="manage-faculty-page">
        <div className="page-header">
          <h1 className="page-title">Faculty Management</h1>
          <p className="page-subtitle">Loading academic structure...</p>
        </div>
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="manage-faculty-page">
      <div className="page-header">
        <h1 className="page-title">Faculty Management</h1>
        <p className="page-subtitle">Manage faculty members, departments, and academic staff</p>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={clearError}
        />
      )}

      {/* Action Bar */}
      <div className="action-bar">
        <div className="search-section">
          <input 
            type="text" 
            placeholder="Search faculty..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <select 
            className="filter-select"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {(departments || []).map(dept => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
          <select 
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <Button 
          variant="admin" 
          size="md"
          onClick={() => setShowForm(true)}
        >
          Add New Faculty
        </Button>
      </div>

      {/* Faculty List */}
      <section className="faculty-list">
        <div className="list-header">
          <h2>Faculty Members</h2>
          <div className="list-stats">
            <span className="total-count">{filteredFaculty.length} faculty members</span>
            {total !== filteredFaculty.length && (
              <span className="filtered-count">({total} total)</span>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <div className="loading-container">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="faculty-grid">
            {filteredFaculty.map(facultyMember => (
              <div key={facultyMember._id} className="faculty-card">
                <div className="faculty-avatar">
                  {facultyMember.image ? (
                    <img src={facultyMember.image} alt={facultyMember.name} />
                  ) : (
                    <span className="avatar-placeholder">👤</span>
                  )}
                </div>
                <div className="faculty-info">
                  <h3 className="faculty-name">{facultyMember.name}</h3>
                  <div className="faculty-details">
                    <div className="detail-item">
                      <span className="detail-label">Department:</span>
                      <span className="detail-value">{getDepartmentName(facultyMember.departmentId)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">School:</span>
                      <span className="detail-value">{getSchoolName(facultyMember.schoolId)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Position:</span>
                      <span className="detail-value">{facultyMember.designation}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Experience:</span>
                      <span className="detail-value">{facultyMember.experience} years</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{facultyMember.email}</span>
                    </div>
                    {facultyMember.phone && (
                      <div className="detail-item">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{facultyMember.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="faculty-status">
                    <span className={`status-badge ${facultyMember.status}`}>
                      {facultyMember.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="faculty-actions">
                  <Button 
                    variant="admin" 
                    size="sm"
                    onClick={() => handleEditFaculty(facultyMember)}
                  >
                    Edit
                  </Button>
                  {facultyMember.cv && (
                    <Button 
                      variant="admin" 
                      size="sm"
                      onClick={() => window.open(facultyMember.cv, '_blank')}
                    >
                      View CV
                    </Button>
                  )}
                  <Button 
                    variant="admin" 
                    size="sm"
                    onClick={() => handleDeleteFaculty(facultyMember._id!, facultyMember.name)}
                    className="delete-button"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredFaculty.length === 0 && (
          <div className="empty-state">
            <h3>No Faculty Found</h3>
            <p>
              {searchQuery || selectedDepartment || selectedStatus
                ? 'No faculty members match your current filters.'
                : 'No faculty members have been added yet.'}
            </p>
            {!searchQuery && !selectedDepartment && !selectedStatus && (
              <Button 
                variant="admin" 
                size="md"
                onClick={() => setShowForm(true)}
              >
                Add First Faculty Member
              </Button>
            )}
          </div>
        )}
      </section>

      {/* Faculty Form Modal */}
      {showForm && (
        <FacultyForm
          faculty={editingFaculty || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default ManageFaculty;
