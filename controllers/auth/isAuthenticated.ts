import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { StatusCode } from '../shared/HttpStatusCode';
dotenv.config();
/**
 * Helper that checks if a user is authenticated by verifying jwt token.
 */
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers['authorization'];
  if (token == null)
    return res.status(StatusCode.unauthorized).json({ error: 'unauthorized' });
  jwt.verify(
    token,
    process.env.JWT_SECRET! as string,
    (err: any, user: any) => {
      if (err)
        return res
          .status(StatusCode.forbidden)
          .json({ error: 'authentication failed' });
      req.user = user;
      next();
    }
  );
};
