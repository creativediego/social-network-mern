import { IUser } from './IUser';

export default interface IFollow {
  follower: IUser;
  followee: IUser;
  accepted: boolean;
}
