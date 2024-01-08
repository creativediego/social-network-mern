import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import admin from '../../config/firebaseConfig';
import { UnauthorizedException } from './UnauthorizedException';
import { ForbiddenException } from './ForbiddenException';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import IUser from '../../models/users/IUser';
import { getUserByFirebaseUID } from './getUserByFirebaseUID';

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

    // Get user from database
    const dbUser = await getUserByFirebaseUID(decoded.uid);

    if (!dbUser) {
      const decodedUser: IUser = {
        id: '',
        uid: decoded.uid,
        email: decoded.email || '',
        name: decoded.name,
        registeredWithProvider:
          decoded.firebase.sign_in_provider !== 'password',
      };
      req.user = decodedUser;
      return next();
    }

    const decodedUser: IUser = {
      id: dbUser.id,
      uid: dbUser.uid,
      email: dbUser.email,
      name: dbUser.name,
      profilePhoto: dbUser.profilePhoto,
      bio: dbUser.bio,
      username: dbUser.username,
      registeredWithProvider: decoded.firebase.sign_in_provider !== 'password',
    };
    req.user = decodedUser;
    return next();
  } catch (err) {
    // Cast err to type Error
    const error = err as Error;
    return next(
      new UnauthorizedException(
        'Error validating login session or expired session. Log in again.'
      )
    );
  }
};
