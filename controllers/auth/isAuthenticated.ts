import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { StatusCode } from '../shared/HttpStatusCode';
import admin from '../../config/firebaseConfig';
import { userDao } from '../../config/configDaos';
dotenv.config();
/**
 * Helper that checks if a user is authenticated by verifying jwt token.
 */
// export const isAuthenticated = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = req.headers['authorization'];
//   if (token == null)
//     return res.status(StatusCode.unauthorized).json({ error: 'unauthorized' });
// const decoded = admin.auth().verifyIdToken(token);
// if (!decoded) {
//   return res
//     .status(StatusCode.forbidden)
//     .json({ error: 'authentication failed' });
// }
// req.user = decoded;
// next();
//   jwt.verify(
//     token,
//     process.env.JWT_SECRET! as string,
//     (err: any, user: any) => {
//       if (err)
//         return res
//           .status(StatusCode.forbidden)
//           .json({ error: 'authentication failed' });
//       req.user = user;
//       next();
//     }
//   );
// };

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['authorization'];
  if (token == null)
    return res.status(StatusCode.unauthorized).json({ error: 'unauthorized' });
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    if (!decoded) {
      return res
        .status(StatusCode.forbidden)
        .json({ error: 'authentication failed' });
    }
    const decodedUser: any = {
      email: decoded.email,
      name: decoded.name,
      profilePicture: decoded.picture,
    };
    const existingUser = await userDao.create(decodedUser);
    req.user = existingUser;
    next();
  } catch (err) {
    console.log('is authenticated error:', err);
    return res
      .status(StatusCode.forbidden)
      .json({ error: 'Error authenticating credentials. Log in again.' });
  }
};
