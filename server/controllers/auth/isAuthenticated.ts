import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import admin from '../../config/firebaseConfig';
import { UnauthorizedException } from './UnauthorizedException';
import { ForbiddenException } from './ForbiddenException';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

dotenv.config();

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const header = req.headers['authorization'] || '';
  const bearer = header.split(' ');
  const token = bearer[1];
  if (!token || token === 'null') {
    return next(
      new UnauthorizedException('Failed to login: No token provided.')
    );
  }
  try {
    const decoded: DecodedIdToken = await admin.auth().verifyIdToken(token);
    if (!decoded) {
      return next(
        new ForbiddenException('Failed to login: Invalid or expired session.')
      );
    }
    const decodedUser: any = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      profilePicture: decoded.picture,
    };
    req.user = decodedUser;
    return next();
  } catch (err) {
    // Cast err to type Error
    const error = err as Error;
    return next(
      new UnauthorizedException(
        error.message ? error.message : 'Error validating token session.'
      )
    );
  }
};
