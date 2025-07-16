# Implementation

## 7.1 Development Environment Setup

### 7.1.1 Backend Environment Configuration

**Node.js and Dependencies Installation:**
```bash
# Initialize Node.js project
npm init -y

# Install core dependencies
npm install express mongoose cors helmet bcryptjs jsonwebtoken
npm install express-validator dotenv morgan

# Install development dependencies
npm install -D @types/node @types/express @types/bcryptjs @types/jsonwebtoken
npm install -D typescript ts-node nodemon eslint @typescript-eslint/parser
```

**TypeScript Configuration (tsconfig.json):**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 7.1.2 Database Setup and Configuration

**MongoDB Connection Implementation:**
```typescript
// src/config/db.ts
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_website';
    
    const conn = await mongoose.connect(mongoURI, {
      bufferCommands: false,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
```

**Environment Variables Configuration:**
```bash
# .env file
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/college_website
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
BCRYPT_SALT_ROUNDS=12
```

## 7.2 Backend Implementation

### 7.2.1 Express.js Server Setup

**Main Server Configuration (src/index.ts):**
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db';
import errorHandler from './middleware/errorHandler';

// Route imports
import schoolRoutes from './routes/schools';
import departmentRoutes from './routes/departments';
import facultyRoutes from './routes/faculty';
import contactRoutes from './routes/contact';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/schools', schoolRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
```

### 7.2.2 Database Models Implementation

**Faculty Model (src/models/Faculty.ts):**
```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IPublication {
  title: string;
  journal: string;
  year: number;
  type: 'journal' | 'conference' | 'book' | 'other';
  url?: string;
}

