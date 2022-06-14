import { IUser } from './IUser';

export interface ITuit {
  id: string;
  tuit: string;
  author: IUser;
  createdAt: string;
  image?: string;
  imageFile?: File | Blob | undefined;
  youtube?: string;
  hashtags?: string[];
}
