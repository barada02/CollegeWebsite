import React from 'react';
import type { Course } from '../../services/academicApi';
import './CourseCard.css';

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
  showDepartment?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onClick, 
  showDepartment = false 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getLatestPlacementStats = () => {
    if (course.placementStats.length === 0) return null;
    return course.placementStats.sort((a, b) => b.year - a.year)[0];
  };

  const latestStats = getLatestPlacementStats();

  return (
    <div 
      className={`course-card ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      <div className="course-header">
        <div className="course-level-badge">{course.level}</div>
        <div className="course-admission-status">
          {course.admissionOpen ? (
            <span className="admission-open">Admission Open</span>
          ) : (
            <span className="admission-closed">Admission Closed</span>
          )}
        </div>
      </div>

      <div className="course-content">
        <h3 className="course-name">{course.shortName}</h3>
        <p className="course-full-name">{course.name}</p>
        
        {course.specialization && (
          <p className="course-specialization">
            <strong>Specialization:</strong> {course.specialization}
          </p>
        )}

        <div className="course-details">
          <div className="detail-row">
            <div className="detail-item">
              <strong>Duration:</strong> {course.duration.years} Year{course.duration.years > 1 ? 's' : ''} 
              ({course.duration.semesters} Semesters)
            </div>
            <div className="detail-item">
              <strong>Credits:</strong> {course.totalCredits}
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-item">
              <strong>Intake:</strong> {course.intake} Students
            </div>
            <div className="detail-item">
              <strong>Fee:</strong> {formatCurrency(course.feeStructure.totalFee)}
            </div>
          </div>
        </div>

        {latestStats && (
          <div className="placement-stats">
            <h4>Placement Highlights ({latestStats.year})</h4>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{latestStats.percentage}%</span>
                <span className="stat-label">Placed</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{formatCurrency(latestStats.averagePackage)}</span>
                <span className="stat-label">Avg Package</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{formatCurrency(latestStats.highestPackage)}</span>
                <span className="stat-label">Highest Package</span>
              </div>
            </div>
          </div>
        )}

        {course.accreditation.length > 0 && (
          <div className="accreditation">
            {course.accreditation.map((acc, index) => (
              <span key={index} className="badge">{acc}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
