export interface IUser {
  id: string;
  uid?: string;
  password?: string;
  username: string;
  name: string;
  email: string;
  bio: string;
  headerImage: string;
  profilePhoto: string;
  birthday?: string;
  accountType?: string;
  accountStatus?: string;
  followerCount?: number;
  followeeCount?: number;
  postCount?: number;
  registeredWithProvider?: boolean;
}
