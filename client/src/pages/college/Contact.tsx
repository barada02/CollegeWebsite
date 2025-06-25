import React from 'react';
import Button from '../../components/shared/Button';
import './Contact.css';

export const Contact: React.FC = () => {
  return (
    <div className="contact-page">
      <div className="container">
        {/* Hero Section */}
        <section className="contact-hero">
          <h1 className="page-title">Contact Us</h1>
          <p className="page-subtitle">
            Get in touch with us. We're here to help and answer any questions you may have.
          </p>
        </section>

        {/* Contact Info & Form */}
        <section className="contact-content">
          <div className="contact-grid">
            {/* Contact Information */}
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h3>Address</h3>
                  <p>123 University Ave<br />Education City, EC 12345</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h3>Phone</h3>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div>
                  <h3>Email</h3>
                  <p>info@excellenceuniversity.edu</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">🕒</div>
                <div>
                  <h3>Office Hours</h3>
                  <p>Monday - Friday: 8:00 AM - 6:00 PM<br />Saturday: 9:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container">
              <h2>Send us a Message</h2>
              <form className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" id="firstName" name="firstName" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" id="lastName" name="lastName" required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select id="subject" name="subject" required>
                    <option value="">Select a subject</option>
                    <option value="admissions">Admissions</option>
                    <option value="academics">Academics</option>
                    <option value="campus-life">Campus Life</option>
                    <option value="financial-aid">Financial Aid</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={5} required></textarea>
                </div>
                <div className="form-actions">
                  <Button variant="college" size="lg">Send Message</Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
