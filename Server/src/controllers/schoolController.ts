import { Request, Response } from 'express';
import School, { ISchool } from '../models/School';
import Department from '../models/Department';

export class SchoolController {
  // Get all schools (public endpoint)
  public async getSchools(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.query;

      // Build query
      const query: any = {};
      if (status && typeof status === 'string') {
        if (status !== 'all') {
          query.status = status;
        }
        // If status is 'all', don't add status filter to get all schools
      } else {
        // Default to active schools for public view
        query.status = 'active';
      }

      const schools = await School.find(query).sort({ name: 1 });

      res.status(200).json({
        success: true,
        data: schools
      });
    } catch (error) {
      console.error('Error fetching schools:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching schools',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get school by ID with departments (public endpoint)
  public async getSchoolById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'School ID is required'
        });
        return;
      }

      const school = await School.findById(id);

      if (!school) {
        res.status(404).json({
          success: false,
          message: 'School not found'
        });
        return;
      }

      // Get departments for this school
      const departments = await Department.find({ 
        schoolId: id, 
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
      console.error('Error fetching school:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching school',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create new school (admin only)
  public async createSchool(req: Request, res: Response): Promise<void> {
    try {
      const {
        name,
        code,
        description,
        dean,
        contact,
        establishedYear,
        accreditation,
        image,
        status
      } = req.body;

      // Validate required fields
      if (!name || !code || !description || !dean || !contact || !establishedYear) {
        res.status(400).json({
          success: false,
          message: 'Name, code, description, dean, contact, and established year are required'
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

      // Check if school code already exists
      const existingSchool = await School.findOne({ code: code.toUpperCase() });
      if (existingSchool) {
        res.status(400).json({
          success: false,
          message: 'School with this code already exists'
        });
        return;
      }

      // Create new school
      const newSchool = new School({
        name: name.trim(),
        code: code.toUpperCase().trim(),
        description: description.trim(),
        dean: dean.trim(),
        contact: {
          email: contact.email.trim().toLowerCase(),
          phone: contact.phone.trim(),
          office: contact.office.trim()
        },
        establishedYear,
        accreditation: accreditation || [],
        image,
        status: status || 'active'
      });

      await newSchool.save();

      res.status(201).json({
        success: true,
        message: 'School created successfully',
        data: newSchool
      });
    } catch (error) {
      console.error('Error creating school:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating school',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update school (admin only)
  public async updateSchool(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'School ID is required'
        });
        return;
      }

      // Check if school exists
      const school = await School.findById(id);
      if (!school) {
        res.status(404).json({
          success: false,
          message: 'School not found'
        });
        return;
      }

      // If code is being updated, check for uniqueness
      if (updateData.code && updateData.code !== school.code) {
        const existingSchool = await School.findOne({ 
          code: updateData.code.toUpperCase(),
          _id: { $ne: id }
        });
        if (existingSchool) {
          res.status(400).json({
            success: false,
            message: 'School with this code already exists'
          });
          return;
        }
      }

      // Update school
      const updatedSchool = await School.findByIdAndUpdate(
        id,
        { ...updateData, code: updateData.code?.toUpperCase() },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: 'School updated successfully',
        data: updatedSchool
      });
    } catch (error) {
      console.error('Error updating school:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating school',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete school (admin only)
  public async deleteSchool(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'School ID is required'
        });
        return;
      }

      // Check if school has departments
      const departmentCount = await Department.countDocuments({ schoolId: id });
      if (departmentCount > 0) {
        res.status(400).json({
          success: false,
          message: 'Cannot delete school with existing departments. Please delete or move departments first.'
        });
        return;
      }

      const school = await School.findByIdAndDelete(id);

      if (!school) {
        res.status(404).json({
          success: false,
          message: 'School not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'School deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting school:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting school',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get school statistics (admin only)
  public async getSchoolStats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'School ID is required'
        });
        return;
      }

      // Get basic school info
      const school = await School.findById(id);
      if (!school) {
        res.status(404).json({
          success: false,
          message: 'School not found'
        });
        return;
      }

      // Get department count
      const departmentCount = await Department.countDocuments({ 
        schoolId: id, 
        status: 'active' 
      });

      // Get total courses count (we'll implement this after Course model)
      // const courseCount = await Course.countDocuments({ schoolId: id, status: 'active' });

      // Get total faculty count (we'll implement this after Faculty model)
      // const facultyCount = await Faculty.countDocuments({ schoolId: id, status: 'active' });

      res.status(200).json({
        success: true,
        data: {
          school,
          stats: {
            departments: departmentCount,
            // courses: courseCount,
            // faculty: facultyCount
          }
        }
      });
    } catch (error) {
      console.error('Error fetching school stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching school statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