export interface IFaculty extends Document {
  departmentId: mongoose.Types.ObjectId;
  schoolId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  designation: string;
  qualification: string[];
  specialization: string[];
  experience: number;
  researchInterests: string[];
  publications: IPublication[];
  awards: string[];
  biography: string;
  image?: string;
  cv?: string;
  phone?: string;
  office?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const PublicationSchema = new Schema<IPublication>({
  title: { type: String, required: true },
  journal: { type: String, required: true },
  year: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['journal', 'conference', 'book', 'other'], 
    required: true 
  },
  url: { type: String }
});

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
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  qualification: [{
    type: String,
    required: true,
    trim: true
  }],
  specialization: [{
    type: String,
    trim: true
  }],
  experience: {
    type: Number,
    required: true,
    min: 0
  },
  researchInterests: [{
    type: String,
    trim: true
  }],
  publications: [PublicationSchema],
  awards: [{
    type: String,
    trim: true
  }],
  biography: {
    type: String,
    trim: true,
    maxlength: 5000
  },
  image: {
    type: String,
    trim: true
  },
  cv: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  office: {
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

// Indexes for better performance
FacultySchema.index({ departmentId: 1 });
FacultySchema.index({ schoolId: 1 });
FacultySchema.index({ email: 1 });
FacultySchema.index({ name: 'text', designation: 'text' });
FacultySchema.index({ status: 1 });

export default mongoose.model<IFaculty>('Faculty', FacultySchema);
```

### 7.2.3 Controller Implementation

**Faculty Controller (src/controllers/facultyController.ts):**
```typescript
import { Request, Response } from 'express';
import Faculty, { IFaculty } from '../models/Faculty';
import { validationResult } from 'express-validator';

export class FacultyController {
  // Get all faculty members
  public async getFaculty(req: Request, res: Response): Promise<void> {
    try {
      const { 
        page = 1, 
        limit = 10, 
        department, 
        school, 
        status = 'active',
        search 
      } = req.query;

      // Build query
      const query: any = {};
      
      if (status && status !== 'all') {
        query.status = status;
      }
      
      if (department) {
        query.departmentId = department;
      }
      
      if (school) {
        query.schoolId = school;
      }
      
      if (search) {
        query.$text = { $search: search as string };
      }

      // Calculate pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Execute query with population
      const faculty = await Faculty.find(query)
        .populate('departmentId', 'name code')
        .populate('schoolId', 'name code')
        .sort({ name: 1 })
        .skip(skip)
        .limit(limitNum);

      // Get total count for pagination
      const total = await Faculty.countDocuments(query);

      res.status(200).json({
        success: true,
        data: faculty,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (error) {
      console.error('Error fetching faculty:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching faculty',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get faculty by ID
  public async getFacultyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const faculty = await Faculty.findById(id)
        .populate('departmentId', 'name code')
        .populate('schoolId', 'name code');

      if (!faculty) {
        res.status(404).json({
          success: false,
          message: 'Faculty member not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: faculty
      });
    } catch (error) {
      console.error('Error fetching faculty by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching faculty member',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create new faculty member
  public async createFaculty(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
        return;
      }

      const facultyData = req.body;
      
      // Check if email already exists
      const existingFaculty = await Faculty.findOne({ email: facultyData.email });
      if (existingFaculty) {
        res.status(400).json({
          success: false,
          message: 'Faculty member with this email already exists'
        });
        return;
      }

      const faculty = new Faculty(facultyData);
      await faculty.save();

      const populatedFaculty = await Faculty.findById(faculty._id)
        .populate('departmentId', 'name code')
        .populate('schoolId', 'name code');

      res.status(201).json({
        success: true,
        message: 'Faculty member created successfully',
        data: populatedFaculty
      });
    } catch (error) {
      console.error('Error creating faculty:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating faculty member',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update faculty member
  public async updateFaculty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
        return;
      }

      // Check if email is being updated and if it already exists
      if (updateData.email) {
        const existingFaculty = await Faculty.findOne({ 
          email: updateData.email, 
          _id: { $ne: id } 
        });
        if (existingFaculty) {
          res.status(400).json({
            success: false,
            message: 'Faculty member with this email already exists'
          });
          return;
        }
      }

      const faculty = await Faculty.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate('departmentId', 'name code')
       .populate('schoolId', 'name code');

      if (!faculty) {
        res.status(404).json({
          success: false,
          message: 'Faculty member not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Faculty member updated successfully',
        data: faculty
      });
    } catch (error) {
      console.error('Error updating faculty:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating faculty member',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete faculty member
  public async deleteFaculty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const faculty = await Faculty.findByIdAndDelete(id);

      if (!faculty) {
        res.status(404).json({
          success: false,
          message: 'Faculty member not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Faculty member deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting faculty:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting faculty member',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Search faculty members
  public async searchFaculty(req: Request, res: Response): Promise<void> {
    try {
      const { q, department, school } = req.query;

      if (!q) {
        res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
        return;
      }

      const query: any = {
        $text: { $search: q as string },
        status: 'active'
      };

      if (department) {
        query.departmentId = department;
      }

      if (school) {
        query.schoolId = school;
      }

      const faculty = await Faculty.find(query)
        .populate('departmentId', 'name code')
        .populate('schoolId', 'name code')
        .sort({ score: { $meta: 'textScore' } })
        .limit(20);

      res.status(200).json({
        success: true,
        data: faculty
      });
    } catch (error) {
      console.error('Error searching faculty:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching faculty',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
```

### 7.2.4 Middleware Implementation

**Authentication Middleware (src/middleware/auth.ts):**
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

export const adminAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin role required.'
    });
  }
};
```

**Error Handler Middleware (src/middleware/errorHandler.ts):**
```typescript
import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
  statusCode?: number;
  status?: string;
}

const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { ...error, message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    const message = 'Duplicate field value entered';
    error = { ...error, message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values((err as any).errors).map((val: any) => val.message);
    error = { ...error, message: message.join(', '), statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

export default errorHandler;
```

### 7.2.5 Route Implementation

**Faculty Routes (src/routes/faculty.ts):**
```typescript
import { Router } from 'express';
import { body } from 'express-validator';
import { FacultyController } from '../controllers/facultyController';
import { auth, adminAuth } from '../middleware/auth';

const router = Router();
const facultyController = new FacultyController();

// Validation middleware
const facultyValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('designation').trim().isLength({ min: 2 }).withMessage('Designation is required'),
  body('departmentId').isMongoId().withMessage('Valid department ID is required'),
  body('schoolId').isMongoId().withMessage('Valid school ID is required'),
  body('qualification').isArray({ min: 1 }).withMessage('At least one qualification is required'),
  body('experience').isNumeric({ min: 0 }).withMessage('Experience must be a positive number')
];

// Public routes
router.get('/', facultyController.getFaculty);
router.get('/search', facultyController.searchFaculty);
router.get('/:id', facultyController.getFacultyById);

// Protected admin routes
router.post('/', auth, adminAuth, facultyValidation, facultyController.createFaculty);
router.put('/:id', auth, adminAuth, facultyValidation, facultyController.updateFaculty);
router.delete('/:id', auth, adminAuth, facultyController.deleteFaculty);

export default router;
```

## 7.3 Frontend Implementation

### 7.3.1 React Application Setup

**Vite Configuration (vite.config.ts):**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### 7.3.2 Custom Hooks Implementation

**Faculty Data Hook (src/hooks/useFacultyData.ts):**
```typescript
import { useState, useEffect, useCallback } from 'react';
import { facultyApi, IFaculty, FacultyCreateData, FacultyUpdateData } from '../services/facultyApi';

interface UseFacultyDataReturn {
  faculty: IFaculty[];
  loading: boolean;
  error: string | null;
  total: number;
  fetchFaculty: (filters?: any) => Promise<void>;
  createFaculty: (data: FacultyCreateData) => Promise<void>;
  updateFaculty: (id: string, data: FacultyUpdateData) => Promise<void>;
  deleteFaculty: (id: string) => Promise<void>;
  searchFaculty: (query: string) => Promise<void>;
  clearError: () => void;
}

export const useFacultyData = (): UseFacultyDataReturn => {
  const [faculty, setFaculty] = useState<IFaculty[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchFaculty = useCallback(async (filters?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await facultyApi.getFaculty(filters);
      setFaculty(response.data);
      setTotal(response.pagination?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch faculty');
    } finally {
      setLoading(false);
    }
  }, []);

  const createFaculty = useCallback(async (data: FacultyCreateData) => {
    try {
      setLoading(true);
      setError(null);
      await facultyApi.createFaculty(data);
      await fetchFaculty(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create faculty');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFaculty]);

  const updateFaculty = useCallback(async (id: string, data: FacultyUpdateData) => {
    try {
      setLoading(true);
      setError(null);
      await facultyApi.updateFaculty(id, data);
      await fetchFaculty(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update faculty');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFaculty]);

  const deleteFaculty = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await facultyApi.deleteFaculty(id);
      await fetchFaculty(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete faculty');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFaculty]);

  const searchFaculty = useCallback(async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await facultyApi.searchFaculty(query);
      setFaculty(response.data);
      setTotal(response.data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search faculty');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  return {
    faculty,
    loading,
    error,
    total,
    fetchFaculty,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    searchFaculty,
    clearError
  };
};
```

### 7.3.3 API Service Implementation

**Faculty API Service (src/services/facultyApi.ts):**
```typescript
import { ApiResponse, PaginatedResponse } from '../types/api.types';

export interface IPublication {
  title: string;
  journal: string;
  year: number;
  type: 'journal' | 'conference' | 'book' | 'other';
  url?: string;
}

export interface IFaculty {
  _id?: string;
  departmentId: string;
  schoolId: string;
  name: string;
  email: string;
  designation: string;
  qualification: string[];
  specialization: string[];
  experience: number;
  researchInterests: string[];
  publications: IPublication[];
  awards: string[];
  biography: string;
  image?: string;
  cv?: string;
  phone?: string;
  office?: string;
  status: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
}

export type FacultyCreateData = Omit<IFaculty, '_id' | 'createdAt' | 'updatedAt'>;
export type FacultyUpdateData = Partial<FacultyCreateData>;

const API_BASE_URL = 'http://localhost:5000/api';

class FacultyApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('adminToken');

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  }

  async getFaculty(filters?: any): Promise<PaginatedResponse<IFaculty[]>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });
    }

    const endpoint = queryParams.toString() 
      ? `/faculty?${queryParams.toString()}` 
      : '/faculty';

    return this.request<PaginatedResponse<IFaculty[]>>(endpoint);
  }

  async getFacultyById(id: string): Promise<ApiResponse<IFaculty>> {
    return this.request<ApiResponse<IFaculty>>(`/faculty/${id}`);
  }

  async createFaculty(data: FacultyCreateData): Promise<ApiResponse<IFaculty>> {
    return this.request<ApiResponse<IFaculty>>('/faculty', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateFaculty(id: string, data: FacultyUpdateData): Promise<ApiResponse<IFaculty>> {
    return this.request<ApiResponse<IFaculty>>(`/faculty/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFaculty(id: string): Promise<ApiResponse<null>> {
    return this.request<ApiResponse<null>>(`/faculty/${id}`, {
      method: 'DELETE',
    });
  }

  async searchFaculty(query: string): Promise<ApiResponse<IFaculty[]>> {
    return this.request<ApiResponse<IFaculty[]>>(`/faculty/search?q=${encodeURIComponent(query)}`);
  }
}

export const facultyApi = new FacultyApiService();
```

### 7.3.4 Component Implementation

**Faculty Management Page (src/pages/admin/ManageFaculty.tsx):**
```typescript
import React, { useState, useEffect } from 'react';
import { useFacultyData, useAcademicStructure } from '../../hooks/useFacultyData';
import type { IFaculty, FacultyCreateData, FacultyUpdateData } from '../../services/facultyApi';
import Button from '../../components/shared/Button';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorMessage from '../../components/shared/ErrorMessage';
import FacultyForm from '../../components/admin/FacultyForm';
import './ManageFaculty.css';

export const ManageFaculty: React.FC = () => {
  const {
    faculty,
    loading,
    error,
    total,
    fetchFaculty,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    searchFaculty,
    clearError
  } = useFacultyData();

  const { departments, getDepartmentById, getSchoolById, loading: academicLoading } = useAcademicStructure();

  // Local state
  const [showForm, setShowForm] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<IFaculty | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Show loading spinner if either faculty data or academic structure is loading
  const isLoading = loading || academicLoading;

  // Department statistics
  const departmentStats = (departments || []).map(dept => {
    const facultyCount = (faculty || []).filter(f => f.departmentId === dept._id).length;
    return {
      ...dept,
      facultyCount
    };
  });

  // Filter faculty based on search and filters
  const filteredFaculty = (faculty || []).filter(f => {
    const matchesSearch = !searchQuery || 
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.designation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = !selectedDepartment || f.departmentId === selectedDepartment;
    const matchesStatus = !selectedStatus || f.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchFaculty(query);
    } else {
      fetchFaculty();
    }
  };

  // Handle filter changes
  const handleFilterChange = () => {
    const filters = {
      ...(selectedDepartment && { department: selectedDepartment }),
      ...(selectedStatus && { status: selectedStatus })
    };
    fetchFaculty(filters);
  };

  // Effect for filter changes
  useEffect(() => {
    if (selectedDepartment || selectedStatus) {
      handleFilterChange();
    }
  }, [selectedDepartment, selectedStatus]);

  // Handle form submission
  const handleFormSubmit = async (data: FacultyCreateData | FacultyUpdateData) => {
    if (editingFaculty) {
      await handleUpdateFaculty(data);
    } else {
      await handleCreateFaculty(data as FacultyCreateData);
    }
  };

  // Handle create faculty
  const handleCreateFaculty = async (data: FacultyCreateData) => {
    try {
      setFormLoading(true);
      await createFaculty(data);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating faculty:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle update faculty
  const handleUpdateFaculty = async (data: FacultyUpdateData) => {
    if (!editingFaculty) return;
    
    try {
      setFormLoading(true);
      await updateFaculty(editingFaculty._id!, data);
      setShowForm(false);
      setEditingFaculty(null);
    } catch (error) {
      console.error('Error updating faculty:', error);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete faculty
  const handleDeleteFaculty = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        await deleteFaculty(id);
      } catch (error) {
        console.error('Error deleting faculty:', error);
      }
    }
  };

  // Handle edit faculty
  const handleEditFaculty = (faculty: IFaculty) => {
    setEditingFaculty(faculty);
    setShowForm(true);
  };

  // Handle form close
  const handleFormClose = () => {
    setShowForm(false);
    setEditingFaculty(null);
  };

  // Get department and school names
  const getDepartmentName = (departmentId: string) => {
    const dept = getDepartmentById(departmentId);
    return dept ? dept.name : 'Unknown Department';
  };

  const getSchoolName = (schoolId: string) => {
    const school = getSchoolById(schoolId);
    return school ? school.name : 'Unknown School';
  };

  return (
    <div className="manage-faculty-page">
      <div className="page-header">
        <h1 className="page-title">Faculty Management</h1>
        <p className="page-subtitle">Manage faculty members, departments, and academic staff</p>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error} 
          onRetry={clearError}
        />
      )}

      {/* Action Bar */}
      <div className="action-bar">
        <div className="search-section">
          <input 
            type="text" 
            placeholder="Search faculty..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <select 
            className="filter-select"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {(departments || []).map(dept => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
          <select 
            className="filter-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <Button 
          variant="admin" 
          size="md"
          onClick={() => setShowForm(true)}
        >
          Add New Faculty
        </Button>
      </div>

      {/* Faculty Grid */}
      {isLoading ? (
        <div className="loading-container">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="faculty-grid">
          {filteredFaculty.map(facultyMember => (
            <div key={facultyMember._id} className="faculty-card">
              <div className="faculty-avatar">
                {facultyMember.image ? (
                  <img src={facultyMember.image} alt={facultyMember.name} />
                ) : (
                  <span className="avatar-placeholder">👤</span>
                )}
              </div>
              <div className="faculty-info">
                <h3 className="faculty-name">{facultyMember.name}</h3>
                <div className="faculty-details">
                  <div className="detail-item">
                    <span className="detail-label">Department:</span>
                    <span className="detail-value">{getDepartmentName(facultyMember.departmentId)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">School:</span>
                    <span className="detail-value">{getSchoolName(facultyMember.schoolId)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Position:</span>
                    <span className="detail-value">{facultyMember.designation}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Experience:</span>
                    <span className="detail-value">{facultyMember.experience} years</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{facultyMember.email}</span>
                  </div>
                </div>
                <div className="faculty-status">
                  <span className={`status-badge ${facultyMember.status}`}>
                    {facultyMember.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="faculty-actions">
                <Button 
                  variant="admin" 
                  size="sm"
                  onClick={() => handleEditFaculty(facultyMember)}
                >
                  Edit
                </Button>
                <Button 
                  variant="admin" 
                  size="sm"
                  onClick={() => handleDeleteFaculty(facultyMember._id!, facultyMember.name)}
                  className="delete-button"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Faculty Form Modal */}
      {showForm && (
        <FacultyForm
          faculty={editingFaculty || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
          loading={formLoading}
        />
      )}
    </div>
  );
};

export default ManageFaculty;
```

## 7.4 Database Seeding and Data Management

### 7.4.1 Database Seeding Script

**Seed Script (src/scripts/seedAcademicData.ts):**
```typescript
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import School from '../models/School';
import Department from '../models/Department';
import Faculty from '../models/Faculty';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college_website');
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    await School.deleteMany({});
    await Department.deleteMany({});
    await Faculty.deleteMany({});

    console.log('Existing data cleared');

    // Create Schools
    const schools = await School.insertMany([
      {
        name: 'School of Engineering',
        code: 'SOE',
        description: 'Leading engineering education and research',
        dean: 'Dr. John Smith',
        contact: {
          email: 'soe@college.edu',
          phone: '+1-555-0101',
          office: 'Engineering Building, Room 101'
        },
        establishedYear: 1975,
        accreditation: ['ABET', 'NAAC'],
        status: 'active'
      },
      {
        name: 'School of Business',
        code: 'SOB',
        description: 'Excellence in business education and leadership',
        dean: 'Dr. Sarah Johnson',
        contact: {
          email: 'sob@college.edu',
          phone: '+1-555-0102',
          office: 'Business Building, Room 201'
        },
        establishedYear: 1980,
        accreditation: ['AACSB', 'NAAC'],
        status: 'active'
      }
    ]);

    console.log('Schools created');

    // Create Departments
    const departments = await Department.insertMany([
      {
        schoolId: schools[0]._id,
        name: 'Computer Science',
        code: 'CS',
        description: 'Computer Science and Software Engineering',
        head: 'Dr. Alice Brown',
        contact: {
          email: 'cs@college.edu',
          phone: '+1-555-0201',
          office: 'CS Building, Room 301'
        },
        facilities: ['Computer Labs', 'Research Labs', 'Seminar Halls'],
        achievements: ['Best Department Award 2023'],
        status: 'active'
      },
      {
        schoolId: schools[0]._id,
        name: 'Electrical Engineering',
        code: 'EE',
        description: 'Electrical and Electronics Engineering',
        head: 'Dr. Bob Wilson',
        contact: {
          email: 'ee@college.edu',
          phone: '+1-555-0202',
          office: 'EE Building, Room 401'
        },
        facilities: ['Electronics Labs', 'Power Systems Lab'],
        achievements: ['Innovation Award 2022'],
        status: 'active'
      },
      {
        schoolId: schools[1]._id,
        name: 'Business Administration',
        code: 'BA',
        description: 'Business Administration and Management',
        head: 'Dr. Carol Davis',
        contact: {
          email: 'ba@college.edu',
          phone: '+1-555-0203',
          office: 'Business Building, Room 501'
        },
        facilities: ['Case Study Rooms', 'Business Simulation Lab'],
        achievements: ['Excellence in Teaching 2023'],
        status: 'active'
      }
    ]);

    console.log('Departments created');

    // Create Faculty
    const faculty = await Faculty.insertMany([
      {
        departmentId: departments[0]._id,
        schoolId: schools[0]._id,
        name: 'Dr. Michael Chen',
        email: 'michael.chen@college.edu',
        designation: 'Professor',
        qualification: ['Ph.D. Computer Science', 'M.S. Software Engineering'],
        specialization: ['Machine Learning', 'Artificial Intelligence'],
        experience: 15,
        researchInterests: ['Deep Learning', 'Computer Vision', 'Natural Language Processing'],
        publications: [
          {
            title: 'Advanced Machine Learning Techniques',
            journal: 'IEEE Transactions on AI',
            year: 2023,
            type: 'journal',
            url: 'https://example.com/paper1'
          }
        ],
        awards: ['Best Teacher Award 2022', 'Research Excellence Award 2021'],
        biography: 'Dr. Chen is a leading researcher in machine learning with over 15 years of experience.',
        phone: '+1-555-1001',
        office: 'CS Building, Room 210',
        status: 'active'
      },
      {
        departmentId: departments[0]._id,
        schoolId: schools[0]._id,
        name: 'Dr. Lisa Rodriguez',
        email: 'lisa.rodriguez@college.edu',
        designation: 'Associate Professor',
        qualification: ['Ph.D. Computer Science', 'M.S. Information Systems'],
        specialization: ['Database Systems', 'Web Development'],
        experience: 10,
        researchInterests: ['Database Optimization', 'Cloud Computing', 'Cybersecurity'],
        publications: [
          {
            title: 'Modern Database Architecture',
            journal: 'ACM Computing Surveys',
            year: 2022,
            type: 'journal'
          }
        ],
        awards: ['Young Researcher Award 2020'],
        biography: 'Dr. Rodriguez specializes in database systems and cloud computing technologies.',
        phone: '+1-555-1002',
        office: 'CS Building, Room 215',
        status: 'active'
      },
      {
        departmentId: departments[1]._id,
        schoolId: schools[0]._id,
        name: 'Dr. David Kumar',
        email: 'david.kumar@college.edu',
        designation: 'Professor',
        qualification: ['Ph.D. Electrical Engineering', 'M.S. Power Systems'],
        specialization: ['Power Electronics', 'Renewable Energy'],
        experience: 20,
        researchInterests: ['Solar Energy Systems', 'Smart Grid Technology'],
        publications: [
          {
            title: 'Renewable Energy Integration',
            journal: 'IEEE Power Electronics',
            year: 2023,
            type: 'journal'
          }
        ],
        awards: ['Lifetime Achievement Award 2021'],
        biography: 'Dr. Kumar is an expert in power systems and renewable energy technologies.',
        phone: '+1-555-1003',
        office: 'EE Building, Room 310',
        status: 'active'
      }
    ]);

    console.log('Faculty created');
    console.log(`Seeded ${schools.length} schools, ${departments.length} departments, and ${faculty.length} faculty members`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

const runSeed = async () => {
  await connectDB();
  await seedData();
};

runSeed();
```

## 7.5 Testing Implementation

### 7.5.1 API Testing

**Faculty API Tests (tests/faculty.test.ts):**
```typescript
import request from 'supertest';
import app from '../src/index';
import Faculty from '../src/models/Faculty';
import { connectTestDB, clearTestDB, closeTestDB } from './helpers/database';

describe('Faculty API', () => {
  beforeAll(async () => {
    await connectTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  afterAll(async () => {
    await closeTestDB();
  });

  describe('GET /api/faculty', () => {
    it('should return all active faculty members', async () => {
      // Create test faculty
      await Faculty.create({
        departmentId: '507f1f77bcf86cd799439011',
        schoolId: '507f1f77bcf86cd799439012',
        name: 'Test Faculty',
        email: 'test@college.edu',
        designation: 'Professor',
        qualification: ['Ph.D.'],
        experience: 10,
        status: 'active'
      });

      const response = await request(app)
        .get('/api/faculty')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Test Faculty');
    });

    it('should return filtered faculty by department', async () => {
      const deptId = '507f1f77bcf86cd799439011';
      
      await Faculty.create({
        departmentId: deptId,
        schoolId: '507f1f77bcf86cd799439012',
        name: 'CS Faculty',
        email: 'cs@college.edu',
        designation: 'Professor',
        qualification: ['Ph.D.'],
        experience: 5,
        status: 'active'
      });

      await Faculty.create({
        departmentId: '507f1f77bcf86cd799439013',
        schoolId: '507f1f77bcf86cd799439012',
        name: 'EE Faculty',
        email: 'ee@college.edu',
        designation: 'Associate Professor',
        qualification: ['Ph.D.'],
        experience: 8,
        status: 'active'
      });

      const response = await request(app)
        .get(`/api/faculty?department=${deptId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('CS Faculty');
    });
  });

  describe('POST /api/faculty', () => {
    it('should create a new faculty member with valid data', async () => {
      const facultyData = {
        departmentId: '507f1f77bcf86cd799439011',
        schoolId: '507f1f77bcf86cd799439012',
        name: 'New Faculty',
        email: 'new@college.edu',
        designation: 'Assistant Professor',
        qualification: ['Ph.D. Computer Science'],
        specialization: ['Machine Learning'],
        experience: 3,
        researchInterests: ['AI', 'ML'],
        status: 'active'
      };

      const response = await request(app)
        .post('/api/faculty')
        .send(facultyData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('New Faculty');
      expect(response.body.data.email).toBe('new@college.edu');
    });

    it('should return validation error for invalid data', async () => {
      const invalidData = {
        name: '', // Invalid: empty name
        email: 'invalid-email', // Invalid: malformed email
        designation: 'Professor'
      };

      const response = await request(app)
        .post('/api/faculty')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation errors');
    });
  });

  describe('PUT /api/faculty/:id', () => {
    it('should update faculty member with valid data', async () => {
      const faculty = await Faculty.create({
        departmentId: '507f1f77bcf86cd799439011',
        schoolId: '507f1f77bcf86cd799439012',
        name: 'Original Name',
        email: 'original@college.edu',
        designation: 'Professor',
        qualification: ['Ph.D.'],
        experience: 10,
        status: 'active'
      });

      const updateData = {
        name: 'Updated Name',
        designation: 'Senior Professor'
      };

      const response = await request(app)
        .put(`/api/faculty/${faculty._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Updated Name');
      expect(response.body.data.designation).toBe('Senior Professor');
    });
  });

  describe('DELETE /api/faculty/:id', () => {
    it('should delete faculty member', async () => {
      const faculty = await Faculty.create({
        departmentId: '507f1f77bcf86cd799439011',
        schoolId: '507f1f77bcf86cd799439012',
        name: 'To Delete',
        email: 'delete@college.edu',
        designation: 'Professor',
        qualification: ['Ph.D.'],
        experience: 5,
        status: 'active'
      });

      await request(app)
        .delete(`/api/faculty/${faculty._id}`)
        .expect(200);

      const deletedFaculty = await Faculty.findById(faculty._id);
      expect(deletedFaculty).toBeNull();
    });
  });
});
```

This implementation section demonstrates the complete development process from environment setup to testing, showcasing backend-focused development with Node.js, Express.js, and MongoDB, while also providing a modern React frontend with TypeScript.
