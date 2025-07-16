import { Request, Response } from 'express';
import Faculty, { IFaculty } from '../models/Faculty';
import Department from '../models/Department';
import School from '../models/School';

export class FacultyController {
  // Get all faculty with filters (public endpoint)
  public async getFaculty(req: Request, res: Response): Promise<void> {
    try {
      const { 
        departmentId, 
        schoolId, 
        designation, 
        status,
        page = 1,
        limit = 20 
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      // Build query
      const query: any = {};
      if (departmentId && typeof departmentId === 'string') {
        query.departmentId = departmentId;
      }
      if (schoolId && typeof schoolId === 'string') {
        query.schoolId = schoolId;
      }
      if (designation && typeof designation === 'string') {
        query.designation = designation;
      }
      if (status && typeof status === 'string') {
        if (status !== 'all') {
          query.status = status;
        }
        // If status is 'all', don't add status filter to get all faculty
      } else {
        // Default to active faculty for public view
        query.status = 'active';
      }

      const faculty = await Faculty.find(query)
        .populate('departmentId', 'name code')
        .populate('schoolId', 'name code')
        .sort({ designation: 1, name: 1 })
        .skip(skip)
        .limit(limitNum);

      // Get total count for pagination
      const total = await Faculty.countDocuments(query);

      res.status(200).json({
        success: true,
        data: {
          faculty,
          pagination: {
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalItems: total,
            itemsPerPage: limitNum
          }
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

  // Get faculty by department (public endpoint)
  public async getFacultyByDepartment(req: Request, res: Response): Promise<void> {
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

      const faculty = await Faculty.find({ 
        departmentId, 
        status: 'active' 
      }).sort({ designation: 1, name: 1 });

      res.status(200).json({
        success: true,
        data: {
          department,
          faculty
        }
      });
    } catch (error) {
      console.error('Error fetching faculty by department:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching faculty',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Get faculty by ID with full details (public endpoint)
  public async getFacultyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Faculty ID is required'
        });
        return;
      }

      const faculty = await Faculty.findById(id)
        .populate('departmentId', 'name code head contact')
        .populate('schoolId', 'name code dean contact');

      if (!faculty) {
        res.status(404).json({
          success: false,
          message: 'Faculty not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: faculty
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

  // Create new faculty (admin only)
  public async createFaculty(req: Request, res: Response): Promise<void> {
    try {
      const facultyData = req.body;

      // Validate required fields
      const requiredFields = [
        'departmentId', 'schoolId', 'name', 'designation', 
        'qualification', 'experience', 'email', 'specialization', 'biography'
      ];

      for (const field of requiredFields) {
        if (!facultyData[field]) {
          res.status(400).json({
            success: false,
            message: `${field} is required`
          });
          return;
        }
      }

      // Verify department and school exist
      const department = await Department.findById(facultyData.departmentId);
      if (!department) {
        res.status(404).json({
          success: false,
          message: 'Department not found'
        });
        return;
      }

      const school = await School.findById(facultyData.schoolId);
      if (!school) {
        res.status(404).json({
          success: false,
          message: 'School not found'
        });
        return;
      }

      // Check if email already exists
      const existingFaculty = await Faculty.findOne({ 
        email: facultyData.email.toLowerCase() 
      });
      if (existingFaculty) {
        res.status(400).json({
          success: false,
          message: 'Faculty with this email already exists'
        });
        return;
      }

      // Create new faculty
      const newFaculty = new Faculty({
        ...facultyData,
        email: facultyData.email.toLowerCase()
      });

      await newFaculty.save();

      // Add faculty to department's faculty array
      await Department.findByIdAndUpdate(
        facultyData.departmentId,
        { $addToSet: { faculty: newFaculty._id } }
      );

      // Populate references for response
      await newFaculty.populate('departmentId', 'name code');
      await newFaculty.populate('schoolId', 'name code');

      res.status(201).json({
        success: true,
        message: 'Faculty created successfully',
        data: newFaculty
      });
    } catch (error) {
      console.error('Error creating faculty:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating faculty',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update faculty (admin only)
  public async updateFaculty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Faculty ID is required'
        });
        return;
      }

      // Check if faculty exists
      const faculty = await Faculty.findById(id);
      if (!faculty) {
        res.status(404).json({
          success: false,
          message: 'Faculty not found'
        });
        return;
      }

      // If email is being updated, check for uniqueness
      if (updateData.email && updateData.email !== faculty.email) {
        const existingFaculty = await Faculty.findOne({ 
          email: updateData.email.toLowerCase(),
          _id: { $ne: id }
        });
        if (existingFaculty) {
          res.status(400).json({
            success: false,
            message: 'Faculty with this email already exists'
          });
          return;
        }
      }

      // If department is being changed, update department arrays
      if (updateData.departmentId && updateData.departmentId !== faculty.departmentId.toString()) {
        // Remove from old department
        await Department.findByIdAndUpdate(
          faculty.departmentId,
          { $pull: { faculty: faculty._id } }
        );
        
        // Add to new department
        await Department.findByIdAndUpdate(
          updateData.departmentId,
          { $addToSet: { faculty: faculty._id } }
        );
      }

      // Update faculty
      const updatedFaculty = await Faculty.findByIdAndUpdate(
        id,
        { ...updateData, email: updateData.email?.toLowerCase() },
        { new: true, runValidators: true }
      )
        .populate('departmentId', 'name code')
        .populate('schoolId', 'name code');

      res.status(200).json({
        success: true,
        message: 'Faculty updated successfully',
        data: updatedFaculty
      });
    } catch (error) {
      console.error('Error updating faculty:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating faculty',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete faculty (admin only)
  public async deleteFaculty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Faculty ID is required'
        });
        return;
      }

      const faculty = await Faculty.findById(id);
      if (!faculty) {
        res.status(404).json({
          success: false,
          message: 'Faculty not found'
        });
        return;
      }

      // Remove faculty from department
      await Department.findByIdAndUpdate(
        faculty.departmentId,
        { $pull: { faculty: faculty._id } }
      );

      // Delete faculty
      await Faculty.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message: 'Faculty deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting faculty:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting faculty',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Search faculty (public endpoint)
  public async searchFaculty(req: Request, res: Response): Promise<void> {
    try {
      const { query, designation, departmentId } = req.query;

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
          { specialization: { $elemMatch: { $regex: query, $options: 'i' } } },
          { researchInterests: { $elemMatch: { $regex: query, $options: 'i' } } },
          { biography: { $regex: query, $options: 'i' } }
        ]
      };

      if (designation && typeof designation === 'string') {
        searchQuery.designation = designation;
      }
      if (departmentId && typeof departmentId === 'string') {
        searchQuery.departmentId = departmentId;
      }

      const faculty = await Faculty.find(searchQuery)
        .populate('departmentId', 'name code')
        .populate('schoolId', 'name code')
        .sort({ designation: 1, name: 1 })
        .limit(50); // Limit search results

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

  // Get faculty statistics (admin only)
  public async getFacultyStats(req: Request, res: Response): Promise<void> {
    try {
      // Get faculty count by designation
      const designationStats = await Faculty.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$designation', count: { $sum: 1 } } }
      ]);

      // Get faculty count by department
      const departmentStats = await Faculty.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$departmentId', count: { $sum: 1 } } },
        { 
          $lookup: {
            from: 'departments',
            localField: '_id',
            foreignField: '_id',
            as: 'department'
          }
        },
        { $unwind: '$department' },
        {
          $project: {
            departmentName: '$department.name',
            count: 1
          }
        }
      ]);

      // Get total faculty count
      const totalFaculty = await Faculty.countDocuments({ status: 'active' });

      res.status(200).json({
        success: true,
        data: {
          totalFaculty,
          facultyByDesignation: designationStats,
          facultyByDepartment: departmentStats
        }
      });
    } catch (error) {
      console.error('Error fetching faculty stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching faculty statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
