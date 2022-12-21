import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import IJWTService from './IJWTService';
dotenv.config();
export default class JWTService implements IJWTService {
  public constructor() {}

  verifyToken = (token: string): any => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err: any) {
      throw new Error(`JWT verification error: ${err.message}`);
    }
  };

  signToken = (payload: any): string => {
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '3600s',
    });
    return token;
  };
}