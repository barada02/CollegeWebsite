import { Request, Response } from 'express';
import Course, { ICourse } from '../models/Course';
import Department from '../models/Department';
import School from '../models/School';

export class CourseController {
  // Get all courses with filters (public endpoint)
  public async getCourses(req: Request, res: Response): Promise<void> {
    try {
      const { 
        level, 
        degree, 
        departmentId, 
        schoolId, 
        status, 
        admissionOpen,
        page = 1,
        limit = 20 
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build query
      const query: any = {};
      if (level && typeof level === 'string') {
        query.level = level;
      }
      if (degree && typeof degree === 'string') {
        query.degree = degree;
      }
      if (departmentId && typeof departmentId === 'string') {
        query.departmentId = departmentId;
      }
      if (schoolId && typeof schoolId === 'string') {
        query.schoolId = schoolId;
      }
      if (status && typeof status === 'string') {
        query.status = status;
      } else {
        // Default to active courses for public view
        query.status = 'active';
      }
      if (admissionOpen !== undefined) {
        query.admissionOpen = admissionOpen === 'true';
      }

      const courses = await Course.find(query)
        .populate('departmentId', 'name code')
        .populate('schoolId', 'name code')
        .sort({ level: 1, name: 1 })
        .skip(skip)
        .limit(limitNum);

      // Get total count for pagination
      const total = await Course.countDocuments(query);

      res.status(200).json({
        success: true,
        data: {
          courses,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalItems: total,
            itemsPerPage: limitNum
          }
        }
      });
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching courses',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get courses by level (UG/PG) (public endpoint)
  public async getCoursesByLevel(req: Request, res: Response): Promise<void> {
    try {
      const { level } = req.params;

      if (!level) {
        res.status(400).json({
          success: false,
          message: 'Level is required'
        });
        return;
      }

      const validLevels = ['UG', 'PG', 'Diploma', 'PhD'];
      if (!validLevels.includes(level.toUpperCase())) {
        res.status(400).json({
          success: false,
          message: 'Invalid level. Must be one of: ' + validLevels.join(', ')
        });
        return;
      }

      const courses = await Course.find({ 
        level: level.toUpperCase(), 
        status: 'active' 
      })
        .populate('departmentId', 'name code')
        .populate('schoolId', 'name code')
        .sort({ name: 1 });

      res.status(200).json({
        success: true,
        data: courses
      });
    } catch (error) {
      console.error('Error fetching courses by level:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching courses',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get courses by department (public endpoint)
  public async getCoursesByDepartment(req: Request, res: Response): Promise<void> {
    try {
      const { departmentId } = req.params;

      if (!departmentId) {
        res.status(400).json({
          success: false,
          message: 'Department ID is required'
        });
        return;
      }

      // Verify department exists
      const department = await Department.findById(departmentId)
        .populate('schoolId', 'name code');
      
      if (!department) {
        res.status(404).json({
          success: false,
          message: 'Department not found'
        });
        return;
      }

      const courses = await Course.find({ 
        departmentId, 
        status: 'active' 
      }).sort({ level: 1, name: 1 });

      res.status(200).json({
        success: true,
        data: {
          department,
          courses
        }
      });
    } catch (error) {
      console.error('Error fetching courses by department:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching courses',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get course by ID with full details (public endpoint)
  public async getCourseById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Course ID is required'
        });
        return;
      }

      const course = await Course.findById(id)
        .populate('departmentId', 'name code head contact')
        .populate('schoolId', 'name code dean contact');

      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: course
      });
    } catch (error) {
      console.error('Error fetching course:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching course',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create new course (admin only)
  public async createCourse(req: Request, res: Response): Promise<void> {
    try {
      const courseData = req.body;

      // Validate required fields
      const requiredFields = [
        'departmentId', 'schoolId', 'name', 'shortName', 'code', 
        'level', 'degree', 'duration', 'totalCredits', 'eligibility', 
        'feeStructure', 'description', 'intake'
      ];

      for (const field of requiredFields) {
        if (!courseData[field]) {
          res.status(400).json({
            success: false,
            message: `${field} is required`
          });
          return;
        }
      }

      // Verify department and school exist
      const department = await Department.findById(courseData.departmentId);
      if (!department) {
        res.status(404).json({
          success: false,
          message: 'Department not found'
        });
        return;
      }

      const school = await School.findById(courseData.schoolId);
      if (!school) {
        res.status(404).json({
          success: false,
          message: 'School not found'
        });
        return;
      }

      // Check if course code already exists
      const existingCourse = await Course.findOne({ 
        code: courseData.code.toUpperCase() 
      });
      if (existingCourse) {
        res.status(400).json({
          success: false,
          message: 'Course with this code already exists'
        });
        return;
      }

      // Create new course
      const newCourse = new Course({
        ...courseData,
        code: courseData.code.toUpperCase(),
        level: courseData.level.toUpperCase()
      });

      await newCourse.save();

      // Populate references for response
      await newCourse.populate('departmentId', 'name code');
      await newCourse.populate('schoolId', 'name code');

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: newCourse
      });
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating course',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update course (admin only)
  public async updateCourse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Course ID is required'
        });
        return;
      }

      // Check if course exists
      const course = await Course.findById(id);
      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        });
        return;
      }

      // If code is being updated, check for uniqueness
      if (updateData.code && updateData.code !== course.code) {
        const existingCourse = await Course.findOne({ 
          code: updateData.code.toUpperCase(),
          _id: { $ne: id }
        });
        if (existingCourse) {
          res.status(400).json({
            success: false,
            message: 'Course with this code already exists'
          });
          return;
        }
      }

      // Update course
      const updatedCourse = await Course.findByIdAndUpdate(
        id,
        { 
          ...updateData, 
          code: updateData.code?.toUpperCase(),
          level: updateData.level?.toUpperCase()
        },
        { new: true, runValidators: true }
      )
        .populate('departmentId', 'name code')
        .populate('schoolId', 'name code');

      res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: updatedCourse
      });
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating course',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete course (admin only)
  public async deleteCourse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Course ID is required'
        });
        return;
      }

      const course = await Course.findByIdAndDelete(id);

      if (!course) {
        res.status(404).json({
          success: false,
          message: 'Course not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Course deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting course',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Search courses (public endpoint)
  public async searchCourses(req: Request, res: Response): Promise<void> {
    try {
      const { query, level, degree } = req.query;

      if (!query || typeof query !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
        return;
      }

      // Build search query
      const searchQuery: any = {
        status: 'active',
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { shortName: { $regex: query, $options: 'i' } },
          { code: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { specialization: { $regex: query, $options: 'i' } }
        ]
      };

      if (level && typeof level === 'string') {
        searchQuery.level = level.toUpperCase();
      }
      if (degree && typeof degree === 'string') {
        searchQuery.degree = degree;
      }

      const courses = await Course.find(searchQuery)
        .populate('departmentId', 'name code')
        .populate('schoolId', 'name code')
        .sort({ level: 1, name: 1 })
        .limit(50); // Limit search results

      res.status(200).json({
        success: true,
        data: courses
      });
    } catch (error) {
      console.error('Error searching courses:', error);
      res.status(500).json({
        success: false,
        message: 'Error searching courses',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
