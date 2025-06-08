import mongoose, { Document, Schema } from 'mongoose';

// Event interface
export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  image?: string;
  registrationLink?: string;
  organizer: string;
  createdAt: Date;
  updatedAt: Date;
}

// Event schema
const EventSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  registrationLink: {
    type: String,
    trim: true
  },
  organizer: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Update the updatedAt field automatically
  timestamps: true
});

// Export the model
export default mongoose.model<IEvent>('Event', EventSchema);
