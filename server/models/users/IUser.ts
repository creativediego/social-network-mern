import { AccountStatus } from './AccountStatus';
import { AccountType } from './AccoutType';

/**
 * User entity interface
 */
export default interface IUser {
  id?: string;
  uid?: string;
  email: string;
  name?: string;
  username?: string;
  password?: string;
  bio?: string;
  headerImage?: string;
  profilePhoto?: string;
  accountType?: AccountType;
  accountStatus?: AccountStatus;
  followerCount?: number;
  followeeCount?: number;
  postCount?: number;

  // passwordEquals(password: string): boolean;
}
