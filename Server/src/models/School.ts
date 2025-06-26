import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for School
export interface ISchool extends Document {
  name: string;
  code: string;
  description: string;
  dean: string;
  contact: {
    email: string;
    phone: string;
    office: string;
  };
  establishedYear: number;
  accreditation: string[];
  image?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const SchoolSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: 10
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  dean: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  contact: {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    office: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    }
  },
  establishedYear: {
    type: Number,
    required: true,
    min: 1800,
    max: new Date().getFullYear()
  },
  accreditation: [{
    type: String,
    trim: true,
    maxlength: 100
  }],
  image: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
SchoolSchema.index({ code: 1 });
SchoolSchema.index({ status: 1 });
SchoolSchema.index({ name: 1 });

// Export the model
export default mongoose.model<ISchool>('School', SchoolSchema);
