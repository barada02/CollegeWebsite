import React, { useState, useEffect } from 'react';
import { useFacultyData, useAcademicStructure } from '../../hooks/useFacultyData';
import type { IFaculty } from '../../services/facultyApi';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import './Faculty.css';

export const Faculty: React.FC = () => {
  const {
    faculty,
    loading,
    error,
    fetchFaculty,
    clearError
  } = useFacultyData();

  const { departments, getSchoolById, getDepartmentById } = useAcademicStructure();

  // Local state for filtering
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch faculty on component mount
  useEffect(() => {
    fetchFaculty({ status: 'active' }); // Only fetch active faculty for public view
  }, []);

  // Filter faculty based on search and department
  const filteredFaculty = (faculty || []).filter(f => {
    const matchesSearch = !searchQuery || 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.specialization.some(spec => 
        spec.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesDepartment = !selectedDepartment || f.departmentId === selectedDepartment;
    
    return matchesSearch && matchesDepartment && f.status === 'active';
  });

  // Group faculty by department
  const facultyByDepartment = filteredFaculty.reduce((acc, facultyMember) => {
    const deptId = facultyMember.departmentId;
    if (!acc[deptId]) {
      acc[deptId] = [];
    }
    acc[deptId].push(facultyMember);
    return acc;
  }, {} as Record<string, IFaculty[]>);

  // Get department name
  const getDepartmentName = (departmentId: string) => {
    const dept = getDepartmentById(departmentId);
    return dept ? dept.name : 'Unknown Department';
  };

  // Get school name
  const getSchoolName = (schoolId: string) => {
    const school = getSchoolById(schoolId);
    return school ? school.name : 'Unknown School';
  };

  if (loading) {
    return (
      <div className="faculty-page">
        <div className="container">
          <div className="loading-container">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="faculty-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Our Faculty</h1>
          <p className="page-subtitle">
            Meet our distinguished faculty members who are committed to excellence in education and research
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <ErrorMessage 
            message={error} 
            onRetry={clearError}
          />
        )}

        {/* Search and Filter Section */}
        <div className="faculty-filters">
          <div className="search-section">
            <input 
              type="text" 
              placeholder="Search faculty by name, position, or specialization..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="filter-section">
            <select 
              className="department-filter"
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
          </div>
        </div>

        {/* Faculty Content */}
        {!loading && filteredFaculty.length === 0 && (
          <div className="no-faculty">
            <h3>No Faculty Found</h3>
            <p>
              {searchQuery || selectedDepartment
                ? 'No faculty members match your current search criteria.'
                : 'Faculty information is not available at the moment.'}
            </p>
          </div>
        )}

        {/* Faculty by Department */}
        {Object.keys(facultyByDepartment).map(deptId => {
          const departmentFaculty = facultyByDepartment[deptId];
          const department = getDepartmentById(deptId);
          
          return (
            <div key={deptId} className="department-section">
              <div className="department-header">
                <h2 className="department-name">{getDepartmentName(deptId)}</h2>
                {department && (
                  <p className="school-name">{getSchoolName(department.schoolId)}</p>
                )}
                <span className="faculty-count">{departmentFaculty.length} Faculty Members</span>
              </div>

              <div className="faculty-grid">
                {departmentFaculty.map(facultyMember => (
                  <div key={facultyMember._id} className="faculty-card">
                    <div className="faculty-image">
                      {facultyMember.image ? (
                        <img src={facultyMember.image} alt={facultyMember.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          <span className="avatar-icon">👨‍🏫</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="faculty-info">
                      <h3 className="faculty-name">{facultyMember.name}</h3>
                      <p className="faculty-designation">{facultyMember.designation}</p>
                      
                      <div className="faculty-details">
                        <div className="detail-section">
                          <h4>Qualification</h4>
                          <p>{facultyMember.qualification.join(', ')}</p>
                        </div>
                        
                        {facultyMember.specialization.length > 0 && (
                          <div className="detail-section">
                            <h4>Specialization</h4>
                            <p>{facultyMember.specialization.join(', ')}</p>
                          </div>
                        )}
                        
                        <div className="detail-section">
                          <h4>Experience</h4>
                          <p>{facultyMember.experience} years</p>
                        </div>
                        
                        {facultyMember.researchInterests.length > 0 && (
                          <div className="detail-section">
                            <h4>Research Interests</h4>
                            <p>{facultyMember.researchInterests.join(', ')}</p>
                          </div>
                        )}
                      </div>

                      <div className="faculty-contact">
                        <p className="contact-item">
                          <span className="contact-label">Email:</span>
                          <a href={`mailto:${facultyMember.email}`} className="contact-link">
                            {facultyMember.email}
                          </a>
                        </p>
                        {facultyMember.phone && (
                          <p className="contact-item">
                            <span className="contact-label">Phone:</span>
                            <span className="contact-value">{facultyMember.phone}</span>
                          </p>
                        )}
                        {facultyMember.office && (
                          <p className="contact-item">
                            <span className="contact-label">Office:</span>
                            <span className="contact-value">{facultyMember.office}</span>
                          </p>
                        )}
                      </div>

                      {facultyMember.cv && (
                        <div className="faculty-actions">
                          <a 
                            href={facultyMember.cv} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="cv-link"
                          >
                            View CV
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Faculty;
