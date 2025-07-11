import mongoose, { Document, Schema } from 'mongoose';

// Define interfaces for nested objects
interface IDuration {
  years: number;
  semesters: number;
}

interface IAgeLimit {
  min: number;
  max: number;
}

interface IEligibility {
  academicRequirement: string;
  entranceExam?: string[];
  minimumPercentage: number;
  ageLimit?: IAgeLimit;
}

interface IFeeStructure {
  admissionFee: number;
  semesterFee: number;
  totalFee: number;
  scholarships?: string[];
}

interface ISubject {
  code: string;
  name: string;
  credits: number;
  type: 'core' | 'elective' | 'lab' | 'project';
}

interface ICurriculum {
  semester: number;
  subjects: ISubject[];
}

interface IPlacementStats {
  year: number;
  percentage: number;
  averagePackage: number;
  highestPackage: number;
  majorRecruiters: string[];
}

// Define the interface for Course
export interface ICourse extends Document {
  departmentId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  
  // Basic Info
  name: string;
  shortName: string;
  code: string;
  
  // Program Details
  level: 'UG' | 'PG' | 'Diploma' | 'PhD';
  degree: 'B.Tech' | 'M.Tech' | 'MCA' | 'MBA' | 'BBA' | 'Diploma';
  specialization?: string;
  
  // Academic Info
  duration: IDuration;
  totalCredits: number;
  
  // Admission Details
  eligibility: IEligibility;
  
  // Fee Structure
  feeStructure: IFeeStructure;
  
  // Curriculum
  curriculum: ICurriculum[];
  
  // Career & Placements
  careerProspects: string[];
  placementStats: IPlacementStats[];
  
  // Additional Info
  accreditation: string[];
  description: string;
  objectives: string[];
  outcomes: string[];
  image?: string;
  brochure?: string;
  
  // Status
  intake: number;
  status: 'active' | 'inactive' | 'upcoming';
  admissionOpen: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const CourseSchema: Schema = new Schema({
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
  
  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  shortName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: 20
  },
  
  // Program Details
  level: {
    type: String,
    enum: ['UG', 'PG', 'Diploma', 'PhD'],
    required: true
  },
  degree: {
    type: String,
    enum: ['B.Tech', 'M.Tech', 'MCA', 'MBA', 'BBA', 'Diploma'],
    required: true
  },
  specialization: {
    type: String,
    trim: true,
    maxlength: 200
  },
  
  // Academic Info
  duration: {
    years: {
      type: Number,
      required: true,
      min: 1,
      max: 6
    },
    semesters: {
      type: Number,
      required: true,
      min: 2,
      max: 12
    }
  },
  totalCredits: {
    type: Number,
    required: true,
    min: 60,
    max: 300
  },
  
  // Admission Details
  eligibility: {
    academicRequirement: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    entranceExam: [{
      type: String,
      trim: true,
      maxlength: 100
    }],
    minimumPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    ageLimit: {
      min: {
        type: Number,
        min: 16,
        max: 30
      },
      max: {
        type: Number,
        min: 20,
        max: 40
      }
    }
  },
  
  // Fee Structure
  feeStructure: {
    admissionFee: {
      type: Number,
      required: true,
      min: 0
    },
    semesterFee: {
      type: Number,
      required: true,
      min: 0
    },
    totalFee: {
      type: Number,
      required: true,
      min: 0
    },
    scholarships: [{
      type: String,
      trim: true,
      maxlength: 200
    }]
  },
  
  // Curriculum
  curriculum: [{
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 12
    },
    subjects: [{
      code: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20
      },
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
      },
      credits: {
        type: Number,
        required: true,
        min: 1,
        max: 10
      },
      type: {
        type: String,
        enum: ['core', 'elective', 'lab', 'project'],
        required: true
      }
    }]
  }],
  
  // Career & Placements
  careerProspects: [{
    type: String,
    trim: true,
    maxlength: 200
  }],
  placementStats: [{
    year: {
      type: Number,
      required: true,
      min: 2000,
      max: new Date().getFullYear() + 1
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    averagePackage: {
      type: Number,
      required: true,
      min: 0
    },
    highestPackage: {
      type: Number,
      required: true,
      min: 0
    },
    majorRecruiters: [{
      type: String,
      trim: true,
      maxlength: 100
    }]
  }],
  
  // Additional Info
  accreditation: [{
    type: String,
    trim: true,
    maxlength: 100
  }],
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 3000
  },
  objectives: [{
    type: String,
    trim: true,
    maxlength: 500
  }],
  outcomes: [{
    type: String,
    trim: true,
    maxlength: 500
  }],
  image: {
    type: String,
    trim: true
  },
  brochure: {
    type: String,
    trim: true
  },
  
  // Status
  intake: {
    type: Number,
    required: true,
    min: 10,
    max: 1000
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'upcoming'],
    default: 'active'
  },
  admissionOpen: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
CourseSchema.index({ departmentId: 1 });
CourseSchema.index({ schoolId: 1 });
CourseSchema.index({ level: 1 });
CourseSchema.index({ degree: 1 });
CourseSchema.index({ status: 1 });
CourseSchema.index({ admissionOpen: 1 });
CourseSchema.index({ code: 1 });

// Export the model
export default mongoose.model<ICourse>('Course', CourseSchema);
