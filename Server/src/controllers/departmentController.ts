import { Request, Response } from 'express';
import Department, { IDepartment } from '../models/Department';
import School from '../models/School';
import Course from '../models/Course';
import Faculty from '../models/Faculty';

export class DepartmentController {
  // Get all departments (public endpoint)
  public async getDepartments(req: Request, res: Response): Promise<void> {
    try {
      const { schoolId, status } = req.query;

      // Build query
      const query: any = {};
      if (schoolId && typeof schoolId === 'string') {
        query.schoolId = schoolId;
      }
      if (status && typeof status === 'string') {
        query.status = status;
      } else {
        // Default to active departments for public view
        query.status = 'active';
      }

      const departments = await Department.find(query)
        .populate('schoolId', 'name code')
        .sort({ name: 1 });

      res.status(200).json({
        success: true,
        data: departments
      });
    } catch (error) {
      console.error('Error fetching departments:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching departments',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get departments by school ID (public endpoint)
  public async getDepartmentsBySchool(req: Request, res: Response): Promise<void> {
    try {
      const { schoolId } = req.params;

      if (!schoolId) {
        res.status(400).json({
          success: false,
          message: 'School ID is required'
        });
        return;
      }

      // Verify school exists
      const school = await School.findById(schoolId);
      if (!school) {
        res.status(404).json({
          success: false,
          message: 'School not found'
        });
        return;
      }

      const departments = await Department.find({ 
        schoolId, 
        status: 'active' 
      }).sort({ name: 1 });

      res.status(200).json({
        success: true,
        data: {
          school,
          departments
        }
      });
    } catch (error) {
      console.error('Error fetching departments by school:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching departments',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get department by ID with courses and faculty (public endpoint)
  public async getDepartmentById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Department ID is required'
        });
        return;
      }

      const department = await Department.findById(id)
        .populate('schoolId', 'name code description');

      if (!department) {
        res.status(404).json({
          success: false,
          message: 'Department not found'
        });
        return;
      }

      // Get courses for this department
      const courses = await Course.find({ 
        departmentId: id, 
        status: 'active' 
      }).sort({ level: 1, name: 1 });

      // Get faculty for this department
      const faculty = await Faculty.find({ 
        departmentId: id, 
        status: 'active' 
      }).sort({ designation: 1, name: 1 });

      res.status(200).json({
        success: true,
        data: {
          department,
          courses,
          faculty
        }
      });
    } catch (error) {
      console.error('Error fetching department:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching department',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create new department (admin only)
  public async createDepartment(req: Request, res: Response): Promise<void> {
    try {
      const {
        schoolId,
        name,
        code,
        description,
        head,
        contact,
        facilities,
        achievements,
        image,
        status
      } = req.body;

      // Validate required fields
      if (!schoolId || !name || !code || !description || !head || !contact) {
        res.status(400).json({
          success: false,
          message: 'School ID, name, code, description, head, and contact are required'
        });
        return;
      }

      // Validate contact object
      if (!contact.email || !contact.phone || !contact.office) {
        res.status(400).json({
          success: false,
          message: 'Contact email, phone, and office are required'
        });
        return;
      }

      // Verify school exists
      const school = await School.findById(schoolId);
      if (!school) {
        res.status(404).json({
          success: false,
          message: 'School not found'
        });
        return;
      }

      // Check if department code already exists in this school
      const existingDepartment = await Department.findOne({ 
        schoolId, 
        code: code.toUpperCase() 
      });
      if (existingDepartment) {
        res.status(400).json({
          success: false,
          message: 'Department with this code already exists in this school'
        });
        return;
      }

      // Create new department
      const newDepartment = new Department({
        schoolId,
        name: name.trim(),
        code: code.toUpperCase().trim(),
        description: description.trim(),
        head: head.trim(),
        contact: {
          email: contact.email.trim().toLowerCase(),
          phone: contact.phone.trim(),
          office: contact.office.trim()
        },
        facilities: facilities || [],
        achievements: achievements || [],
        image,
        status: status || 'active'
      });

      await newDepartment.save();

      // Populate school info for response
      await newDepartment.populate('schoolId', 'name code');

      res.status(201).json({
        success: true,
        message: 'Department created successfully',
        data: newDepartment
      });
    } catch (error) {
      console.error('Error creating department:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating department',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update department (admin only)
  public async updateDepartment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Department ID is required'
        });
        return;
      }

      // Check if department exists
      const department = await Department.findById(id);
      if (!department) {
        res.status(404).json({
          success: false,
          message: 'Department not found'
        });
        return;
      }

      // If code is being updated, check for uniqueness within the school
      if (updateData.code && updateData.code !== department.code) {
        const existingDepartment = await Department.findOne({ 
          schoolId: department.schoolId,
          code: updateData.code.toUpperCase(),
          _id: { $ne: id }
        });
        if (existingDepartment) {
          res.status(400).json({
            success: false,
            message: 'Department with this code already exists in this school'
          });
          return;
        }
      }

      // Update department
      const updatedDepartment = await Department.findByIdAndUpdate(
        id,
        { ...updateData, code: updateData.code?.toUpperCase() },
        { new: true, runValidators: true }
      ).populate('schoolId', 'name code');

      res.status(200).json({
        success: true,
        message: 'Department updated successfully',
        data: updatedDepartment
      });
    } catch (error) {
      console.error('Error updating department:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating department',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete department (admin only)
  public async deleteDepartment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Department ID is required'
        });
        return;
      }

      // Check if department has courses
      const courseCount = await Course.countDocuments({ departmentId: id });
      if (courseCount > 0) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete department with existing courses. Please delete or move courses first.'
        });
        return;
      }

      // Check if department has faculty
      const facultyCount = await Faculty.countDocuments({ departmentId: id });
      if (facultyCount > 0) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete department with existing faculty. Please delete or move faculty first.'
        });
        return;
      }

      const department = await Department.findByIdAndDelete(id);

      if (!department) {
        res.status(404).json({
          success: false,
          message: 'Department not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Department deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting department:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting department',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get department statistics (admin only)
  public async getDepartmentStats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Department ID is required'
        });
        return;
      }

      // Get basic department info
      const department = await Department.findById(id)
        .populate('schoolId', 'name code');
      
      if (!department) {
        res.status(404).json({
          success: false,
          message: 'Department not found'
        });
        return;
      }

      // Get course count by level
      const courseStats = await Course.aggregate([
        { $match: { departmentId: department._id, status: 'active' } },
        { $group: { _id: '$level', count: { $sum: 1 } } }
      ]);

      // Get faculty count by designation
      const facultyStats = await Faculty.aggregate([
        { $match: { departmentId: department._id, status: 'active' } },
        { $group: { _id: '$designation', count: { $sum: 1 } } }
      ]);

      // Get total counts
      const totalCourses = await Course.countDocuments({ 
        departmentId: id, 
        status: 'active' 
      });
      const totalFaculty = await Faculty.countDocuments({ 
        departmentId: id, 
        status: 'active' 
      });

      res.status(200).json({
        success: true,
        data: {
          department,
          stats: {
            totalCourses,
            totalFaculty,
            coursesByLevel: courseStats,
            facultyByDesignation: facultyStats
          }
        }
      });
    } catch (error) {
      console.error('Error fetching department stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching department statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
