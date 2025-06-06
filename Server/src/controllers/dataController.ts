import { Request, Response } from 'express';
import Data, { IData } from '../models/Data';

// Get all data
export const getAllData = async (req: Request, res: Response): Promise<void> => {
  try {
    const allData = await Data.find().sort({ createdAt: -1 });
    res.status(200).json(allData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Server error while fetching data' });
  }
};

// Create new data
export const createData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    
    // Validate input
    if (!title || !description) {
      res.status(400).json({ message: 'Title and description are required' });
      return;
    }
    
    // Create new data document
    const newData = new Data({
      title,
      description
    });
    
    // Save to database
    const savedData = await newData.save();
    
    res.status(201).json(savedData);
  } catch (error) {
    console.error('Error creating data:', error);
    res.status(500).json({ message: 'Server error while creating data' });
  }
};
