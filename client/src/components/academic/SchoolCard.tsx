import React from 'react';
import type { School } from '../../services/academicApi';
import './SchoolCard.css';

interface SchoolCardProps {
  school: School;
  onClick?: () => void;
}

const SchoolCard: React.FC<SchoolCardProps> = ({ school, onClick }) => {
  return (
    <div 
      className={`school-card ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
    >
      {school.image && (
        <img 
          src={school.image} 
          alt={school.name}
          className="school-image"
          onError={(e) => {
            // Hide image if it fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      
      <div className="school-content">
        <div className="school-header">
          <h3 className="school-name">{school.name}</h3>
          <span className="school-code">{school.code}</span>
        </div>
        
        <p className="school-description">{school.description}</p>
        
        <div className="school-details">
          <div className="detail-item">
            <strong>Dean:</strong> {school.dean}
          </div>
          <div className="detail-item">
            <strong>Established:</strong> {school.establishedYear}
          </div>
          <div className="detail-item">
            <strong>Contact:</strong> {school.contact.email}
          </div>
        </div>
        
        {school.accreditation.length > 0 && (
          <div className="accreditation">
            <strong>Accreditation:</strong>
            <div className="accreditation-badges">
              {school.accreditation.map((acc, index) => (
                <span key={index} className="badge">{acc}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolCard;
