// This middleware is currently not used since JWT authentication has been simplified
// Uncomment when JWT authentication is re-implemented

/*
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interface for extending Express Request
interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if token exists
  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  try {
    // Use a direct string as the secret
    const secretKey = process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only';
    
    // Verify token
    const decoded = jwt.verify(token, secretKey) as { id: string; role: string };
    
    // Add user from payload to request
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
*/
