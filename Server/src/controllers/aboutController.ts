import { Request, Response } from 'express';
import About, { IAbout } from '../models/About';

export class AboutController {
  // Get about information
  public async getAbout(req: Request, res: Response): Promise<void> {
    try {
      // Get the most recent about document (should only be one)
      const about = await About.findOne().sort({ updatedAt: -1 });
      
      if (!about) {
        res.status(404).json({
          success: false,
          message: 'About information not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: about
      });
    } catch (error) {
      console.error('Error fetching about information:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching about information',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Create or update about information (admin only)
  public async updateAbout(req: Request, res: Response): Promise<void> {
    try {
      const {
        mission,
        vision,
        values,
        history,
        stats,
        achievements,
        leadership
      } = req.body;

      // Validate required fields
      if (!mission || !vision || !values || !history) {
        res.status(400).json({
          success: false,
          message: 'Mission, vision, values, and history are required'
        });
        return;
      }

      // Find existing about document or create new one
      let about = await About.findOne();
      
      if (about) {
        // Update existing document
        about.mission = mission;
        about.vision = vision;
        about.values = values;
        about.history = history;
        about.stats = stats || about.stats;
        about.achievements = achievements || about.achievements;
        about.leadership = leadership || about.leadership;
        about.updatedAt = new Date();
        
        await about.save();
      } else {
        // Create new document
        about = new About({
          mission,
          vision,
          values,
          history,
          stats: stats || {
            students: 0,
            faculty: 0,
            programs: 0,
            yearsOfExcellence: 0
          },
          achievements: achievements || [],
          leadership: leadership || []
        });
        
        await about.save();
      }

      res.status(200).json({
        success: true,
        message: 'About information updated successfully',
        data: about
      });
    } catch (error) {
      console.error('Error updating about information:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating about information',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Update only stats (admin only)
  public async updateStats(req: Request, res: Response): Promise<void> {
    try {
      const { students, faculty, programs, yearsOfExcellence } = req.body;

      // Validate stats
      if (typeof students !== 'number' || typeof faculty !== 'number' || 
          typeof programs !== 'number' || typeof yearsOfExcellence !== 'number') {
        res.status(400).json({
          success: false,
          message: 'All stats must be valid numbers'
        });
        return;
      }

      const about = await About.findOne();
      
      if (!about) {
        res.status(404).json({
          success: false,
          message: 'About information not found'
        });
        return;
      }

      about.stats = {
        students,
        faculty,
        programs,
        yearsOfExcellence
      };
      about.updatedAt = new Date();
      
      await about.save();

      res.status(200).json({
        success: true,
        message: 'Statistics updated successfully',
        data: about.stats
      });
    } catch (error) {
      console.error('Error updating statistics:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Add achievement (admin only)
  public async addAchievement(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, year, date } = req.body;

      if (!title || !description || !year) {
        res.status(400).json({
          success: false,
          message: 'Title, description, and year are required'
        });
        return;
      }

      const about = await About.findOne();
      
      if (!about) {
        res.status(404).json({
          success: false,
          message: 'About information not found'
        });
        return;
      }

      const newAchievement = {
        title,
        description,
        year,
        date: date ? new Date(date) : undefined
      };

      about.achievements.push(newAchievement);
      about.updatedAt = new Date();
      
      await about.save();

      res.status(201).json({
        success: true,
        message: 'Achievement added successfully',
        data: newAchievement
      });
    } catch (error) {
      console.error('Error adding achievement:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding achievement',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Add leadership member (admin only)
  public async addLeadershipMember(req: Request, res: Response): Promise<void> {
    try {
      const { name, position, bio, image, email } = req.body;

      if (!name || !position || !bio) {
        res.status(400).json({
          success: false,
          message: 'Name, position, and bio are required'
        });
        return;
      }

      const about = await About.findOne();
      
      if (!about) {
        res.status(404).json({
          success: false,
          message: 'About information not found'
        });
        return;
      }

      const newLeader = {
        name,
        position,
        bio,
        image,
        email
      };

      about.leadership.push(newLeader);
      about.updatedAt = new Date();
      
      await about.save();

      res.status(201).json({
        success: true,
        message: 'Leadership member added successfully',
        data: newLeader
      });
    } catch (error) {
      console.error('Error adding leadership member:', error);
      res.status(500).json({
        success: false,
        message: 'Error adding leadership member',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete achievement (admin only)
  public async deleteAchievement(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Achievement ID is required'
        });
        return;
      }

      const about = await About.findOne();
      
      if (!about) {
        res.status(404).json({
          success: false,
          message: 'About information not found'
        });
        return;
      }

      // Find and remove the achievement
      const initialLength = about.achievements.length;
      about.achievements = about.achievements.filter(achievement => 
        achievement._id?.toString() !== id
      );

      if (about.achievements.length === initialLength) {
        res.status(404).json({
          success: false,
          message: 'Achievement not found'
        });
        return;
      }

      about.updatedAt = new Date();
      await about.save();

      res.status(200).json({
        success: true,
        message: 'Achievement deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting achievement:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting achievement',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Delete leadership member (admin only)
  public async deleteLeadershipMember(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          message: 'Leadership member ID is required'
        });
        return;
      }

      const about = await About.findOne();
      
      if (!about) {
        res.status(404).json({
          success: false,
          message: 'About information not found'
        });
        return;
      }

      // Find and remove the leadership member
      const initialLength = about.leadership.length;
      about.leadership = about.leadership.filter(leader => 
        leader._id?.toString() !== id
      );

      if (about.leadership.length === initialLength) {
        res.status(404).json({
          success: false,
          message: 'Leadership member not found'
        });
        return;
      }

      about.updatedAt = new Date();
      await about.save();

      res.status(200).json({
        success: true,
        message: 'Leadership member deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting leadership member:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting leadership member',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Initialize about data with default values (for development)
  public async initializeAbout(req: Request, res: Response): Promise<void> {
    try {
      // Check if about data already exists
      const existingAbout = await About.findOne();
      
      if (existingAbout) {
        res.status(200).json({
          success: true,
          message: 'About information already exists',
          data: existingAbout
        });
        return;
      }

      // Create initial about data
      const initialAbout = new About({
        mission: "To provide world-class education and foster innovation in a nurturing environment that prepares students for successful careers and meaningful lives.",
        vision: "To be a leading institution that transforms lives through quality education, research, and community engagement.",
        values: "Excellence, Integrity, Innovation, Inclusivity, and Impact in everything we do.",
        history: "Founded in 1985, Excellence University has been committed to academic excellence and student success for over three decades. Our institution has grown from a small college to a comprehensive university, maintaining our core values while adapting to the changing needs of education.",
        stats: {
          students: 15000,
          faculty: 500,
          programs: 50,
          yearsOfExcellence: 39
        },
        achievements: [
          {
            title: "University Established",
            description: "Founded with a commitment to academic excellence and student success",
            year: 1985
          },
          {
            title: "National Accreditation",
            description: "Received full accreditation from National Education Board",
            year: 1995
          },
          {
            title: "Research Center Opening",
            description: "Opened state-of-the-art research facilities",
            year: 2005
          },
          {
            title: "Global Rankings Recognition",
            description: "Ranked among top 100 universities nationally",
            year: 2020
          }
        ],
        leadership: [
          {
            name: "Dr. Elizabeth Harvard",
            position: "President",
            bio: "Dr. Harvard brings over 20 years of experience in higher education administration and academic leadership."
          },
          {
            name: "Prof. Michael Stanford",
            position: "Vice President of Academic Affairs",
            bio: "Prof. Stanford oversees all academic programs and faculty development initiatives."
          },
          {
            name: "Dr. Sarah Yale",
            position: "Dean of Student Affairs",
            bio: "Dr. Yale is dedicated to student success and campus life enhancement."
          }
        ]
      });

      await initialAbout.save();

      res.status(201).json({
        success: true,
        message: 'About information initialized successfully',
        data: initialAbout
      });
    } catch (error) {
      console.error('Error initializing about information:', error);
      res.status(500).json({
        success: false,
        message: 'Error initializing about information',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
