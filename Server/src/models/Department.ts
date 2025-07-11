import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for Department
export interface IDepartment extends Document {
  schoolId: mongoose.Types.ObjectId;
  name: string;
  code: string;
  description: string;
  head: string;
  contact: {
    email: string;
    phone: string;
    office: string;
  };
  faculty: mongoose.Types.ObjectId[];
  facilities: string[];
  achievements: string[];
  image?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const DepartmentSchema: Schema = new Schema({
  schoolId: {
    type: Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  code: {
    type: String,
    required: true,
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
  head: {
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
  faculty: [{
    type: Schema.Types.ObjectId,
    ref: 'Faculty'
  }],
  facilities: [{
    type: String,
    trim: true,
    maxlength: 200
  }],
  achievements: [{
    type: String,
    trim: true,
    maxlength: 500
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
DepartmentSchema.index({ schoolId: 1 });
DepartmentSchema.index({ code: 1 });
DepartmentSchema.index({ status: 1 });
DepartmentSchema.index({ name: 1 });

// Ensure department code is unique within a school
DepartmentSchema.index({ schoolId: 1, code: 1 }, { unique: true });

// Export the model
export default mongoose.model<IDepartment>('Department', DepartmentSchema);
