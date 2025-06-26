import mongoose, { Document, Schema } from 'mongoose';

// Define interface for publication
interface IPublication {
  title: string;
  journal: string;
  year: number;
  url?: string;
}

// Define the interface for Faculty
export interface IFaculty extends Document {
  departmentId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  
  // Personal Info
  name: string;
  designation: string;
  qualification: string[];
  experience: number;
  
  // Contact
  email: string;
  phone?: string;
  office?: string;
  
  // Academic Details
  specialization: string[];
  researchInterests: string[];
  publications: IPublication[];
  
  // Additional Info
  awards: string[];
  biography: string;
  image?: string;
  cv?: string;
  
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const FacultySchema: Schema = new Schema({
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  schoolId: {
    type: Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  
  // Personal Info
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  designation: {
    type: String,
    required: true,
    enum: [
      'Professor',
      'Associate Professor',
      'Assistant Professor',
      'Lecturer',
      'Senior Lecturer',
      'Visiting Faculty',
      'Adjunct Professor',
      'Professor Emeritus'
    ]
  },
  qualification: [{
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  }],
  experience: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  },
  
  // Contact
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  office: {
    type: String,
    trim: true,
    maxlength: 100
  },
  
  // Academic Details
  specialization: [{
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  }],
  researchInterests: [{
    type: String,
    trim: true,
    maxlength: 200
  }],
  publications: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    journal: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    year: {
      type: Number,
      required: true,
      min: 1950,
      max: new Date().getFullYear() + 1
    },
    url: {
      type: String,
      trim: true
    }
  }],
  
  // Additional Info
  awards: [{
    type: String,
    trim: true,
    maxlength: 300
  }],
  biography: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  image: {
    type: String,
    trim: true
  },
  cv: {
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
FacultySchema.index({ departmentId: 1 });
FacultySchema.index({ schoolId: 1 });
FacultySchema.index({ designation: 1 });
FacultySchema.index({ status: 1 });
FacultySchema.index({ email: 1 });
FacultySchema.index({ name: 1 });

// Export the model
export default mongoose.model<IFaculty>('Faculty', FacultySchema);
