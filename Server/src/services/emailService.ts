import nodemailer from 'nodemailer';
import { IContact } from '../models/Contact';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.NODEMAILER_SERVICE || 'gmail',
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
      }
    });
  }

  /**
   * Verify email service connection
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }

  /**
   * Send email reply to contact form submission
   */
  async sendContactReply(contact: IContact, replyMessage: string): Promise<boolean> {
    try {
      const emailOptions: EmailOptions = {
        to: contact.email,
        subject: `Re: ${contact.subject}`,
        html: this.generateReplyEmailTemplate(contact, replyMessage),
        replyTo: process.env.NODEMAILER_SENDER_EMAIL
      };

      const info = await this.transporter.sendMail({
        from: `"College Administration" <${process.env.NODEMAILER_SENDER_EMAIL}>`,
        to: emailOptions.to,
        subject: emailOptions.subject,
        html: emailOptions.html,
        replyTo: emailOptions.replyTo
      });

      console.log('Reply email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send reply email:', error);
      return false;
    }
  }

  /**
   * Generate HTML template for reply email
   */
  private generateReplyEmailTemplate(contact: IContact, replyMessage: string): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reply to Your Message</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .email-container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2c5282;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2c5282;
            margin: 0;
            font-size: 24px;
          }
          .header p {
            color: #666;
            margin: 5px 0 0 0;
            font-size: 14px;
          }
          .greeting {
            font-size: 16px;
            margin-bottom: 20px;
          }
          .reply-section {
            background-color: #f8f9fa;
            border-left: 4px solid #2c5282;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
          }
          .reply-section h3 {
            color: #2c5282;
            margin-top: 0;
            font-size: 18px;
          }
          .reply-message {
            background-color: #ffffff;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            white-space: pre-wrap;
            font-size: 15px;
            line-height: 1.6;
          }
          .original-message {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
          }
          .original-message h4 {
            color: #666;
            font-size: 14px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .original-content {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            font-size: 14px;
            color: #666;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #666;
            font-size: 12px;
          }
          .contact-info {
            background-color: #e6f3ff;
            padding: 15px;
            border-radius: 6px;
            margin-top: 20px;
          }
          .contact-info h4 {
            color: #2c5282;
            margin-top: 0;
            font-size: 16px;
          }
          .contact-details {
            font-size: 14px;
            color: #555;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>College Administration</h1>
            <p>Response to Your Inquiry</p>
          </div>

          <div class="greeting">
            Dear ${contact.name},
          </div>

          <p>Thank you for contacting us. We have reviewed your message and are pleased to provide you with the following response:</p>

          <div class="reply-section">
            <h3>Our Response</h3>
            <div class="reply-message">${replyMessage}</div>
          </div>

          <div class="original-message">
            <h4>Your Original Message</h4>
            <div class="original-content">
              <strong>Subject:</strong> ${contact.subject}<br>
              <strong>Date:</strong> ${new Date(contact.submittedAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}<br><br>
              <strong>Your Message:</strong><br>
              ${contact.message}
            </div>
          </div>

          <div class="contact-info">
            <h4>Need Further Assistance?</h4>
            <div class="contact-details">
              If you have any additional questions or need further clarification, please don't hesitate to contact us again. We're here to help!
            </div>
          </div>

          <div class="footer">
            <p>This email was sent in response to your inquiry submitted on our website.</p>
            <p>© ${new Date().getFullYear()} College Administration. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Send a test email to verify configuration
   */
  async sendTestEmail(toEmail: string): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: `"College Administration" <${process.env.NODEMAILER_SENDER_EMAIL}>`,
        to: toEmail,
        subject: 'Test Email - College Website System',
        html: `
          <h2>📧 Email Configuration Test</h2>
          <p>This is a test email to verify that the email service is working correctly.</p>
          <p><strong>Configuration Details:</strong></p>
          <ul>
            <li>Service: ${process.env.NODEMAILER_SERVICE}</li>
            <li>From: ${process.env.NODEMAILER_SENDER_EMAIL}</li>
            <li>Time: ${new Date().toLocaleString()}</li>
          </ul>
          <p>✅ Your email configuration is working correctly!</p>
        `
      });

      console.log('Test email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send test email:', error);
      return false;
    }
  }
}

export default EmailService;
