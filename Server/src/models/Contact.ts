import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for Contact form submissions
export interface IContact extends Document {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  submittedAt: Date;
  repliedAt?: Date;
  adminNotes?: string;
}

// Create the schema
const ContactSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  repliedAt: {
    type: Date
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: 1000
  }
});

// Add indexes for better query performance
ContactSchema.index({ submittedAt: -1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ email: 1 });

// Export the model
export default mongoose.model<IContact>('Contact', ContactSchema);
