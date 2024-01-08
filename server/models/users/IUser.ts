import { UserAccountStatus } from './UserAccountStatus';
import { UserAccountType } from './UserAccoutType';

/**
 * User entity interface
 */
export default interface IUser {
  id: string;
  uid?: string;
  email: string;
  name?: string;
  username?: string;
  password?: string;
  bio?: string;
  headerImage?: string;
  profilePhoto?: string;
  accountType?: UserAccountType;
  accountStatus?: UserAccountStatus;
  followerCount?: number;
  followeeCount?: number;
  postCount?: number;
  registeredWithProvider?: boolean;

  // passwordEquals(password: string): boolean;
}
