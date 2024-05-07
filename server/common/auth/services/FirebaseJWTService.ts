import { IJWTService } from './IJWTService';
import admin from '../../../config/firebaseConfig';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { Code } from '../../enums/StatusCode';
import { ServiceError } from '../../errors/ServiceError';

export class FirebaseJWTService implements IJWTService {
  verifyToken = async (token: string): Promise<DecodedIdToken> => {
    const user = await admin.auth().verifyIdToken(token);
    if (!user)
      throw new ServiceError(
        'Invalid or expired session/token.',
        Code.unauthorized
      );
    return user;
  };

  signToken = async (payload: any): Promise<string> => {
    return await admin.auth().createCustomToken(payload);
  };
}
