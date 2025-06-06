import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for our data document
export interface IData extends Document {
  title: string;
  description: string;
  createdAt: Date;
}

// Create the schema
const DataSchema: Schema = new Schema({
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export the model
export default mongoose.model<IData>('Data', DataSchema);
