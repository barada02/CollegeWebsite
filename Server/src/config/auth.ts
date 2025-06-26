// This file is currently not used since JWT authentication has been simplified
// It can be deleted or kept for future JWT implementation

// Uncomment and use this configuration when JWT is re-implemented:
/*
import { Secret } from 'jsonwebtoken';

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only' as Secret,
  expiresIn: '1d' // Token expires in 1 day
};
*/
