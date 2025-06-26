import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for About section data
export interface IAbout extends Document {
  mission: string;
  vision: string;
  values: string;
  history: string;
  stats: {
    students: number;
    faculty: number;
    programs: number;
    yearsOfExcellence: number;
  };
  achievements: Array<{
    _id?: mongoose.Types.ObjectId;
    title: string;
    description: string;
    year: number;
    date?: Date;
  }>;
  leadership: Array<{
    _id?: mongoose.Types.ObjectId;
    name: string;
    position: string;
    bio: string;
    image?: string;
    email?: string;
  }>;
  updatedAt: Date;
  createdAt: Date;
}

// Create the schema
const AboutSchema: Schema = new Schema({
  mission: {
    type: String,
    required: true,
    trim: true
  },
  vision: {
    type: String,
    required: true,
    trim: true
  },
  values: {
    type: String,
    required: true,
    trim: true
  },
  history: {
    type: String,
    required: true,
    trim: true
  },
  stats: {
    students: {
      type: Number,
      required: true,
      default: 0
    },
    faculty: {
      type: Number,
      required: true,
      default: 0
    },
    programs: {
      type: Number,
      required: true,
      default: 0
    },
    yearsOfExcellence: {
      type: Number,
      required: true,
      default: 0
    }
  },
  achievements: [{
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
    year: {
      type: Number,
      required: true
    },
    date: {
      type: Date
    }
  }],
  leadership: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    position: {
      type: String,
      required: true,
      trim: true
    },
    bio: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true
    }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
AboutSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Export the model
export default mongoose.model<IAbout>('About', AboutSchema);
