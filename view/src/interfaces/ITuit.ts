import { IUser } from './IUser';

export interface ITuit {
  id: string;
  tuit: string;
  author: IUser;
  createdAt: string;
  image?: string;
  imageFile?: File;
  youtube?: string;
  hashtags?: string[];
}
