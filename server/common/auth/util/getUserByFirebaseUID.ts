import { DatabaseError } from '../../errors/DatabaseError';
import UserModel from '../../../features/user/models/UserModel';
import { IUser } from '../../../features/user/models/IUser';

/**
 * Get a user by their Firebase UID. Takes a Firebase UID and returns a user object.
 * @param firebaseUID the Firebase UID of the user to find
 * @returns the Firebase user or null if not found
 */
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
