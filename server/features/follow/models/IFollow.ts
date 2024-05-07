import { IUser } from '../../user/models/IUser';

export interface IFollow {
  id: string;
  follower: IUser;
  followee: IUser;
  accepted: boolean;
}
