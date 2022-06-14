import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import admin from '../../config/firebaseConfig';
import { userDao } from '../../config/configDaos';
import UnauthorizedException from './UnauthorizedException';
import ForbiddenException from './ForbiddenException';
dotenv.config();

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const token = req.headers['authorization'];
  if (!token) {
    return next(
      new UnauthorizedException('Failed to login: No token provided.')
    );
  }
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    if (!decoded) {
      return next(
        new ForbiddenException('Failed to login: Invalid or expired session.')
      );
    }
    const decodedUser: any = {
      email: decoded.email,
      name: decoded.name,
      profilePicture: decoded.picture,
    };
    const existingUser = await userDao.create(decodedUser);
    req.user = existingUser;
    return next();
  } catch (err) {
    return next(
      new UnauthorizedException(
        'Error authenticating credentials. Log in again.'
      )
    );
  }
};
