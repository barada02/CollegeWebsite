import React, { useState, useEffect } from 'react';
import type { IFaculty, FacultyCreateData, FacultyUpdateData, IPublication } from '../../services/facultyApi';
import { useAcademicStructure } from '../../hooks/useFacultyData';
import Button from '../shared/Button';
import './FacultyForm.css';

interface FacultyFormProps {
  faculty?: IFaculty;
  onSubmit: (data: FacultyCreateData | FacultyUpdateData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const DESIGNATION_OPTIONS = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lecturer',
  'Senior Lecturer',
  'Visiting Faculty',
  'Adjunct Professor',
  'Professor Emeritus'
];

export const FacultyForm: React.FC<FacultyFormProps> = ({
  faculty,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const { schools, departments } = useAcademicStructure();
  const isEditing = !!faculty;

  // Form state
  const [formData, setFormData] = useState<FacultyCreateData>({
    departmentId: '',
    schoolId: '',
    name: '',
    designation: 'Assistant Professor',
    qualification: [''],
    experience: 0,
    email: '',
    phone: '',
    office: '',
    specialization: [''],
    researchInterests: [''],
    publications: [],
    awards: [''],
    biography: '',
    image: '',
    cv: '',
    status: 'active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get all departments (no filtering needed)
  const getAvailableDepartments = () => {
    return departments || [];
  };

  // Initialize form data when editing
  useEffect(() => {
    if (faculty) {
      setFormData({
        departmentId: faculty.departmentId,
        schoolId: faculty.schoolId,
        name: faculty.name,
        designation: faculty.designation,
        qualification: faculty.qualification.length > 0 ? faculty.qualification : [''],
        experience: faculty.experience,
        email: faculty.email,
        phone: faculty.phone || '',
        office: faculty.office || '',
        specialization: faculty.specialization.length > 0 ? faculty.specialization : [''],
        researchInterests: faculty.researchInterests.length > 0 ? faculty.researchInterests : [''],
        publications: faculty.publications || [],
        awards: faculty.awards.length > 0 ? faculty.awards : [''],
        biography: faculty.biography,
        image: faculty.image || '',
        cv: faculty.cv || '',
        status: faculty.status
      });
    }
  }, [faculty]);

  // Handle input changes
  const handleInputChange = (field: keyof FacultyCreateData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle array field changes
  const handleArrayFieldChange = (field: 'qualification' | 'specialization' | 'researchInterests' | 'awards', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    handleInputChange(field, newArray);
  };

  const addArrayField = (field: 'qualification' | 'specialization' | 'researchInterests' | 'awards') => {
    handleInputChange(field, [...formData[field], '']);
  };

  const removeArrayField = (field: 'qualification' | 'specialization' | 'researchInterests' | 'awards', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    handleInputChange(field, newArray.length > 0 ? newArray : ['']);
  };

  // Handle publications
  const handlePublicationChange = (index: number, field: keyof IPublication, value: string | number) => {
    const newPublications = [...formData.publications];
    if (!newPublications[index]) {
      newPublications[index] = { title: '', journal: '', year: new Date().getFullYear(), url: '' };
    }
    newPublications[index] = { ...newPublications[index], [field]: value };
    handleInputChange('publications', newPublications);
  };

  const addPublication = () => {
    const newPublication: IPublication = {
      title: '',
      journal: '',
      year: new Date().getFullYear(),
      url: ''
    };
    handleInputChange('publications', [...formData.publications, newPublication]);
  };

  const removePublication = (index: number) => {
    const newPublications = formData.publications.filter((_, i) => i !== index);
    handleInputChange('publications', newPublications);
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.schoolId) newErrors.schoolId = 'School is required';
    if (!formData.departmentId) newErrors.departmentId = 'Department is required';
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (formData.experience < 0) newErrors.experience = 'Experience cannot be negative';
    if (!formData.biography.trim()) newErrors.biography = 'Biography is required';

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate required arrays have at least one non-empty entry
    if (formData.qualification.every(q => !q.trim())) {
      newErrors.qualification = 'At least one qualification is required';
    }
    if (formData.specialization.every(s => !s.trim())) {
      newErrors.specialization = 'At least one specialization is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Clean up array fields (remove empty strings)
      const cleanData = {
        ...formData,
        qualification: formData.qualification.filter(q => q.trim()),
        specialization: formData.specialization.filter(s => s.trim()),
        researchInterests: formData.researchInterests.filter(r => r.trim()),
        awards: formData.awards.filter(a => a.trim())
      };

      await onSubmit(cleanData);
    } catch (error) {
      console.error('Error submitting faculty form:', error);
    }
  };

  const availableDepartments = getAvailableDepartments();

  return (
    <div className="faculty-form-overlay">
      <div className="faculty-form-container">
        <div className="faculty-form-header">
          <h2>{isEditing ? 'Edit Faculty Member' : 'Add New Faculty Member'}</h2>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="faculty-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'error' : ''}
                  placeholder="Enter full name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter email address"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group">
                <label>Office</label>
                <input
                  type="text"
                  value={formData.office}
                  onChange={(e) => handleInputChange('office', e.target.value)}
                  placeholder="Enter office location"
                />
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="form-section">
            <h3>Academic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>School * (auto-filled when department is selected)</label>
                <select
                  value={formData.schoolId}
                  onChange={(e) => {
                    const schoolId = e.target.value;
                    setFormData(prev => ({ ...prev, schoolId }));
                  }}
                  className={errors.schoolId ? 'error' : ''}
                >
                  <option value="">Select School</option>
                  {schools.map(school => (
                    <option key={school._id} value={school._id}>
                      {school.name}
                    </option>
                  ))}
                </select>
                {errors.schoolId && <span className="error-text">{errors.schoolId}</span>}
              </div>

              <div className="form-group">
                <label>Department *</label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => {
                    const departmentId = e.target.value;
                    handleInputChange('departmentId', departmentId);
                    // Auto-set school based on selected department
                    if (departmentId) {
                      const selectedDept = departments?.find(d => d._id === departmentId);
                      if (selectedDept && selectedDept.schoolId !== formData.schoolId) {
                        handleInputChange('schoolId', selectedDept.schoolId);
                      }
                    }
                  }}
                  className={errors.departmentId ? 'error' : ''}
                >
                  <option value="">Select Department</option>
                  {availableDepartments.map((dept: any) => {
                    // Find the school name for this department
                    const school = schools.find(s => s._id === dept.schoolId);
                    const schoolName = school ? school.name : 'Unknown School';
                    return (
                      <option key={dept._id} value={dept._id}>
                        {dept.name} ({schoolName})
                      </option>
                    );
                  })}
                </select>
                {errors.departmentId && <span className="error-text">{errors.departmentId}</span>}
              </div>

              <div className="form-group">
                <label>Designation *</label>
                <select
                  value={formData.designation}
                  onChange={(e) => handleInputChange('designation', e.target.value)}
                  className={errors.designation ? 'error' : ''}
                >
                  {DESIGNATION_OPTIONS.map(designation => (
                    <option key={designation} value={designation}>
                      {designation}
                    </option>
                  ))}
                </select>
                {errors.designation && <span className="error-text">{errors.designation}</span>}
              </div>

              <div className="form-group">
                <label>Experience (Years) *</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', parseInt(e.target.value) || 0)}
                  className={errors.experience ? 'error' : ''}
                />
                {errors.experience && <span className="error-text">{errors.experience}</span>}
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as 'active' | 'inactive')}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Qualifications */}
          <div className="form-section">
            <h3>Qualifications *</h3>
            {formData.qualification.map((qual, index) => (
              <div key={index} className="array-field">
                <input
                  type="text"
                  value={qual}
                  onChange={(e) => handleArrayFieldChange('qualification', index, e.target.value)}
                  placeholder="Enter qualification (e.g., Ph.D. in Computer Science)"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('qualification', index)}
                  className="remove-field-btn"
                  disabled={formData.qualification.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayField('qualification')} className="add-field-btn">
              Add Qualification
            </button>
            {errors.qualification && <span className="error-text">{errors.qualification}</span>}
          </div>

          {/* Specializations */}
          <div className="form-section">
            <h3>Specializations *</h3>
            {formData.specialization.map((spec, index) => (
              <div key={index} className="array-field">
                <input
                  type="text"
                  value={spec}
                  onChange={(e) => handleArrayFieldChange('specialization', index, e.target.value)}
                  placeholder="Enter specialization area"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('specialization', index)}
                  className="remove-field-btn"
                  disabled={formData.specialization.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayField('specialization')} className="add-field-btn">
              Add Specialization
            </button>
            {errors.specialization && <span className="error-text">{errors.specialization}</span>}
          </div>

          {/* Research Interests */}
          <div className="form-section">
            <h3>Research Interests</h3>
            {formData.researchInterests.map((interest, index) => (
              <div key={index} className="array-field">
                <input
                  type="text"
                  value={interest}
                  onChange={(e) => handleArrayFieldChange('researchInterests', index, e.target.value)}
                  placeholder="Enter research interest"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('researchInterests', index)}
                  className="remove-field-btn"
                  disabled={formData.researchInterests.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayField('researchInterests')} className="add-field-btn">
              Add Research Interest
            </button>
          </div>

          {/* Publications */}
          <div className="form-section">
            <h3>Publications</h3>
            {formData.publications.map((pub, index) => (
              <div key={index} className="publication-group">
                <h4>Publication {index + 1}</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={pub.title}
                      onChange={(e) => handlePublicationChange(index, 'title', e.target.value)}
                      placeholder="Publication title"
                    />
                  </div>
                  <div className="form-group">
                    <label>Journal</label>
                    <input
                      type="text"
                      value={pub.journal}
                      onChange={(e) => handlePublicationChange(index, 'journal', e.target.value)}
                      placeholder="Journal name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <input
                      type="number"
                      min="1950"
                      max={new Date().getFullYear() + 5}
                      value={pub.year}
                      onChange={(e) => handlePublicationChange(index, 'year', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label>URL</label>
                    <input
                      type="url"
                      value={pub.url || ''}
                      onChange={(e) => handlePublicationChange(index, 'url', e.target.value)}
                      placeholder="Publication URL"
                    />
                  </div>
                </div>
                <button type="button" onClick={() => removePublication(index)} className="remove-field-btn">
                  Remove Publication
                </button>
              </div>
            ))}
            <button type="button" onClick={addPublication} className="add-field-btn">
              Add Publication
            </button>
          </div>

          {/* Awards */}
          <div className="form-section">
            <h3>Awards & Honors</h3>
            {formData.awards.map((award, index) => (
              <div key={index} className="array-field">
                <input
                  type="text"
                  value={award}
                  onChange={(e) => handleArrayFieldChange('awards', index, e.target.value)}
                  placeholder="Enter award or honor"
                />
                <button
                  type="button"
                  onClick={() => removeArrayField('awards', index)}
                  className="remove-field-btn"
                  disabled={formData.awards.length <= 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayField('awards')} className="add-field-btn">
              Add Award
            </button>
          </div>

          {/* Biography */}
          <div className="form-section">
            <h3>Biography *</h3>
            <div className="form-group">
              <textarea
                value={formData.biography}
                onChange={(e) => handleInputChange('biography', e.target.value)}
                className={errors.biography ? 'error' : ''}
                placeholder="Enter faculty biography..."
                rows={4}
              />
              {errors.biography && <span className="error-text">{errors.biography}</span>}
            </div>
          </div>

          {/* Additional Files */}
          <div className="form-section">
            <h3>Additional Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Profile Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>
              <div className="form-group">
                <label>CV/Resume URL</label>
                <input
                  type="url"
                  value={formData.cv}
                  onChange={(e) => handleInputChange('cv', e.target.value)}
                  placeholder="Enter CV URL"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <Button type="button" variant="admin" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="admin" disabled={loading}>
              {loading ? 'Saving...' : (isEditing ? 'Update Faculty' : 'Create Faculty')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultyForm;
