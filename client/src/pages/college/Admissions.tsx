import React from 'react';
import Button from '../../components/shared/Button';
import './Admissions.css';

export const Admissions: React.FC = () => {
  return (
    <div className="admissions-page">
      <div className="container">
        {/* Hero Section */}
        <section className="admissions-hero">
          <h1 className="page-title">Admissions</h1>
          <p className="page-subtitle">
            Join our community of learners and leaders. Start your journey with Excellence University.
          </p>
        </section>

        {/* Quick Info */}
        <section className="admissions-info">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">📅</div>
              <h3>Application Deadline</h3>
              <p>March 31, 2025</p>
            </div>
            <div className="info-card">
              <div className="info-icon">💰</div>
              <h3>Application Fee</h3>
              <p>$50 (Online)</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📋</div>
              <h3>Requirements</h3>
              <p>Transcripts, Essays, Recommendations</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🎓</div>
              <h3>Programs</h3>
              <p>50+ Undergraduate & Graduate Programs</p>
            </div>
          </div>
        </section>

        {/* Application Steps */}
        <section className="application-steps">
          <h2 className="section-title">How to Apply</h2>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Account</h3>
                <p>Register on our admissions portal</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Submit Application</h3>
                <p>Complete the online application form</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Upload Documents</h3>
                <p>Provide transcripts and recommendations</p>
              </div>
            </div>
            <div className="step-item">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Review & Submit</h3>
                <p>Final review and payment of application fee</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="admissions-cta">
          <div className="cta-content">
            <h2>Ready to Apply?</h2>
            <p>Take the first step towards your future at Excellence University.</p>
            <div className="cta-buttons">
              <Button variant="college" size="lg">Apply Now</Button>
              <Button variant="college" size="lg">Request Info</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admissions;
