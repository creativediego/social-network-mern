import UserModel from '../../mongoose/users/UserModel';
import IUser from '../../models/users/IUser';
import DaoDatabaseException from '../../errors/DaoDatabseException';

export const getUserByFirebaseUID = async (
  firebaseUID: string
): Promise<IUser | null> => {
  try {
    // Query the database to find a user by Firebase UID
    const user = await UserModel.findOne({ uid: firebaseUID });
    return user;
  } catch (error) {
    throw new DaoDatabaseException('Failed to find user by Firebase UID.');
  }
};
