import { IJWTService } from './IJWTService';
import admin from '../config/firebaseConfig';
import { UnauthorizedException } from '../controllers/auth/UnauthorizedException';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export default class FirebaseJWTService implements IJWTService {
  verifyToken = async (token: string): Promise<DecodedIdToken> => {
    const user = await admin.auth().verifyIdToken(token);
    if (!user) throw new UnauthorizedException('Invalid or expired session.');
    return user;
  };

  signToken = async (payload: any): Promise<string> => {
    return await admin.auth().createCustomToken(payload);
  };
}
