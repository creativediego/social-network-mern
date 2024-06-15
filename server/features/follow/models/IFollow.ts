import { IUser } from '../../user/models/IUser';

/**
 * Represents the follow relationship between two users.
 */
export interface IFollow {
  id: string;
  follower: IUser;
  followee: IUser;
  accepted: boolean;
}
