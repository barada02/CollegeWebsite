import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Register a new admin user
export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Create a new user with admin role
    user = new User({
      name,
      email,
      password,
      role: 'admin'
    });

    // Save user to database
    await user.save();

    // Create JWT payload
    const payload = {
      id: user.id,
      role: user.role
    };

    // Use a direct string as the secret
    const secretKey = process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only';
    
    // Use callback version to avoid type issues
    jwt.sign(
      payload,
      secretKey,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) {
          console.error('Error signing JWT token:', err);
          res.status(500).json({ message: 'Error creating authentication token' });
          return;
        }
        res.status(201).json({ token });
      }
    );
  } catch (error) {
    console.error('Error in registerAdmin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Create JWT payload
    const payload = {
      id: user.id,
      role: user.role
    };

    // Use a direct string as the secret
    const secretKey = process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only';
    
    // Use callback version to avoid type issues
    jwt.sign(
      payload,
      secretKey,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) {
          console.error('Error signing JWT token:', err);
          res.status(500).json({ message: 'Error creating authentication token' });
          return;
        }
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user without password
    const user = await User.findById((req as any).user.id).select('-password');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
