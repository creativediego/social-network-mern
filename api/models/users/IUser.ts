import { AccountStatus } from './AccountStatus';
import { AccountType } from './AccoutType';

/**
 * User entity interface
 */
export default interface IUser {
  id?: string;
  username: string;
  password: string;
  name: string;
  email: string;
  bio: string;
  birthday: Date;
  headerImage: string;
  profilePhoto: string;
  accountType: AccountType;
  accountStatus?: AccountStatus;
  followerCount?: number;
  followeeCount?: number;
  postCount?: number;

  // passwordEquals(password: string): boolean;
}
