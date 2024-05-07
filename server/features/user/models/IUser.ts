import { UserAccountStatus } from './UserAccountStatus';
import { UserAccountType } from './UserAccountType';

/**
 * User entity interface
 */
export interface IUser {
  id: string;
  uid: string;
  email: string;
  name: string;
  registeredWithProvider: boolean;
  username?: string;
  bio?: string;
  headerImage?: string;
  profilePhoto?: string;
  accountType?: UserAccountType;
  accountStatus?: UserAccountStatus;
  followerCount: number;
  followeeCount: number;
  postCount?: number;
  lastLogin?: Date;
}
