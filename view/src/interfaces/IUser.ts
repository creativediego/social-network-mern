export interface IUser {
  id: string;
  username: string;
  name: string;
  firstName?: string;
  email: string;
  bio: string;
  birthday?: string;
  headerImage: string;
  profilePhoto: string;
  accountType: string;
  accountStatus?: string;
  followerCount?: number;
  followeeCount?: number;
  tuitCount?: number;
}
