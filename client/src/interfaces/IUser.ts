export interface IUser {
  id: string;
  username: string;
  password?: string;
  name: string;
  firstName?: string;
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
}
