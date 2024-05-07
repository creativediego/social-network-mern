import { DatabaseError } from '../../errors/DatabaseError';
import UserModel from '../../../features/user/models/UserModel';
import { IUser } from '../../../features/user/models/IUser';

export const getUserByFirebaseUID = async (
  firebaseUID: string
): Promise<IUser | null> => {
  try {
    // Query the database to find a user by Firebase UID
    const user = await UserModel.findOne({ uid: firebaseUID });
    return user;
  } catch (error) {
    throw new DatabaseError('Failed to find user by Firebase UID.');
  }
};
