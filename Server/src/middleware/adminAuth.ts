// This middleware is currently not used since JWT authentication has been simplified
// Uncomment when JWT authentication is re-implemented

/*
import { Request, Response, NextFunction } from 'express';

// Interface for extending Express Request
interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const adminAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Check if user exists in request (should be set by auth middleware)
  if (!req.user) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  // Check if user is an admin
  if (req.user.role !== 'admin') {
    res.status(403).json({ message: 'Access denied. Admin privileges required' });
    return;
  }

  // If user is admin, proceed
  next();
};
*/
