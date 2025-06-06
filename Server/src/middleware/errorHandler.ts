import { Request, Response, NextFunction } from 'express';

// Error handling middleware
export const errorHandler = (
  err: Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
): void => {
  console.error(err.stack);
  
  res.status(500).json({
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};
