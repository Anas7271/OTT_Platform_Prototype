import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  subscriptionPlan: 'default' | 'lite' | 'premium';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
  subscriptionPlan?: 'default' | 'lite' | 'premium';
}

export class UserModel {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  static validateSubscriptionAccess(userSubscription: string, contentAccessLevel: string): boolean {
    if (contentAccessLevel === 'everyone') return true;
    if (contentAccessLevel === 'lite' && (userSubscription === 'lite' || userSubscription === 'premium')) return true;
    if (contentAccessLevel === 'premium' && userSubscription === 'premium') return true;
    return false;
  }
}