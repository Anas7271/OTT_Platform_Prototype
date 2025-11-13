import jwt from 'jsonwebtoken';
import { User } from './models/User';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  subscriptionPlan: string;
}

export const generateToken = (user: User): string => {
  const payload: JWTPayload = {
    userId: user._id!.toString(),
    email: user.email,
    role: user.role,
    subscriptionPlan: user.subscriptionPlan,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const getTokenFromHeaders = (headers: Headers): string | null => {
  const authHeader = headers.get('authorization');
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};