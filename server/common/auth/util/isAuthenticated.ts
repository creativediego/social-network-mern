import dotenv from 'dotenv';
import admin from '../../../config/firebaseConfig';
import { Request, Response, NextFunction } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { IUser } from '../../../features/user/models/IUser';
import { getUserByFirebaseUID } from './getUserByFirebaseUID';
import { ControllerError } from '../../errors/ControllerError';
import { UserAccountStatus } from '../../../features/user/models/UserAccountStatus';
import { AuthError } from '../../errors/AuthError';

dotenv.config();

/**
 * Middleware that checks if a user is authenticated.
 */
export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const header = req.headers['authorization'] || '';
  const bearer = header.split(' ');
  const token = bearer[1];

  if (!token || token === 'null') {
    return next(new ControllerError('Failed to login: No token provided.'));
  }
  try {
    const decoded: DecodedIdToken = await admin.auth().verifyIdToken(token);
    if (!decoded) {
      return next(
        new ControllerError(
          'Unauthorized login: Invalid or expired session.',
          401
        )
      );
    }

    // Get user from database
    const dbUser = await getUserByFirebaseUID(decoded.uid);

    // If user is not active, do not allow login
    if (dbUser && dbUser.accountStatus !== UserAccountStatus.Active) {
      return next(
        new AuthError(
          `Unauthorized login: User account is ${dbUser.accountStatus}.`,
          401
        )
      );
    }
    // For users that are not in the database
    if (!dbUser) {
      const decodedUser: IUser = {
        id: '',
        uid: decoded.uid,
        email: decoded.email || '',
        profilePhoto: '',
        name: decoded.name,
        registeredWithProvider:
          decoded.firebase.sign_in_provider !== 'password',
        followeeCount: 0,
        followerCount: 0,
      };
      req.user = decodedUser;
      return next();
    }
    // For users that are in the database
    const decodedUser: IUser = {
      id: dbUser.id,
      uid: dbUser.uid,
      email: dbUser.email,
      name: dbUser.name,
      profilePhoto: dbUser.profilePhoto,
      bio: dbUser.bio,
      username: dbUser.username,
      registeredWithProvider: decoded.firebase.sign_in_provider !== 'password',
      followeeCount: dbUser.followeeCount,
      followerCount: dbUser.followerCount,
    };
    req.user = decodedUser;
    return next();
  } catch (err) {
    // Cast err to type Error
    const error = err as Error;
    return next(
      new AuthError(
        'Internal Error validating login session or expired session.',
        401,
        error
      )
    );
  }
};
