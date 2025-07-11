import React, { useState } from 'react';
import Button from '../../components/shared/Button';
import { useContactForm } from '../../hooks/useContactForm';
import type { ContactFormData } from '../../services/contactApi';
import './Contact.css';

export const Contact: React.FC = () => {
  const { loading, success, error, submitContact, resetForm } = useContactForm();
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters long';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() || undefined,
      subject: formData.subject.trim(),
      message: formData.message.trim()
    };

    const success = await submitContact(submitData);
    
    if (success) {
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }
  };

  const handleReset = () => {
    resetForm();
    setFormErrors({});
  };

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
                  <p>123 University Ave<br />Hyderabad, Telangana, India</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h3>Phone</h3>
                  <p>+91 900000256</p>
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
              
              {/* Success Message */}
              {success && (
                <div className="success-message">
                  <div className="success-content">
                    <h3>✅ Message Sent Successfully!</h3>
                    <p>Thank you for contacting us. We'll get back to you within 24 hours.</p>
                    <Button variant="college" size="sm" onClick={handleReset}>
                      Send Another Message
                    </Button>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="error-message">
                  <h3>❌ Error</h3>
                  <p>{error}</p>
                  <Button variant="college" size="sm" onClick={handleReset}>
                    Try Again
                  </Button>
                </div>
              )}

              {/* Form */}
              {!success && (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      className={formErrors.name ? 'error' : ''}
                      required 
                    />
                    {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        className={formErrors.email ? 'error' : ''}
                        required 
                      />
                      {formErrors.email && <span className="field-error">{formErrors.email}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(Optional)"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <select 
                      id="subject" 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={formErrors.subject ? 'error' : ''}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Admissions">Admissions</option>
                      <option value="Academics">Academics</option>
                      <option value="Campus Life">Campus Life</option>
                      <option value="Financial Aid">Financial Aid</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.subject && <span className="field-error">{formErrors.subject}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className={formErrors.message ? 'error' : ''}
                      placeholder="Please provide details about your inquiry..."
                      required
                    ></textarea>
                    {formErrors.message && <span className="field-error">{formErrors.message}</span>}
                    <div className="character-count">
                      {formData.message.length}/2000 characters
                    </div>
                  </div>

                  <div className="form-actions">
                    <Button 
                      variant="college" 
                      size="lg" 
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
