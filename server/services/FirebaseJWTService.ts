import { IJWTService } from './IJWTService';
import admin from '../config/firebaseConfig';

export default class FirebaseJWTService implements IJWTService {
  verifyToken = async (token: string): Promise<any> => {
    return await admin.auth().verifyIdToken(token);
  };

  signToken = async (payload: any): Promise<any> => {
    return await admin.auth().createCustomToken(payload);
  };
}
