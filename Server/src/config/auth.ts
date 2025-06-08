import { Secret } from 'jsonwebtoken';

// jwt configuration
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only' as Secret,
  expiresIn: '1d' // Token expires in 1 day
};
